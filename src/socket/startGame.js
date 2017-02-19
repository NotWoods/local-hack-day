import { createStore, combineReducers } from 'redux';
import { countdown, newRound, tick } from '../messages.js';
import { gameStarted, maxTime, finishedGame } from '../selectors.js';

function wait(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * Counts down and resolves when the timer reaches 0
 */
function runCountdown(emit, getState) {
	return new Promise((resolve) => {
		const timer = setInterval(() => {
			emit(countdown());
			if (gameStarted(getState())) resolve(timer);
		}, 1000);
	}).then(clearInterval);
}

function runRound() {
	const roundStart = Date.now();
	emit(newRound());

	const timer = setInterval(() => {
		const timeElapsed = Date.now() - roundStart;
		emit(tick(timeElapsed));
	}, 1000);

	return wait(maxTime(getState())).then(() => {
		clearInterval(timer);

		if (!finishedGame(getState())) return runRound();
	});
}

export default function startGame(emit, getState) {
	return runCountdown(emit, getState).then(() => runRound());
}
