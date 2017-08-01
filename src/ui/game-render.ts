import { createSelector } from 'reselect';
import { Store, Unsubscribe } from 'redux';
import { getElement, observeStore } from '../utils';
import { isMyTurn, percentTimeLeft } from '../selectors';
import { ClientState } from '../reducers/';

const selector = createSelector(
	(state: ClientState) => state.player,
	state => state.global,
	isMyTurn,
	percentTimeLeft,
	(player, global, myTurn, timePercentage) => {
		return {
			myTurn,
			blownUp: false,
			round: global.round,
			score: player.score,
			timePercentage,
			letters: global.letters,
		};
	}
)

interface GameProps {
	myTurn: boolean,
	blownUp: boolean,
	round: number,
	score: number,
	timePercentage: number,
	letters: string,
}

const FUSE_LENGTH = 415;

/**
 * Updates the DOM for the /game.html page
 */
export function renderGame(props: GameProps) {
	const bombClasses = getElement('bomb').classList;

	// Set the bomb status text, and disable/enable text box
	// based on wheter or not the player has the bomb currently
	let hasBombText;
	if (props.myTurn) {
		hasBombText = 'You have the bomb!';
		bombClasses.remove('inactive');
		getElement('wordInput').removeAttribute('disabled');
	} else {
		hasBombText = 'Someone else is holding the bomb';
		bombClasses.add('inactive');
		getElement('wordInput').setAttribute('disabled', 'true');
	}
	getElement('hasBomb').textContent = hasBombText;

	// Add 'failed' class if the player lost
	if (props.blownUp) {
		getElement('game-form').classList.add('failed');
	} else {
		getElement('game-form').classList.remove('failed');
	}

	// Update the round number
	getElement('round').textContent = String(props.round);

	// Update the score number
	let scoreText = `${props.score} time`;
	if (props.score !== 1) scoreText += 's';
	getElement('score').textContent = scoreText;

	// Update the fuse
	let timeElapsedPercent = 1 - props.timePercentage;
	const percent = ((timeElapsedPercent * FUSE_LENGTH) + 3).toString();
	getElement('fuse').style.strokeDashoffset = percent;

	// Update the letters displayed
	getElement('letterSet').textContent = props.letters;
}

export default function autoRender(store: Store<ClientState>): Unsubscribe {
	return observeStore(store, selector, renderGame);
}
