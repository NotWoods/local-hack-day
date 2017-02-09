import { getElements, observeStore } from '../utils.js';
import { validWord, isMyTurn } from '../selectors.js';
import { PASS_BOMB } from '../messages.js';

const UI = { form: null, wordInput: null, bomb: null };

let getState;
let emit;

export function initialize(socket, store) {
	getElements(UI);
	getState = store.getState;
	emit = socket.emit;
}

export default function submitText(e) {
	e.preventDefault();

	const word = UI.wordInput.value;
	const valid = isMyTurn(getState()) && validWord(getState(), word);

	if (!valid) UI.bomb.style.animationame = 'shake';
	UI.bomb.style.animationPlayState = 'running';

	if (valid) emit(PASS_BOMB, word);
}
