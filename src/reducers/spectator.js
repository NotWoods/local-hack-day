import { PLAYER_ENTERED, BLEW_UP, NEW_ROUND, FOUND_WORD } from '../messages.js';

const defaultState = Object.freeze({
	players: [], // players in the game
	pastRounds: [], // data from  previous rounds in the game
});

function newState(oldState) {
	return Object.assign({}, oldState);
}
function newPlayer(id, name = '') {
	return {
		id, // player unique ID
		name, // name of the player if entered by user
		score: 0, // current score for the player
	};
}
function newRound(letters) {
	return {
		letters,
		wordsUsed: new Map(), // Map<word, player>
	};
}


export default function spectator(_state = defaultState, { type, payload }, global) {
	let state = _state;
	switch (type) {
		case PLAYER_ENTERED:
			state = newState(state);
			state.players = [
				...state.players,
				newPlayer(payload.id, payload.name),
			];
			break;

		case BLEW_UP: {
			state = newState(state);
			const index = state.players.find(player => player.id === payload);

			const oldPlayer = state.players[index];
			const player = newPlayer(oldPlayer.id, oldPlayer.name);
			player.score = oldPlayer.score + 1;

			state.players = state.players.slice();
			state.players[index] = player;
			break;
		}

		case NEW_ROUND:
			state = newState(state);
			state.pastRounds = [
				...state.pastRounds,
				newRound(payload.letters),
			];
			break;

		case FOUND_WORD: {
			state = newState(state);
			const last = state.pastRounds.length - 1;

			const oldRound = state.pastRounds[last];
			const round = newRound(oldRound.letters);
			round.wordsUsed = new Map(oldRound.wordsUsed);
			round.wordsUsed.set(payload.word, payload.id);

			state.pastRounds = state.pastRounds.slice();
			state.pastRounds[last] = round;
			break;
		}

	}

	return state;
}
