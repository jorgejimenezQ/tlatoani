import express from 'express'
import cors from 'cors'
import Spawner from './spawner/Spawner.js'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
import sessionEvents from './session.js'
import Game from './Game.js'

const app = express()
// app.use(cors())

const PORT = process.env.PORT || 8000

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
})

const games = {}

/********************************** */
/** Socket Io Stuff */
const players = {}
const enemies = {}
let playerCount = 0
const spawner = new Spawner('enemy')

io.use((socket, next) => {
  const { connectionId } = socket.handshake.auth
  if (!connectionId) return next(new Error('invalid connectionId'))
  socket.connectionId = connectionId
  players[connectionId] = {}
  console.log('player connected: ' + connectionId)
  console.log(players)
  next()
})

io.on('connection', (socket) => {
  socket.on('createSession', (data) => {
    console.log('createSession', data)
    const game = new Game(data, socket)
  })
  /******************************
   *
   */
  socket.on('getOtherPlayers', (callback) => {
    // If there are other players, send them to the new player
    callback(players)
  })

  socket.on('playerSelect', (data) => {
    console.log('playerSelect: ' + JSON.stringify(data))
    players[data.connectionId].playerType = playerTypes[data.selectedPlayer]
    players[data.connectionId].selectedPlayerIndex = data.selectedPlayer

    playerCount++
    // If all the players have selected a character, let them start the game
    if (playerCount === playerTypes.length) {
      console.log(Object.keys(players).length + ' === ' + playerTypes.length)
      // Start the game
      io.emit('startGame')
    }

    data.selectedPlayerIndex = data.selectedPlayer
    // Let the other players know that a new player has been selected
    socket.broadcast.emit('otherPlayerSelected', data)
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('playerDisconnected', socket.connectionId)
    delete players[socket.connectionId]
    if (players.length === 0) {
      spawner = new Spawner('enemy')
    }
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
    if (data.enemy.health <= 0) {
      io.emit('destroyEnemy', data.connectionId)
      returnw
    }

    io.emit('updateEnemy', enemies[data.enemy.connectionId])
  })

  socket.on('enemyDeath', (data) => {
    if (!enemies[data.connectionId]) return

    // Broadcast to all players to remove this enemy
    io.emit('destroyEnemy', data.connectionId)

    // Remove the enemy from the list
    delete enemies[data.connectionId]
  })

  // socket.on('getPlayer', () => {
  //   socket.emit('players', players)

  //   // random player type
  //   const spawnPoint = Object.keys(players).length
  //   const player = playerTypes[Math.floor(Math.random() * playerTypes.length)]
  //   players[socket.connectionId] = {
  //     connectionId: socket.connectionId,
  //     type: player,
  //     spawnPoint: spawnPoint,
  //   }

  //   socket.emit('player', players[socket.connectionId])
  //   socket.broadcast.emit('playerAdded', players[socket.connectionId])
  // })
})

/********************************** */
/********************************** */
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
//
