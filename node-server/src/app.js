import express from 'express'
import cors from 'cors'
import Spawner from './spawner/Spawner.js'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'

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
const enemies = {}
const spawner = new Spawner('enemy')

// let playerTypes = ['archer', 'knight', 'slime']
let playerTypes = ['archer', 'knight']
// let playerTypes = ['archer']
// let playerTypes = ['knight']

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
    if (players.length === 0) {
      console.log('No more players, deactivating spawner')
      spawner = new Spawner('enemy')
    }
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
    socket.broadcast.emit('updatePlayer', data)
  })

  // When the enemy spawner is triggered, add an enemy to the enemy list
  socket.on('spawnerTrigger', (data) => {
    socket.broadcast.emit('spawnerTriggered', data.triggerId)
    // Create an enemy
    spawner.activate(() => {
      const connId = uuidv4()
      enemies[connId] = {
        triggerId: data.triggerId,
      }
      data.connectionId = connId
      io.emit('enemySpawned', data)
    })

    const connId = uuidv4()
    enemies[connId] = {
      triggerId: data.triggerId,
    }
    data.connectionId = connId
    spawner.quantity++
    io.emit('enemySpawned', data)
  })

  socket.on('enemyData', (data) => {
    enemies[data.enemy.connectionId] = data
    let target = null
    if (!data.enemy.currentTarget && data.targets.length > 0) {
      console.log(enemies)
      const targets = data.targets.map((target) => {
        // Calculate the distance between the enemy and the target
        const distance = Math.sqrt(
          Math.pow(target.position.x - data.enemy.x, 2) +
            Math.pow(target.position.y - data.enemy.y, 2)
        )
        return {
          ...target,
          distance: distance,
        }
      })

      // Sort the targets by distance
      targets.sort((a, b) => {
        return a.distance - b.distance
      })

      // Get the closest target
      const target = targets[0]
      const direction = { x: target.x - data.enemy.x, y: target.y - data.enemy.y }

      // Record the closest target
      enemies[data.enemy.connectionId].currentTarget = target
    }
    // TODO: Update health
    // If velocity is to the left, flipX = true
    const velocity = data.enemy.velocity.x
    if (velocity < 0) enemies[data.enemy.connectionId].flipX = true
    else enemies[data.enemy.connectionId].flipX = false

    io.emit('updateEnemy', enemies[data.enemy.connectionId])
  })
})

/********************************** */
/********************************** */
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
//
