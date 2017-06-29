import * as redux from 'redux';
import { State } from '../reducers/';
import { StandardAction } from './socketMiddleware';

function toAction(type: string, payload?: string): StandardAction {
	if (!payload) return { type };
	return {
		type,
		payload: JSON.parse(payload),
	};
}

/**
 * Connects the given socket to the store. Used on the client side.
 * When an event is received in the socket, it is dispatched as an event
 * @param io
 * @param types - list of actions to listen to
 */
export default function connectSocketToStore(
	io: SocketIOClient.Socket,
	{ dispatch }: redux.Store<State>,
	...types: string[],
): void {
	// When one of the listed message types are received, dispatch it as a
	// action for the store to process.
	for (const type of types) {
		io.on(type, (payload?: string) => dispatch(toAction(type, payload)));
	}
}
