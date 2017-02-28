import { createStore, combineReducers, applyMiddleware } from 'redux';
import { global, player } from '../reducers/index.js';
import { newSocketMiddleware } from '../socket/index.js';
import {
	NEW_ROUND, TICK, SYNC, COUNTDOWN,
	GAME_OVER, FOUND_WORD, BLEW_UP,
} from '../messages.js';

const clientReducer = combineReducers({ global, player });

/**
 * @param {SocketIOClient.Socket} io
 * @returns {Store}
 */
export default function createClientStore(io) {
	return createStore(
		clientReducer,
		applyMiddleware(
			newSocketMiddleware(io, [
				NEW_ROUND, TICK, SYNC, COUNTDOWN,
				GAME_OVER, FOUND_WORD, BLEW_UP,
			]),
		),
	);
}
