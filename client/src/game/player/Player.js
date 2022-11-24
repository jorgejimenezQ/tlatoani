import Character from '../gameCharacter/Character'
import playerConfig from './player.config'
import Phaser from 'phaser'

export default class Player extends Character {
  // Static property that holds the player base config
  static config = playerConfig

  constructor(config) {
    const useConfig = config.useConfig || Player.config
    if (config.useConfig) delete config.useConfig

    super({ ...config, ...useConfig })
  }

  update() {
    super.update()
  }
}
