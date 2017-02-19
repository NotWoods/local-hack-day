import {
	Manager, Swipe, Tap,
	DIRECTION_ALL, DIRECTION_UP, DIRECTION_DOWN, DIRECTION_RIGHT, DIRECTION_LEFT,
} from 'hammer';
import { getElements } from '../utils.js';
import { validWord, isMyTurn } from '../selectors.js';

const UI = { bomb: null, form: null };

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
	UI.bomb.style.animationName = getAnimation(e.direction);
	UI.form.submit();
}

/**
 * Sets up bomb event listeners for touch and animation end
 * @param {redux.Store} store
 */
export default function initializeBombEvents(store) {
	getElements(UI);
	const getState = store.getState.bind(store);

	const mc = new Manager(UI.bomb);
	mc.add(new Swipe({ direction: DIRECTION_ALL }));
	mc.add(new Tap());

	mc.on('swipe', handleTouch).on('tap', handleTouch);
	UI.bomb.addEventListener('animationend', () => {
		UI.bomb.style.animationName = '';
		UI.bomb.style.animationPlayState = 'paused';
	});
}
