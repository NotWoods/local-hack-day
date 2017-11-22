import io from 'socket.io-client';
import { connectSocketToStore } from './socket/';
import initStore from './ui/game-init';
import {
	NEW_ROUND, TICK, SYNC, COUNTDOWN, PASS_BOMB, GAME_OVER,
	FOUND_WORD, PLAYER_ENTERED, PLAYER_LEFT, BLEW_UP, SET_ROOM_ID
} from './messages';

const SERVER = 'http://localhost';

const socket = io(SERVER + window.location.search);
const store = initStore();
connectSocketToStore(socket, store,
	NEW_ROUND, TICK, SYNC, COUNTDOWN, PASS_BOMB, GAME_OVER,
	FOUND_WORD, PLAYER_ENTERED, PLAYER_LEFT, BLEW_UP, SET_ROOM_ID
);
