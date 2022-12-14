import io from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid'

class SocketConnection {
  constructor() {
    this.socket = io('http://127.0.0.1:8000', { autoConnect: false })
    this.connectionId = uuidv4()

    this.socket.auth = { connectionId: this.connectionId }
    this.socket.connectionId = this.connectionId
    console.log('connectionId: ' + this.connectionId)
  }

  getSocket() {
    return this.socket
  }

  connect() {
    this.socket.connect()

    // this.socket.on('connect', (data) => {
    //   this.socket.emit('getPlayer')
    // })

    // this.socket.on('updatePlayer', (data) => {
    //   const playerData = JSON.parse(data)
    //   //   console.log('player: ' + playerData.id + ' updated')
    // })
  }
}

const socketConnection = new SocketConnection()
socketConnection.connect()
const socket = socketConnection.getSocket()
socket.connectionId = socketConnection.connectionId

export default socket
