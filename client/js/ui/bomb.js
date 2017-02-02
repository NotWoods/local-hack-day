import { parsed } from 'document-promises';
import * as Hammer from 'hammer';
import { isMyTurn } from '../state/selectors.js';
import { validInput } from './input.js';
import submit from '../submit.js';

const ID = 'bomb';
let node;
let mc;

const animationMap = {
	[Hammer.DIRECTION_LEFT]: 'slideLeft',
	[Hammer.DIRECTION_RIGHT]: 'slideRight',
	[Hammer.DIRECTION_UP]: 'slideUp',
	[Hammer.DIRECTION_DOWN]: 'slideDown',
	[Hammer.DIRECTION_NONE]: 'slideDown',
}

let myTurn;
export function onUpdate(state) {
	myTurn = isMyTurn(state);
}

function submitAnimation(e) {
	if (!myTurn) return;
	else if (!validInput) {
		node.style.animationName = 'shake';
		return;
	}

	submit(e);

	node.style.animationName = animationMap[e.direction] || 'slideDown';
}


parsed.then(() => {
	node = document.getElementById(ID);
	mc = new Hammer.Manager(node);

	mc.add(new Hammer.Swipe({ direction: Hammer.DIRECTION_ALL }));
	mc.add(new Hammer.Tap());

	mc.on('swipe', submitAnimation);
	mc.on('tap', submitAnimation);

	bomb.addEventListener('animationend',	() => node.style.animationName = '');
});
