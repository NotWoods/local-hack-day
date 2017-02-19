import { PASS_BOMB } from '../messages.js';
import { isMyTurn, nextPlayer } from '../selectors.js';
import existsInDictionary from '../dictionary.js';

export default function handleClientEvents(socket, emit, getState) {
	socket.on(PASS_BOMB, (word, callback) => {
		const id = socket.id;

		let err;
		if (isMyTurn(gameStore.getState(), id)) {
			err = new Error(`It's not currently ${id}'s turn`);
		} else if (existsInDictionary(word)) {
			err = new Error(`${word} doesn't exist in dictionary`);
		}

		if (!err) {
			emit({
				type: FOUND_WORD,
				payload: {
					word, id,
					next: nextPlayer(getState()),
				}
			});
		}

		callback(err);
	});
}
