import Character from '../gameCharacters/Character'
import playerConfig from './player.config'

export default class Player extends Character {
  // Static property that holds the player base config
  static config = playerConfig

  constructor(config) {
    config.health = 100
    super({ ...config })
  }

  update() {
    super.update()
  }
}
