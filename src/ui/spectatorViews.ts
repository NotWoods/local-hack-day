import { Store, Unsubscribe } from 'redux';
import { createSelector } from 'reselect';
import { ServerState } from '../reducers/';
import { getElements, observeStore, UIMap } from '../utils';

const UI: UIMap = {
	playersList: null,
	rounds: null,
};

const playersSelector = createSelector(
	(state: ServerState) => state.spectator.players,
	state => state.global.holdingBomb,
	(players, holdingBomb) => ({ players, holdingBomb })
);

/**
 * Observes redux store and updates the UI when needed
 * @param {redux.Store} store
 * @returns {Function} removeObservers function
 */
export default function createSpectatorViewUpdater(store: Store<ServerState>): Unsubscribe {
	getElements(UI);
	const playersList = <HTMLElement> UI.playersList;
	const rounds = <HTMLInputElement> UI.rounds;

	const o0 = observeStore(store, playersSelector, ({ players, holdingBomb }) => {
		while (playersList.firstChild) playersList.removeChild(playersList.firstChild);

		for (const { id, name, score } of players) {
			const row = document.createElement('tr');
			row.id = id;
			row.tabIndex = 0;
			if (holdingBomb === id) row.className = 'is-selected';

			const nameContainer = document.createElement('td');
			nameContainer.textContent = name;
			row.appendChild(nameContainer);

			const scoreContainer = document.createElement('td');
			scoreContainer.textContent = String(score);
			scoreContainer.className = 'player-score';
			row.appendChild(scoreContainer);

			playersList.appendChild(row);
		}
	});

	const o2 = observeStore(store, s => s.spectator.pastRounds, (pastRounds) => {
		while (rounds.firstChild) rounds.removeChild(rounds.firstChild);

		for (const { letters, wordsUsed } of pastRounds) {
			const header = document.createElement('dt');
			header.textContent = letters;
			rounds.appendChild(header);

			const container = document.createElement('dd');
			const list = document.createElement('ul');

			for (const [word] of wordsUsed) {
				const wordContainer = document.createElement('li');
				wordContainer.textContent = word;
				list.appendChild(wordContainer);
			}

			container.appendChild(list);
			rounds.appendChild(container);
		}
	});

	return function removeObservers() {
		o0();
		o2();
	}
}
