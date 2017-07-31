import { parsed } from 'document-promises';
import { Store, Unsubscribe } from 'redux';
import initializeEventListeners from './game-listeners';
import autoRender from './game-render';
import { ClientState } from '../reducers/';

/**
 * Creates an interface between the UI, redux store, and socket.
 * A socket is used to handle submitting a word, and can be omitted for
 * debugging.
 * @param {redux.Store} store
 * @param {SocketIOClient.Socket} [io]
 * @returns {Promise<redux.Unsubscribe>}
 */
export default async function createUIListeners(
	store: Store<ClientState>,
	io?: SocketIOClient.Socket,
): Promise<Unsubscribe> {
	await parsed;

	const removeEventListeners = initializeEventListeners(store, io);
	const stopAutoRendering = autoRender(store);

	return function removeUIListeners() {
		removeEventListeners();
		stopAutoRendering();
	}
}
