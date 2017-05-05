import { parsed } from 'document-promises';
import initializeBombEvents from './bombEvents';
import createSubmitText from './submitText';
import createViewUpdater from './viewUpdater';

import { Store } from 'redux';
import { ClientState } from '../reducers/';

/**
 * @param {redux.Store} store
 * @returns {Promise<Function>}
 */
export default function createUIListeners(
	io: SocketIOClient.Socket,
	store: Store<ClientState>
) {
	return parsed.then(() => {
		const removeBombEventListeners = initializeBombEvents();
		const submitText = createSubmitText(io, store);
		const removeObservers = createViewUpdater(store);

		return function removeUIListeners() {
			removeBombEventListeners();
			submitText.removeListeners();
			removeObservers();
		}
	})
}
