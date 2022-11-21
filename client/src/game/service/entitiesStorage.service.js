import EventEmitter from 'events'

class EntitiesStorageService {
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

  removeOtherPlayer(player) {
    this.otherPlayers = this.otherPlayers.filter((p) => p.characterId !== player.characterId)
  }
}

const entitiesService = new EntitiesStorageService()
export default entitiesService
