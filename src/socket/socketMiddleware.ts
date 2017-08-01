import {
	Action, Middleware, Dispatch, MiddlewareAPI
} from 'redux';
import { State } from '../reducers/';
import { getRoomID } from '../selectors';

const specialTypes = new Set([
	'connection', 'connect',
	'disconnect',
	'reconnect', 'reconnect_attempt', 'reconnecting',
	'error', 'reconnect_error', 'reconnect_failed',
]);

export interface StandardAction extends Action {
	type: string,
	payload?: any,
	error?: true | null,
	meta?: any,
}

interface SocketMiddleware extends Middleware {
	(api: MiddlewareAPI<State>): (next: Dispatch<State>) => Dispatch<State>
}

/**
 * Creates a redux middleware function that connected the given socket
 * to the store.
 * @param {socket.Socket} io
 * @param {...string[]} [messageTypes] - list of actions to listen to
 */
export default function newSocketMiddleware(
	io: SocketIO.Server,
	...messageTypes: string[],
): SocketMiddleware {
	return function socketMiddleware(api: MiddlewareAPI<State>) {
		// When one of the listed message types are received, dispatch it as a
		// action for the store to process.
		for (const type of messageTypes) {
			io.on(type, (payload: string) => api.dispatch({
				type,
				payload: JSON.parse(payload),
				meta: { noemit: true },
			}));

			io.on(type, () => {});
		}

		// When this store dispatches something, also emit it using the store.
		return (next: Dispatch<State>) => <A extends StandardAction>(action: A) => {
			next(action);
			const { type, meta } = action;

			const doNotEmit = meta && meta.noemit;
			if (!doNotEmit && !specialTypes.has(type)) {
				const payload = JSON.stringify(action.payload);
				io.to(getRoomID(api.getState() as any)).emit(type, payload);
			}
			return action;
		};
	}
}
