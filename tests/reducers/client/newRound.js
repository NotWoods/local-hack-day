import test from 'blue-tape';
import { combineReducers } from 'redux';
import { global, player } from '../../../src/reducers/index.js';
import { newRound } from '../../../src/messages.js';
import {
	containsLetters, unusedWord,
	validWord, maxTime, finishedGame,
} from '../../../src/selectors.js';

const client = combineReducers({ global, player });

const midRoundState = Object.freeze({
	global: {
		round: 1, letters: 'ME',
		maxTime: 30, timeLeft: 15,
		holdingBomb: 'asdfrs7df3',
		winner: '', countdown: 0,
	},
	player: {
		me: 'asdfrs7df3', score: 1,
		wordsUsed: new Set(['MEAT', 'SOME']),
	},
});

test('newRound increments round and resets letters, time, and wordsUsed', (t) => {
	const nextState = client(midRoundState, newRound('so'));

	t.equal(nextState.global.round, midRoundState.global.round + 1,
		'Round number is incremented')

	t.equal(nextState.global.letters, 'SO',
		'Letters matches value from newRound');

	t.equal(nextState.global.timeLeft, midRoundState.global.maxTime,
		'timeLeft is reset to maxTime');

	t.equal(nextState.player.wordsUsed.size, 0,
		'wordsUsed is clear');

	t.end();
});

test('maxTime is updated if set', (t) => {
	const nextState = client(midRoundState, newRound(undefined, 20));

	t.equal(nextState.global.maxTime, 20, 'maxTime is set to new value');
	t.equal(maxTime(nextState), 20, 'maxTime selector is set to new value');
	t.equal(nextState.global.timeLeft, 20, 'timeLeft is set to new value');
	t.end();
});

test('unused words are reset', (t) => {
	t.false(unusedWord(midRoundState, 'meat'), 'meat is used');
	t.false(validWord(midRoundState, 'meat'), 'meat is not valid (used)');
	t.false(validWord(midRoundState, 'apple'), 'apple is not valid (missing "me")');

	const nextState = client(midRoundState, newRound('go'));
	t.true(unusedWord(nextState, 'meat'), 'meat is unused');
	t.false(validWord(nextState, 'meat'), 'meat is not valid');
	t.false(validWord(nextState, 'apple'), 'apple is not valid');
	t.end();
});

test('rounds increment', (t) => {
	let lastState = midRoundState;

	for (let i = 0; i < 4; i++) {
		lastState = client(lastState, newRound());
	}

	t.notOk(finishedGame(lastState, 10), '5 rounds out of 10');
	t.ok(finishedGame(lastState, 5), '5 rounds out of 5');
	t.end();
});

test('contains letters is altered', (t) => {
	t.ok(containsLetters(midRoundState, 'mean'), 'mean contains ME');
	t.ok(containsLetters(midRoundState, 'some'), 'some contains ME');
	t.notOk(containsLetters(midRoundState, 'apple'), "apple doesn't contain ME");

	const nextState = client(midRoundState, newRound('so'));

	t.notOk(containsLetters(nextState, 'mean'), "mean doesn't contain SO");
	t.ok(containsLetters(nextState, 'some'), 'some contains SO');
	t.notOk(containsLetters(nextState, 'apple'), "apple doesn't contain SO");
	t.end();
});

