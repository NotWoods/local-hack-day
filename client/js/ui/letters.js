import { parsed } from 'document-promises';

const ID = 'letterSet';
let node;
parsed.then(() => { node = document.getElementById(ID); });

let lastText;
export function onUpdate({ global: { letters } }) {
	if (lastText === letters) return;

	node.textContent = letters
	lastText = letters;
}
