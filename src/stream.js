var uuid = require('uuid')

var Game = {
  sessions: {},
  done: {}
}

var ALPHABET = 'qwertyuiopasdfghjklzxcvbnm'

function Handler (io) {
  io.on('connection', (socket) => {
    if (Game.started) {
      socket.emit('started', Game.startTime)
      socket.sessionId = Game.currentId
      Game.sessions[Game.currentId].push(socket)
    }

    socket.on('name', (data) => {
      socket.name = data
    })

    socket.on('start.game', () => {
      if (!Game.started) {
        return
      }
      Game.started = true
      Game.startTime = Date.now()
      Game.currentId = uuid.v1()
      Game.sessions[Game.currentId] = [socket]

      socket.sessionId = Game.currentId

      setTimeout(() => {
        var one = ALPHABET[~~(Math.random() * ALPHABET.length)]
        var two = ALPHABET[~~(Math.random() * ALPHABET.length)]
        socket.emit('data', [one,two])
        Gane.started = false
        Game.sessions[socket.sessionId].startTime = Date.now()
      }, 6000)
    })

    socket.on('word', function (data) {
    })
  })
}

module.exports = Handler