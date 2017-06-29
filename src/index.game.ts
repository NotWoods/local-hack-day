import { createStore, combineReducers } from 'redux';
import { global, player, ClientState } from './reducers/';
import createUIListeners from './ui/';
/*import { connectSocketToStore } from './socket/'
import {
	NEW_ROUND, TICK, SYNC, COUNTDOWN,
	GAME_OVER, FOUND_WORD, BLEW_UP,
} from './messages';*/

const store = createStore(combineReducers<ClientState>({ global, player }));

const uiPromise = createUIListeners(store);
