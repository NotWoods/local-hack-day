var socket = io()

socket.on('game.countdown', (data) => {
  console.log(~~(data/1000))
})
socket.on('bomb.sync', (data) => {
  console.log('BOMB AT: ' + ~~(data/1000))
})
socket.on('bomb.you', () => {
  console.log('Your Turn')
})
socket.on('LOSER', () => {
  console.log('You Lost')
})