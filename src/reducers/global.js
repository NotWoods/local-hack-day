import { NEW_ROUND, TICK, SYNC, COUNTDOWN, FOUND_WORD, GAME_OVER } from '../messages';

const maxTime = parseInt(process.env.MAX_TIME, 10) || 60;
const countdown = parseInt(process.env.COUNTDOWN_START, 10) || 60;

const defaultState = Object.freeze({
	round: 0, // Current round number
	maxTime, // Maximum time in a round
	timeLeft: maxTime, // Time remaining in a round
	holdingBomb: '', // Player that is holding the bomb
	letters: '', // Current letters needed in a word
	winner: '', // Name of the winner at the end of the game
	countdown, // Current countdown number, before the game has started
});

function newState(oldState) {
	return Object.assign({}, oldState);
}

/**
 * Reducer to track global state shared by the server and clients. Keeps track of
 * the current round number and letters, who is holding the bomb, as well as
 * remaining time and the winner of the game (once the game ends).
 */
export default function global(_state = defaultState, { type, payload }) {
	let state = _state;
	switch (type) {
		case NEW_ROUND:
			state = newState(state);
			state.round++;
			if (payload.maxTime) state.maxTime = payload.maxTime;
			state.timeLeft = state.maxTime;
			state.letters = payload.letters.toUpperCase();
			break;

		case TICK:
			state = newState(state);
			if (payload) state.timeLeft = Math.max(0, state.maxTime - payload);
			else state.timeLeft = Math.max(0, state.timeLeft - 1);
			break;

		case SYNC:
			state = Object.assign({}, state, payload.global);
			break;

		case COUNTDOWN:
			state = newState(state);
			if (payload) state.countdown = payload;
			else state.countdown--;

			if (state.countdown < 0) state.countdown = 0;
			break;

		case FOUND_WORD:
			state = newState(state);
			state.holdingBomb = payload.next;
			break;

		case GAME_OVER:
			state = newState(state);
			state.winner = payload.winner;
			break;
	}

	return state;
}
