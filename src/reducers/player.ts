import {
	NEW_ROUND, SYNC, BLEW_UP, FOUND_WORD
} from '../messages';
import { StandardAction } from '../socket/'

type ID = string;
export interface PlayerState {
	me: ID,
	score: number,
	wordsUsed: Set<string>,
}

const defaultState = Object.freeze({
	me: '', // Stores player ID
	score: 0, // Tracks player score
	wordsUsed: new Set(), // Tracks words used this round
});

function newState(oldState: PlayerState): PlayerState {
	const newS = Object.assign({}, oldState);
	newS.wordsUsed = new Set(oldState.wordsUsed);
	return newS;
}

/**
 * Reducer that tracks client-specific data. This data will mostly be different
 * for each player, and isn't used by spectators. The state stores the player's
 * ID and score, and also tracks words used.
 */
export default function player(_state: PlayerState = defaultState, action: StandardAction) {
	let state = _state;
	switch (action.type) {
		case NEW_ROUND:
			state = newState(state);
			state.wordsUsed = new Set();
			break;

		case SYNC: {
			const payload: { player: PlayerState } = action.payload;
			state = newState(state);
			state.wordsUsed = new Set(payload.player.wordsUsed);
			break;
		}

		case BLEW_UP: {
			const payload: ID = action.payload;
			if (payload === state.me) {
				state = newState(state);
				state.score++;
			}
			break;
		}

		case FOUND_WORD: {
			const payload: { word: string, id: ID, next: ID } = action.payload;
			state = newState(state);
			state.wordsUsed = new Set(state.wordsUsed);
			state.wordsUsed.add(payload.word);
			break;
		}
	}

	return state;
}