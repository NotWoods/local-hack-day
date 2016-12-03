const fs = require('fs')
const DIC = {}
let readErr;

fs.readFile('./sowpods.txt','utf8', (err, data) => {
  readErr = err;
  data.split('\r\n').forEach(word => DIC[word] = 1);
})

/**
 * Checks if a word exists in a scrabble dictionary
 * @param {string} word
 * @returns {Promise} if word exists, resolves with the word.
 * If the word does not exist, the promise rejects.
 */
function validWord(word) {
	if (readErr) return Promise.reject(readErr);

	const wordUpper = word.toUpperCase();
	if (DIC[wordUpper]) return Promise.resolve(wordUpper);
	else return Promise.reject();
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

exports.default = validWord;
