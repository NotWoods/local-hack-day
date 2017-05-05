import {
	PASS_BOMB, PLAYER_ENTERED, PLAYER_LEFT,
	playerEntered, playerLeft,
	countdown, newRound, tick, playerBlewUp, gameDone, foundWord, setRoomID
} from '../messages';
import {
	gameStarted, isMyTurn, nextPlayer, maxTime, finishedGame, currentLead, currentPlayer
} from '../selectors';
import existsInDictionary from '../words/dictionary';
import createServerStore from '../store/server';
import { interval, wait } from '../utils';

import { Store } from 'redux';
import { ServerState } from '../reducers/';

type ErrorCB = (err: Error) => void;

export default class Room {
	io: SocketIO.Namespace;
	store: Store<ServerState>;

	started: boolean;
	maxRounds: number;

	/**
	 * Games are represented as seperate namespaces rather than socket rooms
	 * @param {SocketIO.Server} io
	 * @param {string} roomID to use for the namespace.
	 * @param {number} maxRounds # that the game runs
	 */
	constructor(io: SocketIO.Server, roomID: string, maxRounds: number) {
		// Initialization
		this.io = io.of(`/${roomID}`);
		this.store = createServerStore(this.io);
		this.maxRounds = maxRounds;

		const { dispatch } = this.store;
		dispatch(setRoomID(roomID));

		this.io.on(PLAYER_ENTERED, player => {
			// TODO: get name of player / wheter or not they are a spectator
			dispatch(playerEntered(player));

			// Start running the game when the first player enters
			if (!this.started) this.activateGame();

			// Handle event fired when a player submits a word
			player.on(PASS_BOMB, (word: string, flagError: ErrorCB) => {
				try { this.handleWordSubmission(player.id, word); }
				catch (err) { flagError(err); }
			})
			// Handle event fired when the player leaves the room
			player.once(PLAYER_LEFT, () => dispatch(playerLeft(player)));
		});
	}

	async activateGame() {
		this.started = true;
		const { dispatch, getState } = this.store;

		await this.runCountdown();
		while (!finishedGame(getState(), this.maxRounds)) {
			// Keep playing as long as the # of rounds does not exceed the max #
			await this.playRound();
		}

		// Select winners and display them
		const winners = currentLead(getState());
		dispatch(gameDone(winners));

		this.destroy();
	}

	/**
	 * Counts down and resolves when the timer reaches 0
	 * @returns {Promise<void>} resolves after timer has finished
	 */
	runCountdown(): Promise<void> {
		const { dispatch, getState } = this.store;
		return interval(1000, () => {
			dispatch(countdown());
			return gameStarted(getState());
		});
	}

	/**
	 * Runs a round of the game, and resolves once time is up and a loser has
	 * been selected.
	 */
	async playRound() {
		const { dispatch, getState } = this.store;
		const roundStart = Date.now();
		dispatch(newRound());

		// Tick every second and set the new countdown time
		const ticker = setInterval(() => dispatch(tick(Date.now() - roundStart)), 1000);

		// Wait until time is up, then delete the ticker
		await wait(maxTime(getState()));
		clearInterval(ticker);

		// Select the losing player and emit to clients
		const loser = currentPlayer(getState());
		dispatch(playerBlewUp(loser));
	}

	/**
	 * Should be called when a player submits a word.
	 */
	handleWordSubmission(playerID: string, word: string) {
		const { dispatch, getState } = this.store;

		// Check that its currently the player's turn
		if (isMyTurn(getState(), playerID))
			throw new Error(`It's not currently ${playerID}'s turn`);

		// Check if the word exists
		if (!existsInDictionary(word))
			throw new Error(`${word} doesn't exist in dictionary`);

		const willReceiveBomb = nextPlayer(getState());
		dispatch(foundWord(word, playerID, willReceiveBomb));
	}

	destroy() {
		for (const player of Object.values(this.io.sockets)) {
			player.removeAllListeners();
			player.disconnect(); // TODO: remove player from room
		}
	}
}
