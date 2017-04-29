import { PLAYER_ENTERED, PLAYER_LEFT, BLEW_UP, NEW_ROUND, FOUND_WORD } from '../messages.js';

interface PlayerSubState {
	id: ID,
	name: string,
	score: number,
}
interface RoundSubState {
	letters: string,
	wordsUsed: Map<string, ID>
}

type ID = string;
export interface SpectatorState {
	players: PlayerSubState[],
	pastRounds: RoundSubState[]
}

const defaultState = Object.freeze({
	players: [], // players in the game
	pastRounds: [], // data from  previous rounds in the game
});

function newState(oldState: SpectatorState): SpectatorState {
	return Object.assign({}, oldState);
}
function newPlayer(id, name = ''): PlayerSubState {
	return {
		id, // player unique ID
		name, // name of the player if entered by user
		score: 0, // current score for the player
	};
}
function newRound(letters: string): RoundSubState {
	return {
		letters,
		wordsUsed: new Map(), // Map<word, player>
	};
}

/**
 * A reducer that tracks state used by the server and spectators. One array
 * holds objects describing the players. The order of the array determines the
 * order the bomb gets passed around. The other array holds data on every round
 * in this game, for spectators to see and for scores to be calculated from.
 */
export default function spectator(_state: SpectatorState = defaultState, { type, payload }) {
	let state = _state;
	switch (type) {
		case PLAYER_ENTERED:
			state = newState(state);
			state.players = [
				...state.players,
				newPlayer(payload.id, payload.name),
			];
			break;

		case PLAYER_LEFT: {
			state = newState(state);
			const index = state.players.findIndex(player => player.id === payload);
			state.players.slice().splice(index, 1);
			break;
		}

		case BLEW_UP: {
			state = newState(state);
			const index = state.players.findIndex(player => player.id === payload);

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
