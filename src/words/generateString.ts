const scrabbleDistrubutions = {
	E: 1, A: 1, I: 1, O: 1, N: 1, R: 1, T: 1, L: 1, S: 1, U: 1,
	D: 2, G: 2,
	B: 3, C: 3, M: 3, P: 3,
	F: 4, H: 4, V: 4, W: 4, Y: 4,
	K: 5,
	J: 8, X: 8,
	Q: 10, Z: 10,
};

const vowels = new Set(['A', 'E', 'I', 'O', 'U']);

function buildDeck(distribution = scrabbleDistrubutions) {
	const deck = new Map<number, string[]>();

	for (const [letter, score] of Object.entries(distribution)) {
		let array = deck.get(score);
		if (!array) {
			array = [];
			deck.set(score, array);
		}

		array.push(letter);
	}

	return deck;
}

function rand(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

const deck = buildDeck();

/**
 * Generates some string to use.
 */
export default function generateString(): string {
	const points = [...deck.keys()];

	const ceil = rand(1, points.reduce((big, n) => (n > big ? n : big), 0));
	const count = rand(2, 3);

	function generateLetter() {
		let row = points[rand(0, points.length - 1)];
		if (row > ceil) row = 1;

		const letters = deck.get(row);
		if (!letters) throw new Error();
		return letters[rand(0, letters.length - 1)];
	}

	let str = '';
	for (let i = 0; i < count; i++) str += generateLetter();

	let hasVowels = false;
	for (const char of str) {
		if (vowels.has(char)) {
			hasVowels = true;
			break;
		}
	}
	// Try again if no vowels in this string
	if (!hasVowels) return generateString();
	else return str;
}
