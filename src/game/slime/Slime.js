import Player from '../player/Player.js'
import slimeConfig from './slime.config.js'

export default class Slime extends Player {
  static config = slimeConfig
  constructor(config) {
    config.useConfig = Slime.config
    super(config)

    this.scene.input.on('pointermove', (pointer) => {
      if (this.dead) return
      this.setFlipX(pointer.worldX > this.x)
    })
  }
}
