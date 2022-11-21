import io from 'socket.io-client'
import entitiesService from '../service/entitiesStorage.service'
import EventEmitter from 'events'
import { v4 as uuidv4 } from 'uuid'

const socket = io('http://127.0.0.1:8000')
const connectionId = uuidv4()
const connectionEvents = new EventEmitter()

socket.connectionId = connectionId
socket.on('connect', (data) => {
  console.log('Connected to server')
  entitiesService.events.emit('connected', connectionId)
})

socket.on('count', (data) => {
  console.log('The server responded with ' + data)
})

socket.on('player', (data) => {
  console.log('The ' + data + ' was chosen')
  entitiesService.setPlayer(data)
})

socket.on('playerAdded', (data) => {
  console.log('The ' + data + ' was added')
})

socket.on('updatePlayer', (data) => {
  const playerData = JSON.parse(data)
  //   console.log('player: ' + playerData.id + ' updated')
})

export default socket

//q: How to npm install for dev?
//a: npm install --save-dev
