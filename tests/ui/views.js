import test from 'blue-tape';
import { createStore, combineReducers } from 'redux';
import globalReducer from '../../src/reducers/global.js';
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

const client = combineReducers({ global: globalReducer, player });
const getStore = createStore.bind(null, client);

test('Returns function to remove observers', (t) => {
	t.equal(typeof createViewUpdater(getStore()), 'function',
		'viewUpdater returns a function');
	t.end();
});

test('Updates letters to match store', (t) => {
	const store = getStore();
	const letters = getFakeElement('letterSet');
	createViewUpdater(store);

	store.dispatch(newRound('ad'));
	t.equal(letters.textContent, 'AD');

	store.dispatch(newRound('kge'));
	t.equal(letters.textContent, 'KGE');
	t.end();
});

test('Creates pattern to match all casing types', (t) => {
	const store = getStore();
	const input = getFakeElement('wordInput');
	createViewUpdater(store);

	store.dispatch(newRound('me'));
	const { pattern } = input;
	t.ok(pattern, 'pattern is defined');
	t.equal(typeof pattern, 'string', 'pattern is a string');

	let regex = new RegExp(pattern);
	t.false(regex.ignoreCase, 'pattern has false ignoreCase so it can be set in DOM');
	t.true(regex.test('somersault'), 'somersault contains ME');
	t.true(regex.test('MEAT'), 'MEAT contains ME');
	t.true(regex.test('sOmE'), 'sOmE contains ME');
	t.true(regex.test('Meow'), 'Meow contains ME');
	t.false(regex.test('apple'), "apple doesn't contain ME");
	t.false(regex.test('YELL'), "YELL doesn't contain ME");

	store.dispatch(newRound('app'));
	regex = new RegExp(input.pattern);
	t.false(regex.ignoreCase, 'pattern has false ignoreCase so it can be set in DOM');
	t.true(regex.test('apple'), 'apple contains APP');
	t.true(regex.test('Application'), 'Application contains APP');
	t.true(regex.test('aPpLy'), 'aPpLy contains APP');
	t.true(regex.test('notAPPureWord'), 'notAPPureWord contains APP');
	t.end();
});
