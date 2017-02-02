import { currentText, validInput } from './input.js';
import { CLIENT_DONE } from '../state/messages.js';

let socket;
export function setSubmitSocket(s) { socket = s; }

export default function submit() {
	if (validInput) socket.emit('bomb.pass', currentText);
}
