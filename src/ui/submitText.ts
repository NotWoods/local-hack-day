import { Store } from 'redux';
import { getElements, UIMap } from '../utils';
import { validWord, isMyTurn } from '../selectors';
import { PASS_BOMB } from '../messages';
import { ClientState } from '../reducers/';

const UI: UIMap = { form: null, wordInput: null, bomb: null };

/**
 * Creates a function to submit test inside the input to the server, and attaches
 * it to form onsubmit.
 * Document must be parsed.
 * @returns {Function} submitText function. Has removeListeners property to clear
 * form listener.
 */
export default function createSubmitText(
	io: SocketIOClient.Socket,
	{ getState }: Store<ClientState>,
) {
	getElements(UI);
	const form = <HTMLFormElement> UI.form;
	const wordInput = <HTMLInputElement> UI.wordInput;
	const bomb = <HTMLElement> UI.bomb;

	/**
	 * Submits whatever value is currently inside the wordInput box to the server
	 * @param {FormEvent} e
	 */
	function submitText(e) {
		e.preventDefault();

		const word = wordInput.value;
		const valid = isMyTurn(getState()) && validWord(getState(), word);

		if (!valid) bomb.style.animationName = 'shake';
		bomb.style.animationPlayState = 'running';

		if (valid) {
			io.emit(PASS_BOMB, word, (err) => {
				if (err) bomb.style.animationName = 'shake';
			});
		}
	}

	form.addEventListener('submit', submitText);
	/*submitText.removeListeners = function() {
		form.removeEventListener('submit', this);
	}*/

	return submitText;
}
