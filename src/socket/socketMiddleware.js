/**
 * Creates a redux middleware function that connected the given socket
 * to the store.
 * @param {socket.Socket} io
 * @param {string[]} [messageTypes] - list of actions to listen to
 */
export default function newSocketMiddleware(io, messageTypes = []) {
	return function socketMiddleware(store) {
		// When one of the listed message types are received, dispatch it as a
		// action for the store to process.
		for (const type of messageTypes) {
			io.on(type, payload => store.dispatch({
				type,
				payload: JSON.parse(payload),
				meta: { received: true },
			}));
		}

		// When this store dispatches something, also emit it using the store.
		return next => (action) => {
			next(action);
			if (!(action.meta && action.meta.received)) {
				io.emit(action.type, JSON.stringify(action.payload));
			}
		}
	}
}
