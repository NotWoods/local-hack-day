import { parsed } from 'document-promises';
import { isMyTurn } from '../state/selectors.js';

const ID = 'subtitle';
let node;
parsed.then(() => { node = document.getElementById(ID); });

const READY = 'Your word must contain the letters:';
const WAIT = 'Waiting to receive the bomb...'

let lastCheck;
export function onUpdate(state) {
	const myTurn = isMyTurn(state);
	if (lastCheck === myTurn) return;

	node.textContent = myTurn ? READY : WAIT;
	lastCheck = myTurn;
}
