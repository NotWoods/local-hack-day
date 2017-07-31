import { Store, Unsubscribe } from 'redux';
import { Manager, Swipe, Tap, DIRECTION_RIGHT } from 'hammerjs';
import { validWord, isMyTurn } from '../selectors';
import { getElement } from '../utils';
import { PASS_BOMB } from '../messages';
import { ClientState } from '../reducers/';

/** Handles touch events for the bomb icon */
function handleTouch() {
	const bomb = getElement('bomb');
	const form = getElement('game-form') as HTMLFormElement;

	bomb.style.animationName = 'bounceOutRight';
	form.submit();
}

/** Shakes the bomb on the screen, good for animating an error */
function shakeBomb() {
	const bomb = getElement('bomb');
	bomb.style.animationName = 'shake';
	bomb.style.animationPlayState = 'running';
}

/** Resets animations when they complete */
function clearAnimationState() {
	const bomb = getElement('bomb');
	bomb.style.animationName = '';
	bomb.style.animationPlayState = 'paused';
}

/**
 * Sets up bomb event listeners for touch and animation end.
 *
 * Creates a function to submit test inside the input to the server, and attaches
 * it to form onsubmit. When the form is submitted, an event will be emitted to
 * the server.
 *
 * Document must be parsed.
 */
export default function initializeEventListeners(
	{ getState }: Store<ClientState>,
	io?: SocketIOClient.Socket,
): Unsubscribe {
	const bomb = getElement('bomb');
	const form = getElement('game-form') as HTMLFormElement;
	const wordInput = getElement('wordInput') as HTMLInputElement;

	/**
	 * Submits whatever value is currently inside the wordInput box to the server
	 * Displays animations when the submit event fires
	 */
	function handleSubmit(e: Event) {
		e.preventDefault();
		const word = wordInput.value;
		const state = getState();

		const validInput = isMyTurn(state) && validWord(state, wordInput.value);

		if (validInput) {
			bomb.style.animationName = 'bounceOutRight';
			if (io) io.emit(PASS_BOMB, word);
		} else {
			shakeBomb();
		}
	}

	const mc = new Manager(bomb);
	mc.add(new Swipe({ direction: DIRECTION_RIGHT }));
	mc.add(new Tap());

	mc.on('swipe', handleTouch);
	mc.on('tap', handleTouch);
	bomb.addEventListener('animationend', clearAnimationState);
	form.addEventListener('submit', handleSubmit);
	if (io) io.on('error', shakeBomb);

	return function removeBombEventListeners() {
		mc.destroy();
		bomb.removeEventListener('animationend', clearAnimationState);
		form.removeEventListener('submit', handleSubmit);
		if (io) io.off('error', shakeBomb);
	}
}
