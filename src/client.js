import { createStore, combineReducers } from 'redux';
import io from 'socket.io-client';
import { global, player } from './reducers/index.js';
import { connectToStore, getNamespace, getServerURL } from './socket/index.js';
import createUIListeners from './ui/index.js';
import {
	NEW_ROUND, TICK, SYNC, COUNTDOWN,
	GAME_OVER, FOUND_WORD, BLEW_UP,
} from './messages.js';

const store = createStore(
	combineReducers({ global, player })
);

const socket = io(`${getServerURL()}${getNamespace()}`);

connectToStore(socket, store, [
	NEW_ROUND, TICK, SYNC, COUNTDOWN,
	GAME_OVER, FOUND_WORD, BLEW_UP,
]);

createUIListeners(socket, store);

