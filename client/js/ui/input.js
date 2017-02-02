import { parsed } from 'document-promises';
import { isMyTurn, validWord } from '../state/selectors.js';
import submit from '../submit.js';

const ID = 'wordInput';
let node;

export let validInput = false;
export let currentText = '';

function allPossibleCases(string) {
	const str = string.split('');
	const lower = str.map(l => l.toLowerCase());
	const upper = str.map(l => l.toUpperCase());

	const result = [];

	const bits = string.length;
	for (let i = 0; i.toString(2).length < bits; i++) {
		const binary = i.toString(2).padStart(bits, '0').split('');
		const cases = binary.map((b, idx) => (b === '1' ? upper[idx] : lower[idx]));
		result.push(cases);
	}

	return result;
}

let letters;
let myTurn;
let gameover;
export function onUpdate(state) {
	const isMyTurn = isMyTurn(state);
	const newLetters = state.global.letters;

	if (isMyTurn !== myTurn) {
		if (!isMyTurn) node.value = '';
	}

	if (letters !== newLetters) {
		const possibleCases = allPossibleCases(newLetters);
		const pattern = `.*(?:${possibleCases.join('|')}).*`;
		node.pattern = pattern;
	}

	letters = newLetters;
	myTurn = isMyTurn;
}

function handleChange({ keyCode, target: { value } }) {
	currentText = value;

	if (keyCode === 13) {
		submit();
		return;
	}

	validWord(state, currentText).then(isValid => { validInput = isValid; });
}

parsed.then(() => {
	node = document.getElementById(ID);
	node.addEventListener('keyup', handleChange);
});
