import {
	Manager, Swipe, Tap,
	DIRECTION_ALL, DIRECTION_NONE,
	DIRECTION_UP, DIRECTION_DOWN, DIRECTION_RIGHT, DIRECTION_LEFT,
} from 'hammer';
import { getElements, UIMap } from '../utils.js';

const UI: UIMap = { bomb: null, form: null };

/**
 * @param {Hammer.Direction} [direction]
 * @returns {string} the class name to represent the swipe direction provided.
 */
function getAnimation(direction) {
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
function handleTouch(e) {
	const bomb = <HTMLElement> UI.bomb;
	const form = <HTMLFormElement> UI.form;

	bomb.style.animationName = getAnimation(e.direction);
	form.submit();
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
export default function initializeBombEvents() {
	getElements(UI);
	const bomb = <HTMLElement> UI.bomb;

	const mc = new Manager(bomb);
	mc.add(new Swipe({ direction: DIRECTION_ALL }));
	mc.add(new Tap());

	mc.on('swipe', handleTouch).on('tap', handleTouch);
	bomb.addEventListener('animationend', clearAnimationState);

	return function removeBombEventListeners() {
		mc.destory();
		bomb.removeEventListener('animationend', clearAnimationState);
	}
}
