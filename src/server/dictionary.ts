import { createReadStream } from 'fs';
import * as byline from 'byline';

/**
 * Used to check if a word is valid
 */
export default class Dictionary {
	private initializerError: Error | null = null;
	private dictionary: Set<string>;

	/** Resolves once the dictionary has loaded */
	public ready: Promise<void>;

	constructor(path = 'sowpods.txt') {
		const stream: byline.LineStream = byline(createReadStream(path, 'utf8'));
		stream.on('data', (word: string) => this.dictionary.add(word));

		this.ready = new Promise((resolve, reject) =>
			stream.on('finish', resolve).on('error', reject)
		)
		.then(() => {})
		.catch(error => {
			stream.destroy();
			this.initializerError = error;
			throw error;
		})
	}

	/** Checks if a word exists in a scrabble dictionary */
	existsInDictionary(word: string): boolean {
		if (this.initializerError) throw this.initializerError;
		else if (this.dictionary.size === 0) {
			throw new Error('Dictionary not initialized.');
		}

		const upper = word.toUpperCase().trim();
		return this.dictionary.has(upper);
	}
}
