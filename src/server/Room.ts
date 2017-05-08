import {
	PASS_BOMB, PLAYER_ENTERED, PLAYER_LEFT,
	playerEntered, playerLeft,
	countdown, newRound, tick,
	playerBlewUp, gameDone,
	foundWord, setRoomID,
} from '../messages';
import {
	gameStarted, isMyTurn, nextPlayer, maxTime,
	finishedGame, currentLead, currentPlayer,
} from '../selectors';
import existsInDictionary from '../words/dictionary';
import createServerStore from '../store/server';
import { interval, wait } from '../utils';

import { Store } from 'redux';
import { ServerState } from '../reducers/';

type ErrorCB = (err: Error) => void;
type DoneCB = (finalState: ServerState) => void;

export default class Room {
	private watchers: Set<DoneCB>;
	private started: boolean;
	private maxRounds: number;

	io: SocketIO.Server;
	store: Store<ServerState>;
	roomID: string;

	/**
	 * Games are represented as seperate namespaces rather than socket rooms
	 * @param {SocketIO.Server} io
	 * @param {string} roomID to use for the namespace.
	 * @param {number} maxRounds # that the game runs
	 */
	constructor(io: SocketIO.Server, roomID: string, maxRounds: number) {
		// Initialization
		this.io = io;
		this.store = createServerStore(this.io);
		this.maxRounds = maxRounds;
		this.watchers = new Set();
		this.roomID = roomID;

		const { dispatch } = this.store;
		dispatch(setRoomID(roomID));
	}

	addPlayer(player: SocketIO.Socket, name?: string) {
		const { dispatch } = this.store;
		// Mark that the player has entered
		dispatch(playerEntered(player, name));

		// Start running the game when the first player enters
		if (!this.started) this.activateGame();

		// Handle event fired when a player submits a word
		player.on(PASS_BOMB, (word: string) => {
			try { this.handleWordSubmission(player.id, word); }
			catch (err) { this.io.to(player.id).emit('error', err.message); }
		});
	}

	/**
	 * @returns {boolean} was this the last player
	 */
	removePlayer(player: SocketIO.Socket) {
		const { dispatch, getState } = this.store;
		dispatch(playerLeft(player));

		return getState().spectator.players.length === 0;
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
			// Countdown every second
			dispatch(countdown());
			// Stop (return true) if the game started
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
		const ticker = setInterval(
			() => dispatch(tick(Date.now() - roundStart)),
			1000,
		);

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
			throw new Error(`WordError: It's not currently your turn`);

		// Check if the word exists
		if (!existsInDictionary(word))
			throw new Error(`WordError: ${word} doesn't exist in dictionary`);

		const willReceiveBomb = nextPlayer(getState());
		dispatch(foundWord(word, playerID, willReceiveBomb));
	}

	destroy() {
		const room = this.io.sockets.adapter.rooms[this.roomID];
		for (const id of Object.keys(room.sockets)) {
			const user = this.io.sockets.connected[id];
			user.leave(this.roomID);
		}

		const finalState = this.store.getState();
		for (const callback of this.watchers) callback(finalState);
		this.watchers.clear();
	}

	onEnd(callback: DoneCB) {
		this.watchers.add(callback);
	}
}
