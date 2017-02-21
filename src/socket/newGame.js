import { createStore, combineReducers } from 'redux';
import {
	PASS_BOMB, PLAYER_ENTERED, PLAYER_LEFT,
	playerEntered, playerLeft,
	countdown, newRound, tick, playerBlewUp, gameDone, foundWord
} from '../messages.js';
import {
	gameStarted, isMyTurn, nextPlayer, maxTime, finishedGame, currentLead
} from '../selectors.js';
import existsInDictionary from '../words/dictionary.js';
import startGame from './startGame.js';
import endGame from './endGame.js';

/**
 * Listens to and handles the PASS_BOMB and PLAYER_LEFT events from a client.
 * An acknowledgement is sent to show that the passed word was received,
 * which contains an error if the word is invalid or it isn't the player's turn.
 */
function handleClientEvents(socket, { emit, getState }) {
	socket.on(PASS_BOMB, (word, callback) => {
		const id = socket.id;

		let err;
		if (isMyTurn(gameStore.getState(), id)) {
			err = new Error(`It's not currently ${id}'s turn`);
		} else if (existsInDictionary(word)) {
			err = new Error(`${word} doesn't exist in dictionary`);
		}

		if (!err) {
			emit(foundWord(word, id, nextPlayer(getState())));
		}

		callback(err);
	});

	socket.on(PLAYER_LEFT, () => emit(playerLeft(socket)));
}

/**
 * @returns {Promise<void>} resolves after `time` milliseconds
 */
function wait(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * Runs each round of the game, and resolves once done.
 * This function is recursive and calls itself to start the next round
 * if the maximum amount hasn't been reached yet.
 * @param {number} maxRounds
 * @returns {Promise<void>} once all rounds are done
 */
function runRounds(store, maxRounds = 3) {
	const { emit, getState } = store;
	const roundStart = Date.now();
	emit(newRound());

	const timer = setInterval(() => {
		const timeElapsed = Date.now() - roundStart;
		emit(tick(timeElapsed));
	}, 1000);

	return wait(maxTime(getState())).then(() => {
		clearInterval(timer);
		const holder = currentPlayer(getState());
		emit(playerBlewUp(holder));

		if (!finishedGame(getState(), maxRounds)) return runRounds(store, maxRounds);
	});
}

/**
 * Counts down and resolves when the timer reaches 0
 * @param {Function} emit
 * @param {Function} getState
 * @returns {Promise<void>} resolves after timer has finished
 */
function runCountdown({ emit, getState }) {
	return new Promise((resolve) => {
		const timer = setInterval(() => {
			emit(countdown());
			if (gameStarted(getState())) resolve(timer);
		}, 1000);
	}).then(clearInterval);
}

/**
 * Ends the game
 */
function endGame({ emit, getState }) {
	const winner = currentLead(getState());
	emit(gameDone(winner));
}


export const games = new Map(); // Map<id, redux.Store>

/**
 * Games are represented as seperate namespaces rather than socket rooms
 *
 * @param {socket.Server} io
 * @param {string} path to use for the namespace.
 * @returns {socket.Namespace} namespace representing this game
 */
export default function newGame(io, path) {
	if (games.has(path)) return games.get(path);

	const nsp = io.of(path);
	const store = createStore(combineReducers({ global, spectator }));
	games.set(path, store);

	store.emit = (action) => {
		store.dispatch(action);
		nsp.emit(action.type, action.payload);
	};

	let ready = false;
	function tryToStart() {
		if (ready) return;
		ready = true;

		return runCountdown(store)
			.then(() => runRounds(store))
			.then(() => endGame())
			.then(() => games.delete(path));
	}

	nsp.on(PLAYER_ENTERED, (socket) => {
		// TODO: get name of player / wheter or not they are a spectator
		store.emit(playerEntered(socket));
		tryToStart();
		handleClientEvents(socket, store);
	});

	return store;
}
