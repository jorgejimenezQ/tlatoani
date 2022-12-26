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

io.use((socket, next) => {
  const admin = socket.handshake.auth.admin
  if (admin) {
    socket.join('admin')
    return next()
  }

  const { connectionId } = socket.handshake.auth
  if (!connectionId) return next(new Error('invalid connectionId'))
  socket.connectionId = connectionId
  next()
})

io.on('connection', (socket) => {
  // TODO: add an admin room to see all the games and players in the server
  // and to be able to start and end any game from the admin room
  socket.on('joinSession', (username, playerLimit, callback) => {
    let game = findGame()
    var x = 'before if'

    // Look for a game that is not full
    if (game) {
      // Add the player to the game
      game.addPlayer(socket.connectionId, username)
      socket.gameSessionId = game.gameSessionId

      // Have the socket join the room
      socket.join(game.gameSessionId)

      callback({
        session: game.gameSessionId,
        isHost: false,
      })

      return
    }

    // If game is null then create a new game
    const session = uuidv4()
    socket.gameSessionId = session

    // Create a new game and add it to the games object
    game = new Game(session, socket, playerLimit)
    games[session] = game

    // Add the player to the game
    game.addPlayer(socket.connectionId, username)
    socket.gameSessionId = session

    // Have the socket join the room
    socket.join(game.gameSessionId)

    callback({
      session,
      isHost: true,
    })
  })

  socket.on('getOtherPlayers', (gameSessionId, callback) => {
    // If there are other players, send them to the new player
    const players = games[gameSessionId].players
    callback(players)
  })

  socket.on('playerSelect', (data) => {
    const game = games[data.gameSessionId]

    game.players[data.connectionId].playerType = data.playerType
    game.players[data.connectionId].selectedPlayerIndex = data.selectedPlayer

    // If all the players have selected a character, let them start the game
    if (game.allPlayersSelected()) {
      // Start the game
      // io.emit('startGame')
      io.to(game.gameSessionId).emit('startGame')
    }
    data.selectedPlayerIndex = data.selectedPlayer
    data.username = game.players[data.connectionId].username
    // data.playerType = game.players[data.connectionId].playerType
    // Let the other players in the room know that a new player has been selected
    socket.to(game.gameSessionId).emit('otherPlayerSelected', data)
  })

  socket.on('disconnect', () => {
    // socket.broadcast.emit('playerDisconnected', socket.connectionId)
    io.to(socket.gameSessionId).emit('playerDisconnected', socket.connectionId)

    const game = games[socket.gameSessionId]
    if (!game) return

    game.removePlayer(socket.connectionId)

    if (game.numPlayers == 0) {
      delete games[socket.gameSessionId]
      // spawner = new Spawner('enemy')
    }
  })

  socket.on('playerData', (data) => {
    // const playerData = JSON.parse(data)
    socket.to(socket.gameSessionId).emit('updatePlayer', data)
    // socket.broadcast.emit('updatePlayer', data)
  })

  // When the enemy spawner is triggered, add an enemy to the enemy list
  socket.on('spawnerTrigger', (data) => {
    // Let the rest of the room know that the spawner has been triggered
    socket.to(socket.gameSessionId).emit('spawnerTriggered', data.triggerId)

    // Create an enemy
    const game = games[socket.gameSessionId]

    // Activate the spawner
    game.spawner.activate(() => {
      data.connectionId = game.spawnEnemy(data.triggerId)
      io.to(socket.gameSessionId).emit('enemySpawned', data)
    })

    // Spawn one enemy to start
    data.connectionId = game.spawnEnemy(data.triggerId)
    game.spawner.quantity++
    io.to(socket.gameSessionId).emit('enemySpawned', data)
  })

  socket.on('enemyData', (data) => {
    const enemies = games[socket.gameSessionId].enemies
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
      io.to(socket.gameSessionId).emit('destroyEnemy', data.connectionId)
      io.emit('destroyEnemy', data.connectionId)
      return
    }

    io.to(socket.gameSessionId).emit('updateEnemy', enemies[data.enemy.connectionId])
    // io.emit('updateEnemy', enemies[data.enemy.connectionId])
  })

  socket.on('enemyDeath', (data) => {
    const enemies = games[socket.gameSessionId].enemies
    if (!enemies[data.connectionId]) return

    // Broadcast to all players to remove this enemy
    io.to(socket.gameSessionId).emit('destroyEnemy', data.connectionId)
    // io.emit('destroyEnemy', data.connectionId)

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

// Returns the first game that is not full
const findGame = () => {
  for (const game in games) {
    if (!games[game].gameFull()) {
      return games[game]
    }
  }
  return null
}

/********************************** */
/********************************** */
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
//
