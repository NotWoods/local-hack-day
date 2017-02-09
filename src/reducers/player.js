import { NEW_ROUND, SYNC, GAME_OVER } from '../messages';

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

export default function player(_state = defaultState, { type, payload }) {
	let state = _state;
	switch (type) {
		case NEW_ROUND:
			state = newState(state);
			state.wordsUsed.clear();
			break;

		case SYNC:
			state = newState(state);
			state.wordsUsed = new Set(payload.player.wordsUsed);
			break;

		case GAME_OVER:
			state = newState(state);
			state.score = payload.score;
			break;
	}

	return state;
}
