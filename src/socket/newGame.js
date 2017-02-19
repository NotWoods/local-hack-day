import { createStore, combineReducers } from 'redux';
import { playerEntered, countdown } from '../messages.js';
import { gameStarted } from '../selectors.js';
import startGame from './startGame.js';
import endGame from './endGame.js';

export const games = new Map(); // Map<id, redux.Store>

/**
 * @param {socket.Namespace} nsp
 */
function newStore(nsp) {
	const store = createStore(combineReducers({ global, spectator }));
	store.emit = (action) => {
		store.dispatch(action);
		nsp.emit(action.type, action.payload);
	};

	return store;
}

/**
 * Games are represented as seperate namespaces rather than socket rooms
 *
 * @param {socket.Server} io
 * @param {string} path to use for the namespace.
 * @returns {socket.Namespace} namespace representing this game
 */
export function newGame(io, path) {
	if (games.has(path)) return games.get(path);

	const nsp = io.of(path);
	const store = newStore(nsp);
	games.set(path, store);

	let ready = false;
	function tryToStart() {
		if (ready) return;
		ready = true;

		return startGame(store.emit, store.getState)
			.then(endGame())
			.then(() => games.delete(path));
	}

	nsp.on('connection', (socket) => {
		// TODO: get name of player / wheter or not they are a spectator
		store.emit(playerEntered(socket));
		tryToStart();
		handleClientEvents(socket, store);
	});

	return store;
}
