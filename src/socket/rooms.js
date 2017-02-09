import { createStore, combineReducers } from 'redux';
import { PLAYER_ENTERED } from '../messages.js';

export const rooms = new Map(); // Map<id, Redux.Store>
function newStore() {
	return createStore(combineReducers({ global, spectator }));
}

export function openRoom(_id) {
	const id = _id.toUpperCase();
	if (rooms.has(id)) return rooms.get(id);

	const store = newStore();
	const nsp = io.of(`/${id}`);

	nsp.on('connection', (socket) => {
		socket.join(id);
		store.dispatch({ type: PLAYER_ENTERED, payload: { id: socket.id } });
	});
}
