import { createStore, combineReducers } from 'redux';
import { countdown, newRound, tick, playerBlewUp } from '../messages.js';
import { gameStarted, maxTime, finishedGame } from '../selectors.js';

function wait(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * Counts down and resolves when the timer reaches 0
 * @param {Function} emit
 * @param {Function} getState
 * @returns {Promise<void>} resolves after timer has finished
 */
function runCountdown(emit, getState) {
	return new Promise((resolve) => {
		const timer = setInterval(() => {
			emit(countdown());
			if (gameStarted(getState())) resolve(timer);
		}, 1000);
	}).then(clearInterval);
}

/**
 * @param {number} maxRounds
 * @returns {Promise<void>} once all rounds are done
 */
function runRound(maxRounds = 3) {
	const roundStart = Date.now();
	emit(newRound());

	const timer = setInterval(() => {
		const timeElapsed = Date.now() - roundStart;
		emit(tick(timeElapsed));
	}, 1000);

	return wait(maxTime(getState())).then(() => {
		clearInterval(timer);
		const holder = currentPlayer(getState());
		emit(playerBlewUp(holder));

		if (!finishedGame(getState(), maxRounds)) return runRound(maxRounds);
	});
}

export default function startGame(emit, getState) {
	return runCountdown(emit, getState).then(() => runRound());
}
