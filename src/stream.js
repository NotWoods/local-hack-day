var uuid = require('uuid')
const generateString = require('./generateString.js');

var ALPHABET = 'qwertyuiopasdfghjklzxcvbnm'
var VOWELS = 'aeiouy'
var started = false
var startTime = 0
var lobby = []
var sessions = {}



function startGame () {
  startTime = Date.now()
  var interval = setInterval(() => {
    var now = Date.now()
    lobby.forEach((socket) => {
      socket.emit('game.countdown', 60000 - (now - startTime))
    }, 1000)
  }, 1000)
  setTimeout(() => {
    started = false
    clearInterval(interval)
    startBomb()
  }, 60000)
}

function startBomb (again, sess) {
  if (!again){
    var id = uuid.v1()
    var startTime = Date.now()
    var newText = generateString();
    var sess = sessions[id] = lobby.map((socket) => {
      socket.gameId = id
      socket.emit('game.text', newText);
      return socket
    })
    lobby = []

    sess.inGame = true
    sess.newText = newText;
    var selected = sess[~~(Math.random() * sess.length)]
    console.log(selected)
    if(selected){
      selected.emit('bomb.you')
      selected.turn = true
    }
  } else {
    var startTime = Date.now()
    var newText = generateString();
    sess.forEach((socket) => {
      socket.emit('game.text', newText);
      return socket
    })
  }

  var interval = setInterval(function () {
    var now = Date.now()
    sess.forEach((socket) => {
      socket.emit('bomb.sync', 30000 - (now - startTime))
    })
  }, 1000)
  setTimeout(function () {
    clearInterval(interval)
    endBomb(sess)
  }, 30000)
}

function endBomb (sess) {
  sess.inGame = false
  sess.forEach((socket) => {
    if (socket.turn) {
      socket.emit('LOSER')
      socket.emit('bomb.new')
    }
  })
  startBomb(true, sess)
}

function Handler (io) {
  io.on('connection', (socket) => {
    if (started) {
      lobby.push(socket)
    } else {
      started = true
      startGame()
      lobby.push(socket)
    }
    socket.on('bomb.pass', function () {
      if (!socket.turn) return
      socket.emit('bomb.passed')
      socket.turn = false
      socket.done = true
      var select = sessions[socket.gameId].filter((socket) => (!socket.done))

      if (!select.length) {
        select = sessions[socket.gameId].map((socket) => {
          socket.done = false
          return socket
        })
      }
      console.log(select.length)
      var selected = select[~~(Math.random() * select.length)]
      console.log(selected)
      selected.emit('bomb.you')
      selected.turn = true

    })
  })
}

module.exports = Handler