var uuid = require('uuid')
const generateString = require('./generateString.js');
const MaxRounds = 2
var started = false
var startTime = 0
var lobby = []
var sessions = {}



function startGame (startDuration = 60000) {
  startTime = Date.now()

  function finishStartGame() {
    started = false
    clearInterval(interval)
    clearInterval(finishInterval)
    startBomb();
  }

  var interval = setInterval(() => {
    var now = Date.now()
    lobby.forEach((socket) =>
      socket.emit('game.countdown', startDuration - (now - startTime)),
    1000)
  }, 1000)

  var finishInterval = setTimeout(finishStartGame, startDuration)
  return finishStartGame;
}

function startBomb (again, sess) {
  if (!again){
    var id = uuid.v1()
    var startTime = Date.now()
    var newText = generateString();
    var sess = sessions[id] = lobby.map((socket) => {
      socket.gameId = id
      socket.emit('bomb.new', 0 )
      socket.emit('game.text', newText);
      return socket
    })
    lobby = []

    sess.inGame = true
    sess.rounds = 0
    sess.newText = newText;
    var selected = sess[~~(Math.random() * sess.length)]
    //console.log(selected)
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
  sess.round += 1
  sess.inGame = false
  sess.forEach((socket) => {
    if (socket.turn) {
      socket.blewUp = (socket.blewUp || 0) + 1
      socket.emit('LOSER')
    }
    socket.emit('bomb.new', sess.rounds)
  })
  if (sess.rounds >= MaxRounds) {
    sess.forEach((socket) => {
      socket.emit('game.end', socket.blewUp || 0)
    })
  } else {
    setTimeout(function () {
      startBomb(true, sess)
    }, 10000)
  }
}

function Handler (io) {
  io.on('connection', (socket) => {
    if (started) {
      lobby.push(socket)
    } else {
      started = true
      startGame(1000)
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
      //console.log(select.length)
      var selected = select[~~(Math.random() * select.length)]
      //console.log(selected)
      selected.emit('bomb.you')
      selected.turn = true
    })
  })
}

Handler.sessions = sessions

module.exports = Handler