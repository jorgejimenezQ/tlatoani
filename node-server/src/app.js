import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()
// app.use(cors())

const PORT = process.env.PORT || 8000

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
})

/********************************** */
/** Socket Io Stuff */
const players = {}
// let playerTypes = ['archer', 'knight', 'slime']
let playerTypes = ['archer', 'knight']
// let playerTypes = ['archer']

io.use((socket, next) => {
  const { connectionId } = socket.handshake.auth
  if (!connectionId) return next(new Error('invalid connectionId'))
  socket.connectionId = connectionId
  players[connectionId] = {}
  next()
})

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    socket.broadcast.emit('playerDisconnected', socket.connectionId)
    delete players[socket.connectionId]
  })

  socket.on('getPlayer', () => {
    socket.emit('players', players)
    // random player type
    const spawnPoint = Object.keys(players).length
    const player = playerTypes[Math.floor(Math.random() * playerTypes.length)]
    players[socket.connectionId] = {
      connectionId: socket.connectionId,
      type: player,
      spawnPoint: spawnPoint,
    }

    socket.emit('player', players[socket.connectionId])
    socket.broadcast.emit('playerAdded', players[socket.connectionId])
  })

  socket.on('playerData', (data) => {
    const playerData = JSON.parse(data)
    // console.log(playerData)
    socket.broadcast.emit('updatePlayer', data)
  })
})

/********************************** */
/********************************** */
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
