import { NEW_ROUND, SYNC, GAME_OVER, BLEW_UP, FOUND_WORD } from '../messages';

const defaultState = Object.freeze({
	me: '', // Stores player ID
	score: 0, // Tracks player score
	wordsUsed: new Set(), // Tracks words used this round
});

function newState(oldState) {
	const newS = Object.assign({}, oldState);
	newS.wordsUsed = new Set(oldState.wordsUsed);
	return newS;
}

/**
 * Reducer that tracks client-specific data. This data will mostly be different
 * for each player, and isn't used by spectators. The state stores the player's
 * ID and score, and also tracks words used.
 */
export default function player(_state = defaultState, { type, payload }) {
	let state = _state;
	switch (type) {
		case NEW_ROUND:
			state = newState(state);
			state.wordsUsed = new Set();
			break;

		case SYNC:
			state = newState(state);
			state.wordsUsed = new Set(payload.player.wordsUsed);
			break;

		case BLEW_UP:
			if (payload === state.me) {
				state = newState(state);
				state.score++;
			}
			break;

		case FOUND_WORD:
			state = newState(state);
			state.wordsUsed = new Set(state.wordsUsed);
			state.wordsUsed.add(payload.word);
			break;
	}

	return state;
}
