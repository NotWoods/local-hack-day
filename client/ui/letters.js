import observeState from '../state/observerState.js';

const ID = 'letterSet';
const node = document.getElementById(ID);

export const onUpdate = observeState(state => state.global.letters, (letters) => {
	node.textContent = letters;
});
