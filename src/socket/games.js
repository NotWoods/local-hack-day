import { createStore, combineReducers } from 'redux';
import { playerEntered, countdown } from '../messages.js';
import { gameStarted } from '../selectors.js';

export const games = new Map(); // Map<id, Redux.Store>
function newStore(nsp) {
	const store = createStore(combineReducers({ global, spectator }));

	store.emit = (action) => {
		store.dispatch(action);
		nsp.emit(action.type, action.payload);
	};
	nsp.store = store;
	return store;
}

/**
 * Counts down and resolves when the timer reaches 0
 */
function runCountdown({ emit, getState }) {
	return new Promise((resolve) => {
		const timer = setInterval(() => {
			emit(countdown());
			if (gameStarted(getState())) resolve(timer);
		}, 1000);
	}).then(clearInterval);
}

function startGame(gameState) {
	return runCountdown(gameState).then(() => {

	});
}

/**
 * Games are represented as seperate namespaces rather than socket rooms
 * @param {string} path to use for the namespace.
 * @returns {socket.Namespace} namespace representing this game
 */
export function newGame(path) {
	if (games.has(path)) return games.get(path);

	const nsp = io.of(path);
	games.set(path, nsp);
	const store = newStore(nsp);

	let ready = false;
	nsp.on('connection', (socket) => {
		store.emit(playerEntered(socket));
		if (!ready) {
			ready = true;
			startGame(store);
		}
	});

	return nsp;
}
