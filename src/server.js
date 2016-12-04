const { Server } = require('hapi');
const Inert = require('inert');
const { route: validateWord } = require('./validWord.js');
const { publicFiles } = require('./public.js');

const server = new Server();
server.connection({
	port: 80
});

server.register(Inert).then(() => server.route(publicFiles));
server.route(validateWord);

var io = require('socket.io')(server.listener)
require('./stream')(io);

module.exports = { server };
