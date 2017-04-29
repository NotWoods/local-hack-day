import { Store, Unsubscribe } from 'redux';
import { State } from '../reducers/';
import { getElements, observeStore, allPossibleCases, UIMap } from '../utils';
import { isMyTurn, percentTimeLeft } from '../selectors';

const UI: UIMap = {
	fuse: null,
	wordInput: null,
	letterSet: null,
	subtitle: null,
};

const READY_TEXT = 'Your word must contain the letters:';
const WAIT_TEXT = 'Waiting to receive the bomb...';
const FUSE_LENGTH = 415;

/**
 * Observes redux store and updates the UI when needed
 * @param {redux.Store} store
 * @returns {Function} removeObservers function
 */
export default function createViewUpdater(store: Store<State>): Unsubscribe {
	getElements(UI);
	const fuse = <HTMLElement> UI.fuse;
	const wordInput = <HTMLInputElement> UI.wordInput;
	const letterSet = <HTMLElement> UI.letterSet;
	const subtitle = <HTMLElement> UI.subtitle;

	const o1 = observeStore(store, isMyTurn, (myTurn) => {
		if (myTurn) {
			subtitle.textContent = READY_TEXT;
		} else {
			subtitle.textContent = WAIT_TEXT;
			wordInput.value = '';
		}
	});

	const o2 = observeStore(store, percentTimeLeft, (percent) => {
		fuse.style.strokeDashoffset = String((percent * FUSE_LENGTH) + 3);
	});

	const o3 = observeStore(store, s => s.global.letters, (letters) => {
		letterSet.textContent = letters;
		wordInput.pattern = `.*(?:${allPossibleCases(letters).join('|')}).*`;
	});


	return function removeObservers() {
		o1();
		o2();
		o3();
	}
}
