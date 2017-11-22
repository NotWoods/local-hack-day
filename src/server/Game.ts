import { parse } from 'querystring';
import { parsed } from 'document-promises';
import { createStore, combineReducers } from 'redux';
import initializeEventListeners from './game-listeners';
import autoRender from './game-render';
import { global, player, ClientState } from '../reducers/';

export default function initStore() {
	const { room = '', name = '' } = parse(window.location.search.substr(1));

	const reducer = combineReducers<ClientState>({ global, player });
	let preloadedState = reducer(undefined as any, { type: '@@INIT' });
	preloadedState.global.roomID = room;
	preloadedState.player.me = name;

	const store = createStore(
		reducer,
		preloadedState,
		window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
	);

	parsed
		.then(() => initializeEventListeners(store))
		.then(() => autoRender(store));

	return store;
}


export default class Game {
	constructor() {

	}
}
