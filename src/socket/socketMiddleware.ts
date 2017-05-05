import * as redux from 'redux';

const specialTypes = new Set([
	'connection', 'connect',
	'disconnect',
	'reconnect', 'reconnect_attempt', 'reconnecting',
	'error', 'reconnect_error', 'reconnect_failed',
]);

export interface StandardAction extends redux.Action {
	type: string,
	payload?: any,
	error?: true | null,
	meta?: any,
}

/**
 * Creates a redux middleware function that connected the given socket
 * to the store.
 * @param {socket.Socket} io
 * @param {string[]} [messageTypes] - list of actions to listen to
 */
export default function newSocketMiddleware(
	io: SocketIOClient.Socket,
	messageTypes: string[] = [],
): redux.Middleware {
	return function socketMiddleware(store: redux.Store<any>) {
		// When one of the listed message types are received, dispatch it as a
		// action for the store to process.
		for (const type of messageTypes) {
			io.on(type, (payload: string) => store.dispatch({
				type,
				payload: JSON.parse(payload),
				meta: { noemit: true },
			}));
		}

		// When this store dispatches something, also emit it using the store.
		return (next: redux.Dispatch<any>) => (action: StandardAction) => {
			next(action);
			if (!specialTypes.has(action.type)
			&& !(action.meta && action.meta.noemit)) {
				io.emit(action.type, JSON.stringify(action.payload));
			}
		}
	}
}
