import EventEmitter from 'events'

export default class EntitiesStorageService {
  player = ''
  events = null
  otherPlayers = []
  constructor() {
    console.log('EntitiesStorageService was constructed')
    this.events = new EventEmitter()
  }

  setPlayer(player) {
    this.player = player
    console.log('character was set to ' + player)
    this.events.emit('characterChanged', player)
  }

  getCharacter() {
    return this.player.toLowerCase()
  }

  addOtherPlayer(player) {
    this.otherPlayers.push(player)
  }

  removePlayer(player) {
    let removedPlayer = null
    this.otherPlayers = this.otherPlayers.filter((p) => {
      if (p.connectionId === player.connectionId) {
        removedPlayer = p
        return false
      }
      return true
    })

    return removedPlayer
  }

  getOtherPlayer(connectionId) {
    return this.otherPlayers.find((p) => p.connectionId === connectionId)
  }
}
