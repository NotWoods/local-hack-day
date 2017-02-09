import { getElements, observeStore, allPossibleCases } from '../utils.js';
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

export default function viewUpdater(store) {
	getElements(UI);

	const o1 = observeStore(store, isMyTurn, (myTurn) => {
		if (myTurn) {
			UI.subtitle.textContent = READY_TEXT;
		} else {
			UI.subtitle.textContent = WAIT_TEXT;
			UI.wordInput.value = '';
		}
	});

	const o2 = observeStore(store, percentTimeLeft, (percent) => {
		UI.fuse.style.strokeDashoffset = (percent * FUSE_LENGTH) + 3;
	});

	const o3 = observeStore(store, s => s.global.letters, (letters) => {
		UI.letterSet.textContent = letters;
		UI.wordInput.pattern = `.*(?:${allPossibleCases(letters).join('|')}).*`;
	});


	return function removeObservers() {
		o1();
		o2();
		o3();
	}
}
