import {
	PASS_BOMB, PLAYER_ENTERED, PLAYER_LEFT,
	playerEntered, playerLeft,
	countdown, newRound, tick, playerBlewUp, gameDone, foundWord
} from '../messages';
import {
	gameStarted, isMyTurn, nextPlayer, maxTime, finishedGame, currentLead, currentPlayer
} from '../selectors';
import existsInDictionary from '../words/dictionary';
import createServerStore from '../store/server';

import { Store } from 'redux';
import { Client } from 'socket.io-client';
import { State, ServerState } from '../reducers'

/**
 * Listens to and handles the PASS_BOMB and PLAYER_LEFT events from a client.
 * An acknowledgement is sent to show that the passed word was received,
 * which contains an error if the word is invalid or it isn't the player's turn.
 * @param {SocketIO.Client}
 * @param {Redux.Store|Redux.MiddlewareAPI} store
 */
function handleClientEvents(socket: Client, store: Store<ServerState>) {
	socket.on(PASS_BOMB, (word, callback) => {
		const id = socket.id;
		const state = store.getState();

		let err;
		if (isMyTurn(state, id)) {
			err = new Error(`It's not currently ${id}'s turn`);
		} else if (existsInDictionary(word)) {
			err = new Error(`${word} doesn't exist in dictionary`);
		}

		if (!err) {
			store.dispatch(foundWord(word, id, nextPlayer(state)));
		}

		callback(err);
	});

	socket.on(PLAYER_LEFT, () => store.dispatch(playerLeft(socket)));
}

/**
 * @returns {Promise<void>} resolves after `time` milliseconds
 */
function wait(time: number) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * Runs each round of the game, and resolves once done.
 * This function is recursive and calls itself to start the next round
 * if the maximum amount hasn't been reached yet.
 * @param {Redux.Store|Redux.MiddlewareAPI} store
 * @param {number} maxRounds
 * @returns {Promise<void>} once all rounds are done
 */
function runRounds(store: Store<State>, maxRounds = 3): Promise<void> {
	const roundStart = Date.now();
	store.dispatch(newRound());

	const timer = setInterval(() => {
		const timeElapsed = Date.now() - roundStart;
		store.dispatch(tick(timeElapsed));
	}, 1000);

	return wait(maxTime(store.getState())).then(() => {
		clearInterval(timer);
		const holder = currentPlayer(store.getState());
		store.dispatch(playerBlewUp(holder));

		if (finishedGame(store.getState(), maxRounds)) return;

		return runRounds(store, maxRounds);
	});
}

/**
 * Counts down and resolves when the timer reaches 0
 * @param {Redux.Store|Redux.MiddlewareAPI} store
 * @returns {Promise<void>} resolves after timer has finished
 */
function runCountdown(store) {
	return new Promise((resolve) => {
		const timer = setInterval(() => {
			store.dispatch(countdown());
			if (gameStarted(store.getState())) resolve(timer);
		}, 1000);
	}).then(clearInterval);
}

/**
 * Ends the game
 */
function endGame(store: Store<ServerState>) {
	const winners = currentLead(store.getState());
	store.dispatch(gameDone(winners));
}

export const games = new Map<string, Store<ServerState>>(); // Map<id, redux.Store>

/**
 * Games are represented as seperate namespaces rather than socket rooms
 *
 * @param {SocketIO.Server} io
 * @param {string} path to use for the namespace.
 * @returns {SocketIO.Namespace} namespace representing this game
 */
export default function newGame(io: SocketIO.Server, path: string): Store<ServerState> {
	const existing = games.get(path);
	if (existing) return existing;

	const nsp = io.of(path);
	const store = createServerStore(nsp);

	games.set(path, store);

	let ready = false;
	function tryToStart() {
		if (ready) return;
		ready = true;

		return runCountdown(store)
			.then(() => runRounds(store))
			.then(() => endGame(store))
			.then(() => games.delete(path));
	}

	nsp.on(PLAYER_ENTERED, (socket) => {
		// TODO: get name of player / wheter or not they are a spectator
		store.dispatch(playerEntered(socket));
		tryToStart();
		handleClientEvents(socket, store);
	});

	return store;
}
