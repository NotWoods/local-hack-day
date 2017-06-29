import { Store, Unsubscribe } from 'redux';
import { createSelector } from 'reselect';
import { State } from '../reducers/';
import { getElements, observeStore, allPossibleCases, UIMap } from '../utils';
import { isMyTurn, percentTimeLeft } from '../selectors';

const UI: UIMap = {
	fuse: null,
	wordInput: null,
	letterSet: null,
	subtitle: null,
	formFields: null,
};

const FUSE_LENGTH = 415;

const status = createSelector(
	(state: State) => state.global.countdown,
	isMyTurn,
	(countdown, myTurn) => {
		if (countdown > 0) {
			const unit = countdown === 1 ? 'second' : 'seconds';
			return `The game will begin in ${countdown} ${unit}`;
		} else if (myTurn) {
			return `It's your turn!`;
		} else {
			return `Waiting to receive the bomb...`;
		}
	}
)

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
	const formFields = <HTMLElement> UI.formFields;

	const statusUpdater = observeStore(store, status, text =>
		subtitle.textContent = text
	);

	const watchMyTurn = observeStore(store, isMyTurn, (myTurn) => {
		if (myTurn) {
			formFields.setAttribute('disabled', 'true');
		} else {
			formFields.removeAttribute('disabled');
			wordInput.value = '';
		}
	});

	const fuseUpdater = observeStore(store, percentTimeLeft, percent =>
		fuse.style.strokeDashoffset = String((percent * FUSE_LENGTH) + 3)
	);

	const lettersUpdater = observeStore(store, s => s.global.letters, (letters) => {
		letterSet.textContent = letters;
		wordInput.pattern = `.*(?:${allPossibleCases(letters).join('|')}).*`;
	});


	return function removeObservers() {
		statusUpdater();
		watchMyTurn();
		fuseUpdater();
		lettersUpdater();
	}
}
