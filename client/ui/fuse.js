import { percentTimeLeft } from '../state/selectors.js';
import observeState from '../state/observerState.js';

const ID = 'fuse';
const FUSE_LENGTH = 415;
const node = document.getElementById(ID);

export const onUpdate = observeState(percentTimeLeft, (percent) => {
	node.style.strokeDashoffset = (percentage * FUSE_LENGTH) + 3;
})
