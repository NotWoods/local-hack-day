import test from 'blue-tape';
import { createStore, combineReducers } from 'redux';
import global from '../../src/reducers/global.js';
import player from '../../src/reducers/player.js';
import { newRound } from '../../src/messages.js';
import { isMyTurn, percentTimeLeft } from '../../src/selectors.js';

const makeFakeElement = () => ({ textContent: '', value: '', style: {} });
const fakeElements = new Map();
function getFakeElement(id) {
	if (!fakeElements.has(id)) fakeElements.set(id, makeFakeElement());
	return fakeElements.get(id);
}

global.document = { getElementById: getFakeElement };

import createViewUpdater from '../../src/ui/viewUpdater.js';

const client = combineReducers({ global, player });
const getStore = createStore.bind(null, client);

test('Returns function to remove observers', (t) => {
	t.equal(typeof createViewUpdater(createStore()), 'function');
	t.end();
});

test('Updates letters to match store', (t) => {
	const store = createStore();
	const letters = getFakeElement('letterSet');
	createViewUpdater(store);

	store.dispatch(newRound('ad'));
	t.equal(letters.textContent, 'ad');

	store.dispatch(newRound('kge'));
	t.equal(letters.textContent, 'kge');
	t.end();
});

test('Creates pattern to match all casing types', (t) => {
	const store = createStore();
	const input = getFakeElement('wordInput');
	createViewUpdater(store);

	store.dispatch(newRound('me'));
	const { pattern } = input;
	t.ok(pattern);
	t.equal(typeof pattern, 'string');

	const regex = new RegExp(pattern);
	t.false(regex.ignoreCase);
	t.true(regex.test('somersault'));
	t.true(regex.test('MEAT'));
	t.true(regex.test('sOmE'));
	t.true(regex.test('Meow'));
	t.false(regex.test('apple'));
	t.false(regex.test('YELL'));

	store.dispatch(newRound('app'));
	const regTwo = new RegExp(input.pattern);
	t.false(regex.ignoreCase);
	t.true(regex.test('apple'));
	t.true(regex.test('Application'));
	t.true(regex.test('aPpLy'));
	t.true(regex.test('notAPureWord'));
	t.end();
});
