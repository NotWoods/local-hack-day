const fetch = require('node-fetch');
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

function validWord(word) {
	return fetch('https://raw.githubusercontent.com/jmlewis/valett/master/scrabble/sowpods.txt')
		.then(res => {
			const searcher = new Searcher(word);
			res.body.pipe(new Splitter()).pipe(searcher);
			return searcher.ready();
		})
		.then(console.log, () => console.error('failed'));
}

validWord(process.argv[2])
