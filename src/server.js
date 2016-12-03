const { Server } = require('hapi');
const Inert = require('inert');
const Socket = require('socket.io');

const { route: validateWord } = require('./validWord.js');
const { publicFiles } = require('./public.js');

const server = new Server();
server.connection({ port: 8000 });

const io = Socket(server.listener);

server.register(Inert).then(() => server.route(publicFiles));
server.route(validateWord);
var io = require('socket.io')(socket.listen)
require('./stream')(io)

module.exports = { server, io };
