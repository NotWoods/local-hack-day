import { shim } from 'string.prototype.padstart';
shim();

/**
 * Uses object keys to lookup elements by ID
 * @param {Object} obj where keys are document IDs
 * @returns obj - each value will be set to an element
 */
export function getElements(obj) {
	Object.keys(obj).forEach((id) => {
		obj[id] = document.getElementById(id);
	});

	return obj;
}


/**
 * Function to observe redux store and activate callback when
 * changes are detected.
 * @param {Redux.Store} store
 * @param {function} selector state => T
 * @param {function} onChange T => void, called when selected state changes.
 */
export function observeStore(store, selector, onChange) {
	let currentState;

	function handleChange() {
		const nextState = selector(store.getState());
		if (nextState !== currentState) {
			currentState = nextState;
			onChange(currentState);
		}
	}

	const unsubscribe = store.subscribe(handleChange);
	handleChange();
	return unsubscribe;
}


/**
 * Generates all possible casing combinations for some string.
 * @param {string} string source text
 * @returns {string[]} array of possible casings.
 * @example
 * allPossibleCases('ab') -> ['ab', 'aB', 'Ab', 'AB']
 */
export function allPossibleCases(string) {
	const str = string.split('');
	const lower = str.map(l => l.toLowerCase());
	const upper = str.map(l => l.toUpperCase());

	const result = [];

	const bits = string.length;
	for (let i = 0; i.toString(2).length <= bits; i++) {
		const binary = i.toString(2).padStart(bits, '0');
		const cases = Array.from(binary)
			.map((b, idx) => (b === '1' ? upper[idx] : lower[idx]))
			.join('');
		result.push(cases);
	}

	return result;
}
