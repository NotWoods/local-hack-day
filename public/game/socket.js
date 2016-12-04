var socket = io()
const TOTAL_TIME = 3000;
socket.on('game.countdown', (data) => {
  console.log(data)
})
socket.on('bomb.sync', (data) => {
  console.log('BOMB AT: ' + Math.floor((TOTAL_TIME - time) / TOTAL_TIME))
})
socket.on('bomb.you', () => {
  console.log('Your Turn')
})
socket.on('LOSER', () => {
  console.log('You Lost')
})