import observeStore from '../observeStore.js';
import { isMyTurn, percentTimeLeft } from '../selectors.js';

const UI = {
	fuse: null,
	wordInput: null,
	letterSet: null,
	subtitle: null,
};

const READY_TEXT = 'Your word must contain the letters:';
const WAIT_TEXT = 'Waiting to receive the bomb...';
const FUSE_LENGTH = 415;

function getElements(obj) {
	Object.keys(obj).forEach((id) => {
		obj[id] = document.getElementById(id);
	});
}

export default function viewUpdater(store) {
	getElements(UI);

	const observer1 = observeStore(store, isMyTurn, (myTurn) => {
		if (myTurn) {
			UI.subtitle.textContent = READY_TEXT;
		} else {
			UI.subtitle.textContent = WAIT_TEXT;
			UI.wordInput.value = '';
		}
	});

	const observer2 = observeStore(store, percentTimeLeft, (percent) => {
		UI.fuse.style.strokeDashoffset = (percent * FUSE_LENGTH) + 3;
	});

	const observer3 = observeStore(store, s => s.global.letters, (letters) => {
		UI.letterSet.textContent = letters;
	});

	return function removeObservers() { observer1(); observer2(); observer3(); }
}
