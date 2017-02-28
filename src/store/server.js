import { createStore, combineReducers, applyMiddleware } from 'redux';
import { global, spectator } from '../reducers/index.js';
import newSocketMiddleware from '../socket/socketMiddleware.js';
import {} from '../messages.js';

const serverReducer = combineReducers({ global, spectator });

/**
 * @param {SocketIO.Namespace} io
 * @returns {redux.Store}
 */
export default function createServerStore(io) {
	return createStore(
		serverReducer,
		applyMiddleware(
			newSocketMiddleware(io, [
				/* TODO */
			]),
		),
	);
}
