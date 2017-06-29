import { Store, Unsubscribe } from 'redux';
import { getElements, UIMap } from '../utils';
import { validWord, isMyTurn } from '../selectors';
import { PASS_BOMB } from '../messages';
import { ClientState } from '../reducers/';

const UI: UIMap = {
	form: null,
	wordInput: null,
};

/**
 * Creates a function to submit test inside the input to the server, and attaches
 * it to form onsubmit. When the form is submitted, an event will be emitted to
 * the server.
 * Document must be parsed.
 * @returns {Function} submitText function. Has removeListeners property to clear
 * form listener.
 */
export default function createSubmitHandler(
	{ getState }: Store<ClientState>,
	io: SocketIOClient.Socket,
): Unsubscribe {
	getElements(UI);
	const form = <HTMLFormElement> UI.form;
	const wordInput = <HTMLInputElement> UI.wordInput;

	/**
	 * Submits whatever value is currently inside the wordInput box to the server
	 * @param {FormEvent} e
	 */
	function submitText(e: Event) {
		e.preventDefault();
		const word = wordInput.value;
		const state = getState();

		if (isMyTurn(state) && validWord(state, word)) {
			io.emit(PASS_BOMB, word);
		}
	}

	form.addEventListener('submit', submitText);
	return () => form.removeEventListener('submit', submitText);
}
