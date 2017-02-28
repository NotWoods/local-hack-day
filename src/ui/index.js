import { parsed } from 'document-promises';
import initializeBombEvents from './bombEvents.js';
import createSubmitText from './submitText.js';
import createViewUpdater from './viewUpdater.js';

/**
 * @param {redux.Store} store
 * @returns {Promise<Function>}
 */
export default function createUIListeners(store) {
	return parsed.then(() => {
		const removeBombEventListeners = initializeBombEvents();
		const submitText = createSubmitText(store);
		const removeObservers = createViewUpdater(store);

		return function removeUIListeners() {
			removeBombEventListeners();
			submitText.removeListeners();
			removeObservers();
		}
	})
}
