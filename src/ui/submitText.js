import { getElements, observeStore } from '../utils.js';
import { validWord, isMyTurn } from '../selectors.js';
import { PASS_BOMB } from '../messages.js';

const UI = { form: null, wordInput: null, bomb: null };

/**
 * Document must be parsed.
 * @param {socket.Client} socket
 * @param {redux.Store} store
 * @returns {Function} submitText function
 */
export default function createSubmitText(socket, store) {
	getElements(UI);
	const getState = store.getState.bind(store);
	const emit = socket.emit.bind(socket);

	/**
	 * Submits whatever value is currently inside the wordInput box to the server
	 * @param {FormEvent} e
	 */
	return function submitText(e) {
		e.preventDefault();

		const word = UI.wordInput.value;
		const valid = isMyTurn(getState()) && validWord(getState(), word);

		if (!valid) UI.bomb.style.animationame = 'shake';
		UI.bomb.style.animationPlayState = 'running';

		if (valid) {
			emit(PASS_BOMB, word, (err) => {
				if (err) UI.bomb.style.animationame = 'shake';
			});
		}
	}
}
