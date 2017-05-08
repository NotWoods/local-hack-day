import { io } from './server';
import Room from './Room';

interface EnterRoomData {
	roomID: string
	name?: string
}

const MAX_ROUNDS = 3;

const rooms = new Map<string, Room>();
function getRoom(id: string): Room {
	return rooms.get(id) || new Room(io, id, MAX_ROUNDS);
}

io.on('connection', client => {
	console.log(`Player connected`);

	client.on('enterRoom', (player: EnterRoomData) => {
		const room = getRoom(player.roomID);
		client.join(player.roomID);
		room.addPlayer(client);
	});

	client.on('leaveRoom', (player: EnterRoomData) => {
		const { roomID } = player;
		client.leave(roomID);

		const room = rooms.get(roomID);
		if (!room) return;

		const roomEmpty = room.removePlayer(client);
		if (roomEmpty) {
			room.destroy();
			rooms.delete(roomID);
		}
	});
})
