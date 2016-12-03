const { Server } = require('hapi');
const Inert = require('inert');
const { route: validateWord } = require('./validWord.js');
const { publicFiles } = require('./public.js');

const server = new Server();
server.connection({ port: 8000 });

server.register(Inert).then(() => server.route(publicFiles));
<<<<<<< HEAD
server.route(validateWord);

var io = require('socket.io')(server.listener)
require('./stream')(io);
=======
server.route(validateWord)
var io = require('socket.io')(server.listener)
require('./stream')(io)
>>>>>>> 834f1ce7f079c85610d9995bfb5fa587f8f045db

module.exports = { server };
