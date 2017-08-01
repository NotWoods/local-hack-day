import { Store, Unsubscribe } from 'redux';
import { getElement, observeStore } from '../utils';
import { ServerState } from '../reducers/';
import { SpectatorState, PlayerSubState, RoundSubState } from '../reducers/spectator';

type ID = string;
function buildRoundLetterList(
	props: Map<string, ID>,
	prev?: HTMLUListElement | null,
): HTMLUListElement {
	let list = prev || document.createElement('ul');
	if (prev) {
		while (prev.firstChild) prev.removeChild(prev.firstChild);
	}

	for (const [word, player] of props) {
		let item = document.createElement('li');
		item.textContent = word;
		item.dataset.player = player;
		list.appendChild(item);
	}

	return list;
}

function buildRounds(props: RoundSubState[]): HTMLDListElement {
	let dList = document.createElement('dl');

	for (const { letters, wordsUsed } of props) {
		let dt = document.createElement('dt');
		dt.textContent = letters;
		dList.appendChild(dt);

		dList.appendChild(buildRoundLetterList(wordsUsed));
	}

	return dList;
}

function buildPlayerTableBody(props: PlayerSubState[]): HTMLTableSectionElement {
	let tbody = document.createElement('tbody');

	for (const [index, { id, name, score }] of props.entries()) {
		let row = document.createElement('row');
		row.dataset.player = id;

		let num = document.createElement('th');
		num.scope = 'row';
		num.textContent = index.toString();
		row.appendChild(num);

		let nickname = document.createElement('td');
		nickname.textContent = name;
		row.appendChild(nickname);

		let scorenum = document.createElement('td');
		scorenum.textContent = String(score);
		row.appendChild(scorenum);

		tbody.appendChild(row);
	}

	return tbody;
}

/**
 * Updates the DOM for the /spectate.html page
 */
export function renderSpectate(props: SpectatorState) {
	const table = getElement('players');
	const [tbody] = table.getElementsByTagName('tbody');
	table.replaceChild(buildPlayerTableBody(props.players), tbody);

	const rounds = getElement('rounds');
	const parent = rounds.parentElement as HTMLElement;
	parent.replaceChild(buildRounds(props.pastRounds), rounds);
}

export default function autoRender(store: Store<ServerState>): Unsubscribe {
	return observeStore(store, state => state.spectator, renderSpectate);
}
