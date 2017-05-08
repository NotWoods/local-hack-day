import { createStore, combineReducers, applyMiddleware, Store } from 'redux';
import { global, spectator, ServerState } from '../reducers/index.js';
import newSocketMiddleware from '../socket/socketMiddleware.js';
import {
	BLEW_UP, NEW_ROUND, FOUND_WORD,
	TICK, COUNTDOWN, GAME_OVER,
} from '../messages.js';

const serverReducer = combineReducers<ServerState>({ global, spectator });
export { serverReducer as reducer }

/**
 * @param {SocketIO.Namespace} io
 * @returns {Store}
 */
export default function createServerStore(io: SocketIO.Server): Store<ServerState> {
	return createStore(
		serverReducer,
		applyMiddleware(
			newSocketMiddleware(io, [
				BLEW_UP, NEW_ROUND, FOUND_WORD,
				TICK, COUNTDOWN, GAME_OVER,
			]),
		),
	);
}
