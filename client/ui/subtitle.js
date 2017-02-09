import { isMyTurn } from '../state/selectors.js';
import observeState from '../state/observerState.js';

const READY = 'Your word must contain the letters:';
const WAIT = 'Waiting to receive the bomb...'
const ID = 'subtitle';
const node = document.getElementById(ID);

export const onUpdate = observeState(isMyTurn, (myTurn) => {
	node.textContent = myTurn ? READY : WAIT;
});
