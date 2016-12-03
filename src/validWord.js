const { createReadStream } = require('fs');
const { Transform, Writable } = require("stream");
const { StringDecoder } = require('string_decoder');

class Splitter extends Transform {
  _transform(chunk, encoding, next) {
    let lines = ((this.soFar != null ? this.soFar:"") + chunk.toString()).split(/\r?\n/);
    this.soFar = lines.pop();
    for (let line of lines) { this.push(line); }
    next();
  }
  _flush(done) {
    this.push(this.soFar != null ? this.soFar:"");
    done();
  }
}

class Searcher extends Transform {
	constructor(word, options) {
		super(options);
		this.word = word.toUpperCase();
		this.done = false;
		this.decoder = new StringDecoder('utf8');
	}

	_transform(chunk, encoding, next) {
		if (this.done) return;

		const chunkWord = this.decoder.write(chunk);
		if (chunkWord === this.word) {
			this.emit('found', chunkWord);
			this.done = true;
		}

		next();
	}

	_flush(next) {
		if (!this.done) this.emit('notfound');
		next();
	}

	ready() {
		return new Promise((resolve, reject) => {
			this.on('found', resolve);
			this.on('notfound', reject);
		})
	}
}

/**
 * Checks if a word exists in a scrabble dictionary
 * @param {string} word
 * @returns {Promise} if word exists, resolves with the word.
 * If the word does not exist, the promise rejects.
 */
module.exports = function validWord(word) {
	const searcher = new Searcher(word);
	createReadStream('../sowpods.txt').pipe(new Splitter()).pipe(searcher);
	return searcher.ready();
	//.then(console.log, () => console.error('failed'));
}

// validWord(process.argv[2])

exports.route = {
	method: 'GET',
	path: '/checkword/{word}',
	handler({ params: { word } }, reply) {
		return validWord(word)
			.then(result => reply(result))
			.catch(() => reply('Word invalid').code(400));
	},
}
