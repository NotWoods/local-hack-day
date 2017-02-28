import { getElements, observeStore } from '../utils.js';
import { validWord, isMyTurn } from '../selectors.js';
import { PASS_BOMB } from '../messages.js';

const UI = { form: null, wordInput: null, bomb: null };

/**
 * Creates a function to submit test inside the input to the server, and attaches
 * it to form onsubmit.
 * Document must be parsed.
 * @param {Socket.Client} socket
 * @param {redux.Store} store
 * @returns {Function} submitText function. Has removeListeners property to clear
 * form listener.
 */
export default function createSubmitText({ dispatch, getState }) {
	getElements(UI);

	/**
	 * Submits whatever value is currently inside the wordInput box to the server
	 * @param {FormEvent} e
	 */
	function submitText(e) {
		e.preventDefault();

		const word = UI.wordInput.value;
		const valid = isMyTurn(getState()) && validWord(getState(), word);

		if (!valid) UI.bomb.style.animationame = 'shake';
		UI.bomb.style.animationPlayState = 'running';

		if (valid) {
			dispatch(PASS_BOMB, word, (err) => {
				if (err) UI.bomb.style.animationame = 'shake';
			});
		}
	}

	UI.form.addEventListener('submit', submitText);
	submitText.removeListeners = function() {
		UI.form.removeEventListener('submit', this);
	}

	return submitText;
}
