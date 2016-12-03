const fs = require('fs')
const DIC = new Set();

fs.readFile('./sowpods.txt','utf8', (err, data) => {
  console.log(err)
  data.split('\r\n').forEach(word => DIC.add(word))
})

/**
 * Checks if a word exists in a scrabble dictionary
 * @param {string} word
 * @returns {Promise} if word exists, resolves with the word.
 * If the word does not exist, the promise rejects.
 */
function validWord(word) {
	const wordUpper = word.toUpperCase();
	if (DIC.has(wordUpper)) return Promise.resolve(wordUpper);
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
