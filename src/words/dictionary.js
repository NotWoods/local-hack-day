import { createReadStream } from 'fs';
import byline from 'byline';

const dictionary = new Set();
let err = null;

export function initialize(path = 'sowpods.txt') {
	const stream = byline(createReadStream(path, 'utf8'));
	stream.on('data', word => dictionary.add(word));

	return new Promise((resolve, reject) =>
		stream.on('finish', resolve).on('error', reject)
	)
	.catch(error => { err = error; throw error; })
	.then(() => dictionary);
}

/**
 * Checks if a word exists in a scrabble dictionary
 * @param {string} word
 * @returns {boolean} if word exists
 */
export default function existsInDictionary(word) {
	if (error) throw error;
	else if (dictionary.size === 0) {
		throw new Error('Dictionary not initialized.');
	}

	const upper = word.toUpperCase().trim();
	return dictionary.has(word);
}
