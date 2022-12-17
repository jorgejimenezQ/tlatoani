import EventEmitter from 'events'

export default class EntitiesStorageService {
  /**
   * The list of enemies in the game.
   */
  enemies = []

  /**
   * The list of all the other players. This is an array of objects with the
   * following structure:
   * {
   *  player: <Player>,
   * inputHandler: <StreamInputHandler>
   * }
   * @type {Array}
   */
  otherPlayers = []

  constructor() {
    console.log('EntitiesStorageService was constructed')
    // this.events = new EventEmitter()
  }

  // setPlayer(player) {
  //   this.player = player
  //   console.log('character was set to ' + player)
  //   this.events.emit('characterChanged', player)
  // }

  /**
   * Adds a new player to the list of other players.
   * @param {Player} player
   * @param {StreamInputHandler} inputHandler
   */
  addOtherPlayer(player, inputHandler) {
    if (!player) throw new Error('Player is required')
    if (!inputHandler) throw new Error('Input handler is required')
    this.otherPlayers.push({ player: player, inputHandler: inputHandler })
  }

  /**
   * Removes a player from the list of other players.
   * @param {Player} player
   * @returns {Player} The removed player
   */
  removePlayer(player) {
    let removedPlayer = null
    this.otherPlayers = this.otherPlayers.filter((p) => {
      const { connectionId } = p
      if (connectionId === player.connectionId) {
        removedPlayer = p.player
        return false
      }
      return true
    })

    return removedPlayer
  }

  getOtherPlayer(connectionId) {
    return this.otherPlayers.find((p) => p.player.connectionId === connectionId)
  }

  /** Adds a new enemy to the list of enemies. */
  addEnemy({ enemy, inputHandler }) {
    if (!enemy) throw new Error('Enemy is required')

    this.enemies.push({ enemy: enemy, inputHandler: inputHandler })
  }

  /** Removes an enemy from the list of enemies. */
  removeEnemy(enemyId) {
    let removedEnemy = null
    this.enemies = this.enemies.filter((e) => {
      const { characterId } = e.enemy
      if (characterId === enemyId) {
        removedEnemy = e.enemy
        return false
      }
      return true
    })

    return removedEnemy
  }

  getEnemy(enemyId) {
    return this.enemies.find((e) => e.enemy.connectionId === enemyId)
  }
}
