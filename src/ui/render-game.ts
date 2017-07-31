import { getElement } from '../utils';

interface GameProps {
	playerWithBomb: string | null,
	blownUp: boolean,
	submitted: boolean,
	round: number,
	score: number,
	timePercentage: number,
	letters: string,
}

const FUSE_LENGTH = 415;

export function renderGame(props: GameProps) {
	const bombClasses = getElement('bomb').classList;

	// Set the bomb status text, and disable/enable text box
	// based on wheter or not the player has the bomb currently
	let hasBombText;
	if (props.playerWithBomb == null) {
		hasBombText = 'You have the bomb!';
		bombClasses.remove('inactive');
		getElement('wordInput').removeAttribute('disabled');
	} else {
		hasBombText = `${props.playerWithBomb} is holding the bomb`;
		bombClasses.add('inactive');
		getElement('wordInput').setAttribute('disabled', 'true');
	}

	// Add 'failed' class if the player lost
	if (props.blownUp) {
		getElement('game-form').classList.add('failed');
	} else {
		getElement('game-form').classList.remove('failed');
	}

	// Play submission animation
	if (props.submitted) {
		bombClasses.add('bomb-submit');
	} else {
		bombClasses.remove('bomb-submit');
	}

	// Update the round number
	getElement('round').textContent = String(props.round);

	// Update the score number
	let scoreText = `${props.score} time`;
	if (props.score !== 1) scoreText += 's';

	// Update the fuse
	const percent = String((props.timePercentage * FUSE_LENGTH) + 3);
	getElement('fuse').style.strokeDashoffset = percent;

	// Update the letters displayed
	getElement('letterSet').textContent = props.letters;
}
