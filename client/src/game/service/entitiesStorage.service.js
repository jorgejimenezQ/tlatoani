import EventEmitter from 'events'

class EntitiesStorageService {
  character = ''
  events = null
  constructor() {
    console.log('EntitiesStorageService was constructed')
    this.events = new EventEmitter()
  }

  setCharacter(character) {
    this.character = character
    console.log('character was set to ' + character)
    this.events.emit('characterChanged', character)
  }

  getCharacter() {
    return this.character.toLowerCase()
  }
}

const entitiesService = new EntitiesStorageService()
export default entitiesService
