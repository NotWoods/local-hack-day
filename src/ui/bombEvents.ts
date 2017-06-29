import { Store, Unsubscribe } from 'redux';
import {
	Manager, Swipe, Tap,
	DIRECTION_ALL, DIRECTION_NONE,
	DIRECTION_UP, DIRECTION_DOWN, DIRECTION_RIGHT, DIRECTION_LEFT,
} from 'hammerjs';
import { validWord, isMyTurn } from '../selectors';
import { getElements, UIMap } from '../utils';
import { ClientState } from '../reducers/';

const UI: UIMap = {
	bomb: null,
	form: null,
	wordInput: null,
};

/**
 * @param {Hammer.Direction} [direction]
 * @returns {string} the class name to represent the swipe direction provided.
 */
function getAnimation(direction?: number) {
	switch (direction) {
		case DIRECTION_LEFT: return 'slideLeft';
		case DIRECTION_RIGHT: return 'slideRight';
		case DIRECTION_UP: return 'slideUp';

		case DIRECTION_DOWN:
		case DIRECTION_NONE:
		default:
			return 'slideDown';
	}
}

/**
 * Handles touch events for the bomb icon
 */
function handleTouch(e: HammerInput) {
	const bomb = <HTMLElement> UI.bomb;
	const form = <HTMLFormElement> UI.form;

	bomb.style.animationName = getAnimation(e.direction);
	form.submit();
}

/**
 * Shakes the bomb on the screen, good for
 * animating an error
 */
function shakeBomb() {
	const bomb = <HTMLElement> UI.bomb;

	bomb.style.animationName = 'shake';
	bomb.style.animationPlayState = 'running';
}

/**
 * Resets animations when they complete
 */
function clearAnimationState() {
	const bomb = <HTMLElement> UI.bomb;

	bomb.style.animationName = '';
	bomb.style.animationPlayState = 'paused';
}

/**
 * Sets up bomb event listeners for touch and animation end.
 * Document must be parsed.
 */
export default function initializeBombEvents(
	{ getState }: Store<ClientState>,
	io?: SocketIOClient.Socket,
): Unsubscribe {
	getElements(UI);
	const bomb = <HTMLElement> UI.bomb;
	const form = <HTMLElement> UI.form;

	/**
	 * Displays animations when the submit event
	 * fires
	 */
	function handleSubmit() {
		const wordInput = <HTMLInputElement> UI.wordInput;
		const bomb = <HTMLElement> UI.bomb;

		const state = getState();
		const validInput = isMyTurn(state) && validWord(state, wordInput.value);
		if (validInput)
			bomb.style.animationName = getAnimation();
		else
			shakeBomb();
	}

	const mc = new Manager(bomb);
	mc.add(new Swipe({ direction: DIRECTION_ALL }));
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
