import { parsed } from 'document-promises';
import initializeBombEvents from './bombEvents';
import createSubmitHandler from './submitText';
import createViewUpdater from './viewUpdater';

import { Store, Unsubscribe } from 'redux';
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

	const removeBombEventListeners = initializeBombEvents(store, io);
	const removeObservers = createViewUpdater(store);
	let removeSubmitListeners = Function();
	if (io) removeSubmitListeners = createSubmitHandler(store, io);

	return function removeUIListeners() {
		removeBombEventListeners();
		removeObservers();
		removeSubmitListeners();
	}
}
