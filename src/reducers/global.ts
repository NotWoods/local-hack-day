import {
	NEW_ROUND, TICK, SYNC, COUNTDOWN, FOUND_WORD, GAME_OVER, SET_ROOM_ID,
} from '../messages';
import { StandardAction } from '../socket/'
import { newState } from '../utils';

const maxTime = parseInt(process.env.MAX_TIME, 10) || 60;
const countdown = parseInt(process.env.COUNTDOWN_START, 10) || 60;

type ID = string;
export interface GlobalState {
	roomID: ID,
	round: number,
	maxTime: number,
	timeLeft: number,
	holdingBomb: ID,
	letters: string,
	winner: ID,
	countdown: number,
}

const defaultState = Object.freeze({
	roomID: '',
	round: 0, // Current round number
	maxTime, // Maximum time in a round
	timeLeft: maxTime, // Time remaining in a round
	holdingBomb: '', // Player that is holding the bomb
	letters: '', // Current letters needed in a word
	winner: '', // Name of the winner at the end of the game
	countdown, // Current countdown number, before the game has started
});

/**
 * Reducer to track global state shared by the server and clients. Keeps track of
 * the current round number and letters, who is holding the bomb, as well as
 * remaining time and the winner of the game (once the game ends).
 */
export default function global(_state: GlobalState = defaultState, action: StandardAction) {
	let state = _state;
	switch (action.type) {
		case NEW_ROUND: {
			const payload: { letters: string, maxTime: number | null } = action.payload;
			state = newState(state);
			state.round++;
			if (payload.maxTime) state.maxTime = payload.maxTime;
			state.timeLeft = state.maxTime;
			state.letters = payload.letters.toUpperCase();
			break;
		}

		case TICK: {
			const payload: number | undefined = action.payload;
			state = newState(state);
			if (payload) state.timeLeft = Math.max(0, state.maxTime - payload);
			else state.timeLeft = Math.max(0, state.timeLeft - 1);
			break;
		}

		case SYNC: {
			const payload: { global: GlobalState } = action.payload;
			state = Object.assign({}, state, payload.global);
			break;
		}

		case COUNTDOWN: {
			const payload: number | undefined = action.payload;
			state = newState(state);
			if (payload) state.countdown = payload;
			else state.countdown--;

			if (state.countdown < 0) state.countdown = 0;
			break;
		}

		case FOUND_WORD: {
			const payload: { word: string, id: ID, next: ID } = action.payload;
			state = newState(state);
			state.holdingBomb = payload.next;
			break;
		}

		case GAME_OVER: {
			const payload: { winners: string[] } = action.payload;
			state = newState(state);
			state.winner = payload.winners[0];
			break;
		}

		case SET_ROOM_ID: {
			const payload: string = action.payload;
			state = newState(state);
			state.roomID = payload;
			break;
		}
	}

	return state;
}
