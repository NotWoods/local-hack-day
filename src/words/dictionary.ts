import { createReadStream } from 'fs';
import * as byline from 'byline';

const dictionary = new Set<string>();
let err: Error | null = null;

export function initialize(path = 'sowpods.txt') {
	const stream: byline.LineStream = byline(createReadStream(path, 'utf8'));
	stream.on('data', (word: string) => dictionary.add(word));

	return new Promise((resolve, reject) =>
		stream.on('finish', resolve).on('error', reject))
	.catch(error => {
		stream.destroy();
		err = error;
		throw error;
	})
	.then(() => dictionary);
}

/**
 * Checks if a word exists in a scrabble dictionary
 * @param {string} word
 * @returns {boolean} if word exists
 */
export default function existsInDictionary(word: string): boolean {
	if (err) throw err;
	else if (dictionary.size === 0) {
		throw new Error('Dictionary not initialized.');
	}

	const upper = word.toUpperCase().trim();
	return dictionary.has(upper);
}
