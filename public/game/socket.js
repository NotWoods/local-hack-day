var socket = io()

socket.on('game.countdown', (data) => {
  console.log(data)
})
socket.on('bomb.sync', (data) => {
  console.log('BOMB AT: ' + Math.floor(time))
})
socket.on('bomb.you', () => {
  console.log('Your Turn')
})
socket.on('LOSER', () => {
  console.log('You Lost')
})