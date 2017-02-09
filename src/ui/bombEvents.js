import * as Hammer from 'hammer';
import { getElements } from '../utils.js';
import { validWord, isMyTurn } from '../selectors.js';

const UI = { bomb: null, form: null };

let getState;

function getAnimation(direction) {
	switch (direction) {
		case Hammer.DIRECTION_LEFT: return 'slideLeft';
		case Hammer.DIRECTION_RIGHT: return 'slideRight';
		case Hammer.DIRECTION_UP: return 'slideUp';

		case Hammer.DIRECTION_DOWN:
		case Hammer.DIRECTION_NONE:
		default:
			return 'slideDown';
	}
}


function handleTouch(e) {
	UI.bomb.style.animationName = getAnimation(e.direction);
	UI.form.submit();
}

export function initialize(store) {
	getElements(UI);
	getState = store.getState;

	const mc = new Hammer.Manager(UI.bomb);
	mc.add(new Hammer.Swipe({ direction: Hammer.DIRECTION_ALL }));
	mc.add(new Hammer.Tap());

	mc.on('swipe', handleTouch).on('tap', handleTouch);
	UI.bomb.addEventListener('animationend', () => {
		UI.bomb.style.animationName = '';
		UI.bomb.style.animationPlayState = 'paused';
	});
}
