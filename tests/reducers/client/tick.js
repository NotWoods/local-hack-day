import test from 'blue-tape';
import { combineReducers } from 'redux';
import { global } from '../../../src/reducers/index.js';
import { tick } from '../../../src/messages.js';
import { percentTimeLeft, maxTime } from '../../../src/selectors.js';

const client = combineReducers({ global });

const midRoundState = Object.freeze({
	global: {
		round: 1, letters: 'ME',
		maxTime: 20, timeLeft: 11,
		holdingBomb: 'asdfrs7df3',
		winner: '', countdown: 0,
	},
});

test('tick sets the elapsed time', (t) => {
	const nextState = client(midRoundState, tick(10));

	t.equal(nextState.global.timeLeft, 10,
		'time left is max time minus time elapsed')

	t.equal(percentTimeLeft(nextState), 0.5,
		'percentTimeLeft returns remaining time as fraction');

	t.equal(maxTime(nextState), maxTime(midRoundState), 'maxTime stays constant');

	t.end();
});

test('tick decrements the time remaining', (t) => {
	const nextState = client(midRoundState, tick());

	t.equal(nextState.global.timeLeft, midRoundState.global.timeLeft - 1,
		'time left is one second less than previous')

	t.equal(percentTimeLeft(nextState), 0.5,
		'percentTimeLeft returns remaining time as fraction');

	t.equal(maxTime(nextState), maxTime(midRoundState), 'maxTime stays constant');

	t.end();
});

