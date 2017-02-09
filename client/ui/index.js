import reducer from '../state/clientReducer.js';
import { NEW_ROUND, SYNC, COUNTDOWN, PASS_BOMB, GAME_OVER } from '../state/messages.js';
import { onUpdate as bombUpdate } from './bomb.js';
import { onUpdate as fuseUpdate } from './fuse.js';
import { onUpdate as inputUpdate } from './input.js';
import { onUpdate as letterUpdate } from './letters.js';
import { onUpdate as subUpdate } from './subtitle.js';
import { setSubmitSocket } from './submit.js';

function onUpdate(state) {
	bombUpdate(state);
	fuseUpdate(state);
	inputUpdate(state);
	letterUpdate(state);
	subUpdate(state);
}

let state;
export default function attachSocket(socket) {
	function prepareSocket(event) {
		socket.io(event, msg => {
			state = reducer(state, event, msg);
			onUpdate(state);
		});
	}

	prepareSocket(NEW_ROUND);
	prepareSocket(SYNC);
	prepareSocket(COUNTDOWN);
	prepareSocket(PASS_BOMB);
	prepareSocket(GAME_OVER);
	setSubmitSocket(socket);
}
