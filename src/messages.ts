import generateString from './words/generateString.js';

export const NEW_ROUND = 'bomb.new';
export const TICK = 'bomb.tick';
export const SYNC = 'game.sync';
export const COUNTDOWN = 'game.countdown';
export const PASS_BOMB = 'bomb.pass';
export const GAME_OVER = 'game.over';
export const CLIENT_DONE = 'bomb.send';
export const FOUND_WORD = 'bomb.passed';
export const PLAYER_ENTERED = 'connection';
export const PLAYER_LEFT = 'disconnect';
export const BLEW_UP = 'bomb.done';
export const SET_ROOM_ID = 'game.id'

/**
 * Begin a new round and reset timers
 * @param {string} [letters] letters to use for the round. Generated if unset.
 * @param {number} [maxTime] modifies the current maxTime to a new value if set
 */
export function newRound(letters = generateString(), maxTime: number | null = null) {
	return {
		type: NEW_ROUND,
		payload: { letters: letters.toUpperCase(), maxTime },
	};
}

/**
 * Ticks during a round
 * @param {number} [timeElapsed] if not set, the time elapsed increases by 1
 */
export function tick(timeElapsed?: number) {
	return { type: TICK, payload: timeElapsed };
}

/**
 * Fired when a player joins this game
 * @param {Socket|string} socket representing client, or the client's id
 */
export function playerEntered(socket: string | { id: string }, name?: string) {
	const id = typeof socket === 'string' ? socket : socket.id;
	return {
		type: PLAYER_ENTERED,
		payload: {
			id,
			name,
		},
	};
}

/**
 * Fired when a player leaves this game
 * @param {Socket|string} socket representing client, or the client's id
 */
export function playerLeft(socket: string | { id: string }) {
	const id = typeof socket === 'string' ? socket : socket.id;
	return { type: PLAYER_LEFT, payload: id };
}

/**
 * Reduces the time remaining before the game begins.
 * @param {number} [newTime] - if set, the countdown is moved to this time
 */
export function countdown(newTime?: number) {
	return { type: COUNTDOWN, payload: newTime };
}

/**
 * Indicates the round finished.
 * @param {string} id of the player
 */
export function playerBlewUp(id: string) {
	return { type: BLEW_UP, payload: id };
}

/**
 * Fires when the game ends
 * @param {string} winner ID of the winning player
 */
export function gameDone(winners: string[]) {
	return { type: GAME_OVER, payload: { winners } };
}

/**
 * Fired by the server when the client finds a valid word
 * @param {string} word that was found
 * @param {string} id of the player who found the word
 * @param {string} next player's ID
 */
export function foundWord(word: string, id: string, next: string) {
	return { type: FOUND_WORD, payload: { word, id, next } };
}

export function setRoomID(id: string) {
	return { type: SET_ROOM_ID, payload: id };
}
