import { NEW_ROUND, SYNC, COUNTDOWN, PASS_BOMB, GAME_OVER } from '../messages';

const maxTime = parseInt(process.env.MAX_TIME, 10) || 60;
const countdown = parseInt(process.env.COUNTDOWN_START, 10) || 60;

const defaultState = Object.freeze({
	round: 0, // Current round number
	maxTime, // Maximum time in a round
	timeLeft: maxTime, // Time remaining in a round
	holdingBomb: '', // Player that is holding the bomb
	letters: '', // Current letters needed in a word
	winner: '', // Name of the winner at the end of the game
	countdown, // Current countdown number
});

function newState(oldState) {
	return Object.assign({}, oldState);
}

export default function global(_state = defaultState, { type, payload }) {
	let state = _state;
	switch (type) {
		case NEW_ROUND:
			state = newState(state);
			state.round++;
			if (payload.maxTime) state.maxTime = payload.maxTime;
			state.timeLeft = state.maxTime;
			state.letters = payload.letters;
			break;

		case SYNC:
			state = Object.assign({}, state, payload.global);
			break;

		case COUNTDOWN:
			state = newState(state);
			if (payload) state.countdown = payload;
			else state.countdown--;
			break;

		case PASS_BOMB:
			state = newState(state);
			state.holdingBomb = payload;
			break;

		case GAME_OVER:
			state = newState(state);
			state.winner = payload.winner;
			break;
	}

	return state;
}
