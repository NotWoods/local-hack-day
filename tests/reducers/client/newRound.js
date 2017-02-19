import test from 'blue-tape';
import { combineReducers } from 'redux';
import global from '../../../src/reducers/global.js';
import player from '../../../src/reducers/player.js';
import { newRound } from '../../../src/messages.js';
import {
	containsLetters, unusedWord,
	validWord, maxTime, finishedGame,
} from '../../../src/selectors.js';

const client = combineReducers({ global, player });

const midRoundState = Object.freeze({
	global: {
		round: 1, letters: 'me',
		maxTime: 30, timeLeft: 15,
		holdingBomb: 'asdfrs7df3',
		winner: '', countdown: 0,
	},
	player: {
		me: 'asdfrs7df3', score: 1,
		wordsUsed: new Set('meat', 'some'),
	},
});

test('newRound increments round and resets letters, time, and wordsUsed', (t) => {
	const nextState = client(midRoundState, newRound('so'));

	t.equal(nextState.global.round, midRoundState.global.round + 1,
		'Round number is incremented')

	t.equal(nextState.global.letters, 'so',
		'Letters matches value from newRound');

	t.equal(nextState.global.timeLeft, midRoundState.global.maxTime,
		'timeLeft is reset to maxTime');

	t.equal(nextState.player.wordsUsed.size, 0,
		'wordsUsed is clear');

	t.end();
});

test('maxTime is updated if set', (t) => {
	const nextState = client(midRoundState, newRound(undefined, 20));

	t.equal(nextState.global.maxTime, 20);
	t.equal(maxTime(nextState), 20);
	t.equal(nextState.global.timeLeft, 20);
	t.end();
});

test('unused words are reset', (t) => {
	t.false(unusedWord(midRoundState, 'meat'));
	t.false(validWord(midRoundState, 'meat'));
	t.false(validWord(midRoundState, 'apple'));

	t.true(unusedWord(client(midRoundState, newRound()), 'meat'));
	t.true(validWord(client(midRoundState, newRound()), 'meat'));
	t.true(validWord(client(midRoundState, newRound()), 'apple'));
	t.end();
});

test('rounds increment', (t) => {
	let lastState = midRoundState;

	for (let i = 0; i < 4; i++) {
		lastState = client(lastState, newRound());
	}

	t.notOk(finishedGame(lastState, 10));
	t.ok(finishedGame(lastState, 3));
	t.end();
});

test('contains letters is altered', (t) => {
	t.ok(containsLetters(midRoundState, 'mean'));
	t.ok(containsLetters(midRoundState, 'some'));
	t.notOk(containsLetters(midRoundState, 'apple'));

	const nextState = client(midRoundState, newRound('so'));

	t.notOk(containsLetters(midRoundState, 'mean'));
	t.ok(containsLetters(midRoundState, 'some'));
	t.notOk(containsLetters(midRoundState, 'apple'));
	t.end();
});

