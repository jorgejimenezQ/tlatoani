import Spawner from './spawner/Spawner.js'
import { v4 as uuidv4 } from 'uuid'

export default class Game {
  players = {}
  // playerTypes = ['archer', 'knight', 'slime']
  playerTypes = ['archer', 'knight']
  playerLimit = 0
  // playerTypes = ['archer']
  numPlayers = 0
  socket = null
  enemies = {}

  // playerTypes = ['archer', 'knight', 'slime']
  // playerTypes = ['archer']
  // playerTypes = ['knight']
  spawner = null
  session

  /**
   * The Game class is responsible for managing the players and enemies for a game session.
   *
   * @param {string} gameSessionId The id of the game session
   * @param {Socket} socket The socket object for the game session
   * @param {number} playerLimit The maximum number of players allowed in the game
   *
   */
  constructor(gameSessionId, socket, playerLimit) {
    this.gameSessionId = gameSessionId
    this.socket = socket
    this.playerLimit = playerLimit
    this.spawner = new Spawner('enemy')
  }

  addPlayer(playerConnectionId, playerUsername) {
    // if (!playerUsername) return false
    // this.players.push(player)
    if (this.numPlayers >= this.playerLimit) return false
    this.players[playerConnectionId] = {
      // playerType: this.playerTypes[this.numPlayers],
      username: playerUsername,
    }
    this.numPlayers++
  }

  removePlayer(playerConnectionId) {
    delete this.players[playerConnectionId]
    this.numPlayers--
  }

  gameFull() {
    return this.numPlayers >= this.playerLimit
  }

  allPlayersSelected() {
    const keys = Object.keys(this.players)
    if (this.playerLimit == 1) return true // If the game is single player, we can start the game

    // If the limit is more than 1, but there is only 1 player, we can't start the game
    if (this.playerLimit > 1 && this.numPlayers == 1) return false

    // Check if all players have selected a character
    for (let i = 0; i < keys.length; i++) {
      if (this.players[keys[i]].playerType === undefined) return false
    }

    return true // All players have selected a character
  }

  toJSON() {
    return {
      session: this.session,
      players: this.players,
    }
  }

  spawnEnemy(triggerId) {
    const connId = uuidv4()
    this.enemies[connId] = { triggerId: triggerId }

    return connId
  }

  // Overwrite the
}
