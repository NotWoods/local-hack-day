import { createStore, combineReducers, applyMiddleware } from 'redux';
import { global, spectator, ServerState } from './reducers/';
import { newSocketMiddleware } from './socket/';
import { BLEW_UP, NEW_ROUND, FOUND_WORD, TICK, COUNTDOWN, GAME_OVER } from './messages';

const io: SocketIO.Server = null as any;

const reducer = combineReducers<ServerState>({ global, spectator });

const middleware = newSocketMiddleware(io,
	BLEW_UP, NEW_ROUND, FOUND_WORD, TICK, COUNTDOWN, GAME_OVER);

const store = createStore(reducer, applyMiddleware(middleware));


