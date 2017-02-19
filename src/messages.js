import generateString from './generateString.js';

export const NEW_ROUND = 'bomb.new';
export const TICK = 'bomb.tick';
export const SYNC = 'game.sync';
export const COUNTDOWN = 'game.countdown';
export const PASS_BOMB = 'bomb.pass';
export const GAME_OVER = 'game.over';
export const CLIENT_DONE = 'bomb.send';
export const PLAYER_ENTERED = 'player.new';
export const FOUND_WORD = 'bomb.passed';
export const PLAYER_ENTERED = 'connection';
export const BLEW_UP = 'bomb.done';

/**
 * Begin a new round and reset timers
 */
export function newRound(letters = generateString(), maxTime = null) {
	return { type: NEW_ROUND, payload: { letters, maxTime } };
}

/**
 * Ticks during a round
 */
export function tick(timeElapsed) {
	return { type: TICK, payload: timeElapsed };
}

/**
 * Fired when a player joins this game
 * @param {Socket|string} socket representing client, or the client's id
 */
export function playerEntered(socket) {
	const id = typeof socket === 'string' ? socket : socket.id;
	return { type: PLAYER_ENTERED, payload: { id } };
}

/**
 * Reduces the time remaining before the game begins.
 * @param {number} [newTime] - if set, the countdown is moved to this time
 */
export function countdown(newTime) {
	return { type: COUNTDOWN, payload: newTime };
}

/**
 * Indicates the round finished.
 */
export function playerBlewUp(id) {
	return { type: BLEW_UP, payload: id };
}
