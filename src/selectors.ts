import { State, ClientState, ServerState } from './reducers';
type ID = string;

/**
 * Checks if this player is the one holding the bomb
 * @param {string} [me] the player to check for - defaults to current player
 * @returns {boolean}
 */
export function isMyTurn(state: State, me: ID): boolean
export function isMyTurn(state: ClientState, me?: ID): boolean
export function isMyTurn(state: State | ClientState, me?: ID): boolean {
	if ('player' in state) {
		const { player } = <ClientState> state;
		me = player.me;
	}
	return state.global.holdingBomb === me;
}

/**
 * Gets time left as decimal
 * @returns {number}
 */
export function percentTimeLeft({ global }: State): number {
	return global.timeLeft / global.maxTime;
}

/**
 * True if the word contains the current letters of the round
 * @param {string} word
 * @returns {boolean}
 */
export function containsLetters({ global }: State, word: string): boolean {
	return word.toUpperCase().includes(global.letters);
}

/**
 * true if the word has not been used in this round by any player
 * @param {string} word
 * @returns {boolean}
 */
export function unusedWord(
	state: ClientState | ServerState,
	word: string,
): boolean {
	let wordsUsed;
	if ('player' in state) {
		const { player } = <ClientState> state;
		wordsUsed = player.wordsUsed;
	} else {
		const { spectator } = <ServerState> state;
		wordsUsed = spectator.pastRounds[spectator.pastRounds.length - 1].wordsUsed;
	}

	return !wordsUsed.has(word.toUpperCase());
}

/**
 * Gets the ID of the player currently holding the bomb
 * @returns {string}
 */
export function currentPlayer({ global }: State): ID {
	return global.holdingBomb;
}

/**
 * Finds the ID of the player who will receive the bomb next
 * @returns {string}
 */
export function nextPlayer({ global, spectator }: ServerState): ID {
	const { holdingBomb } = global;
	const { players } = spectator;
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
export function spellCheck(word: string): Promise<boolean> {
	return fetch(`${process.env.SERVER}/checkword/${word}`, { method: 'HEAD' })
		.catch(() => ({ ok: false }))
		.then(response => response.ok);
}

/**
 * True if the word is a valid entry and hasn't been used
 * @param {string} word
 * @returns {boolean}
 */
export function validWord(state: ClientState | ServerState, word: string): boolean {
	return containsLetters(state, word) && unusedWord(state, word);
}

/**
 * True if the game has ended
 * @returns {boolean}
 */
export function gameOver({ global }: State): boolean {
	return Boolean(global.winner);
}

/**
 * true if the game has started
 * @returns {boolean}
 */
export function gameStarted({ global }: State): boolean {
	return global.countdown === 0;
}

/**
 * The maximum time in a round
 * @returns {number}
 */
export function maxTime({ global }: State): number {
	return global.maxTime;
}

/**
 * True if the game has exceeded the provided number of rounds
 * @param {number} maxRounds
 * @returns {boolean}
 */
export function finishedGame({ global }: State, maxRounds: number): boolean {
	return global.round >= maxRounds;
}

/**
 * Finds the players with the lowest scores
 * @returns {string[]}
 */
export function currentLead({ spectator }: ServerState): ID[] {
	const leads = new Set<ID>();
	let lowestScore = Number.MAX_VALUE;
	spectator.players.forEach(({ id, score }) => {
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

export function getRoomID({ global }: State) {
	return global.roomID;
}
