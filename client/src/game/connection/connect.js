import io from 'socket.io-client'
import entitiesService from '../service/entitiesStorage.service'

const socket = io('http://127.0.0.1:5000')
const connectionId = socket.id

socket.on('connect', (data) => {
  const jsonData = JSON.stringify(data)
  console.log('Connected to server', jsonData)
})

socket.on('count', (data) => {
  console.log('The server responded with ' + data)
})

socket.on('player', (data) => {
  console.log('The ' + data + ' was chosen')
  entitiesService.setCharacter(data)
})

socket.on('playerAdded', (data) => {
  console.log('The ' + data + ' was added')
})

socket.on('updatePlayer', (data) => {
  const playerData = JSON.parse(data)
  //   console.log('player: ' + playerData.id + ' updated')
})

console.log(socket)
export default socket
