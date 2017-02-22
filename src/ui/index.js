import { parsed } from 'document-promises';
import initializeBombEvents from './bombEvents.js';
import createSubmitText from './submitText.js';
import createViewUpdater from './viewUpdater.js';

/**
 * @param {Socket.Client} socket
 * @param {redux.Store} store
 * @returns {Promise<Function>}
 */
export default function createUIListeners(socket, store) {
	return parsed.then(() => {
		const removeBombEventListeners = initializeBombEvents(store);
		const submitText = createSubmitText(socket, store);
		const removeObservers = createViewUpdater(store);

		return function removeUIListeners() {
			removeBombEventListeners();
			submitText.removeListeners();
			removeObservers();
		}
	})
}
