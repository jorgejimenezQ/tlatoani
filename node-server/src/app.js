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
const connections = {}
const playerTypes = ['archer', 'knight', 'slime', 'player']

// io.use((socket, next) => {

io.on('connection', (socket) => {
  console.log('New client connected')
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

io.on('getPlayer', (connectionId) => {
  console.log(playerTypes)
  if (playerTypes.length > 0) {
    const player = playerTypes.pop()
    connections[connectionId] = {
      type: player,
    }

    io.emit('player', player)
  }
})

/********************************** */
/********************************** */

// Test the server
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`)
// })

httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
