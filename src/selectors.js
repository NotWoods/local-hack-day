/**
 * Checks if this player is the one holding the bomb
 * @param {string} [me] the player to check for - defaults to current player
 * @returns {boolean}
 */
export function isMyTurn({ global, player }, me) {
	return global.holding_bomb === (me || player.me);
}

/**
 * Gets time left as decimal
 * @returns {number}
 */
export function percentTimeLeft({ global }) {
	return global.timeLeft / global.maxTime;
}

/**
 * True if the word contains the current letters of the round
 * @param {string} word
 * @returns {boolean}
 */
export function containsLetters({ global }, word) {
	return word.toUpperCase().includes(global.letters);
}

/**
 * true if the word has not been used in this round by any player
 * @param {string} word
 * @returns {boolean}
 */
export function unusedWord({ player, spectator }, word) {
	let wordsUsed;
	if (player) wordsUsed = player.wordsUsed;
	else wordsUsed = spectator.pastRounds[spectator.pastRounds.length - 1].wordsUsed;

	return !wordsUsed.has(word.toUpperCase());
}

/**
 * Gets the ID of the player currently holding the bomb
 * @returns {string}
 */
export function currentPlayer({ global }) {
	return global.holdingBomb;
}

/**
 * Finds the ID of the player who will receive the bomb next
 * @returns {string}
 */
export function nextPlayer({ global, spectator }) {
	const { holdingBomb } = global;
	const { players } = state;
	const currentIndex = players.findIndex(player => player.id === holdingBomb);

	let nextIndex = currentIndex + 1;
	if (currentIndex === players.length - 1) {
		nextIndex = 0;
	}

	return players[nextIndex].id;
}

/**
 * Checks with the server to ensure a word is spelled correctly.
 * @param {string} word
 * @returns {Promise<boolean>} true if found in dictionary
 */
export function spellCheck(word) {
	return fetch(`${process.env.SERVER}/checkword/${word}`, { method: 'HEAD' })
		.catch(err => ({ ok: false }))
		.then(response => response.ok);
}

/**
 * True if the word is a valid entry and hasn't been used
 * @param {string} word
 * @returns {boolean}
 */
export function validWord(state, word) {
	return containsLetters(state, word) && unusedWord(state, word);
}

/**
 * True if the game has ended
 * @returns {boolean}
 */
export function gameOver({ global }) {
	return Boolean(global.winner);
}

/**
 * true if the game has started
 * @returns {boolean}
 */
export function gameStarted({ global }) {
	return global.countdown === 0;
}

/**
 * The maximum time in a round
 * @returns {number}
 */
export function maxTime({ global }) {
	return global.maxTime;
}

/**
 * True if the game has exceeded the provided number of rounds
 * @param {number} maxRounds
 * @returns {boolean}
 */
export function finishedGame({ global }, maxRounds) {
	return global.round >= maxRounds;
}

/**
 * Finds the players with the lowest scores
 * @returns {string[]}
 */
export function currentLead({ spectator }) {
	const leads = new Set();
	let lowestScore = Number.MAX_VALUE;
	spectator.forEach(({ id, score }) => {
		if (score <= lowestScore) {
			if (score < lowestScore) {
				leads.clear();
				lowestScore = score;
			}
			leads.add(id);
		}
	});

	return Array.from(leads);
}
