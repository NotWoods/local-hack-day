import { NEW_ROUND, SYNC, COUNTDOWN, PASS_BOMB, GAME_OVER } from './messages';

let maxTime = parseInt(process.env.MAX_TIME, 10) || 60;
let countdown = parseInt(process.env.COUNTDOWN_START, 10) || 60;

const defaultState = Object.freeze({
	global: {
		round: 0,
		maxTime: maxTime,
		timeLeft: maxTime,
		holdingBomb: '',
		letters: '',
		winner: '',
		countdown: countdown,
	},
	/*spectator: {
		players: [
			{
				id: '',
				name: '',
				score: 0,
			},
		],
		pastRounds: [
			{
				letters: '',
				wordsUsed: new Map(), // Map<word, player>
			},
		],
	},*/
	player: {
		me: '',
		score: 0,
		wordsUsed: new Set(),
	},
});


export default function reducer(state = Object.assign({}, defaultState), event, msg) {
	switch (event) {
		case NEW_ROUND:
			state.global.round++;
			state.global.timeLeft = state.global.maxTime;
			state.global.letters = msg;
			state.player.wordsUsed.clear();
			return state;
		case SYNC:
			Object.assign(state.global, msg.global);
			state.player.wordsUsed = new Set(msg.player.wordsUsed);
			return state;
		case COUNTDOWN:
			state.global.countdown = msg;
			return state;
		case PASS_BOMB:
			state.global.holdingBomb = msg;
			return state;
		case GAME_OVER:
			state.global.winner = msg.winner;
			state.player.score = msg.score;
			return state;
	}
}
