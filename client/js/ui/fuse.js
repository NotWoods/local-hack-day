import { parsed } from 'document-promises';
import { percentTimeLeft } from '../state/selectors.js';

const ID = 'fuse';
let node;
parsed.then(() => { node = document.getElementById(ID); });

const FUSE_LENGTH = 415;

let lastPercentage;
export function onUpdate(state) {
	const percentage = percentTimeLeft(state);
	if (lastPercentage === percentage) return;

	node.style.strokeDashoffset = (percentage * FUSE_LENGTH) + 3;
	lastPercentage = percentage;
}
