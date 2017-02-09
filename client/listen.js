import attachSocket from './ui/index.js';
import io from 'socket.io';

const socket = io();

attachSocket(socket);
export default socket;
