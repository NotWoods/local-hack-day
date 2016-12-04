const vowels = ['A', 'E', 'I', 'O', 'U'];
const consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];

function rand(max) {
	return Math.floor(Math.random() * max);
}

/**
 * @returns {string} Random string 2-3 letters long
 */
module.exports = function generateString() {
	const n = Math.random();
	const v = rand(4);
	const c = rand(20);

	let str = `${consonants[c]}${vowels[v]}`;
	// if (n > .5) str += consonants[rand(20)];
	return str;
}

// console.log(module.exports());
