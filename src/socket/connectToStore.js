/**
 * Connects socket to store, so that incoming messages are dispatched
 * if they are listed in the types
 * @param {Socket.Client} socket
 * @param {redux.Store} store
 * @param {Iterable<string>} types
 */
export default function connectToStore(socket, store, types) {
	for (const type of types) {
		socket.on(type, payload =>
			store.dispatch({ type, payload: JSON.parse(payload) })
		);
	}
}
