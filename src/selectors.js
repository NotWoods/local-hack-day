export function isMyTurn({ global, player }) {
	return global.holding_bomb === player.me;
}

export function percentTimeLeft({ global }) {
	return global.timeLeft / global.maxTime;
}

export function containsLetters({ global }, word) {
	return word.toUpperCase().includes(global.letters);
}

export function unusedWord({ global }, word) {
	return !global.wordsUsed.has(word.toUpperCase());
}

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

export function spellCheck(word) {
	return fetch(`${process.env.SERVER}/checkword/${word}`, { method: 'HEAD' })
		.catch(err => ({ ok: false }))
		.then(response => response.ok);
}

export function validWord(state, word) {
	return containsLetters(state, word) && unusedWord(state, word);
}

export function gameOver({ global }) {
	return Boolean(global.winner);
}
