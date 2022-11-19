import Player from '../player/Player.js'
import slimeConfig from './slime.config.js'

export default class Slime extends Player {
  static config = slimeConfig
  constructor(config) {
    config.useConfig = Slime.config
    super(config)

    this.scene.input.on('pointermove')
  }

  update() {
    super.update()

    if (this.body.velocity.x > 0) {
      this.flipX = false
    }

    if (this.body.velocity.x < 0) {
      this.flipX = true
    }
  }
}
