const { Server } = require('hapi');
const Inert = require('inert');
const { route: validateWord } = require('./validWord.js');
const { publicFiles } = require('./public.js');

const server = new Server();
const port = parseInt(process.argv[2], 10);
server.connection({
	port: Number.isNaN(port) ? 8080 : port,
});

server.register(Inert).then(() => server.route(publicFiles));
server.route(validateWord);

var io = require('socket.io')(server.listener)
require('./stream')(io);

module.exports = { server };
