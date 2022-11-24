import Player from '../player/Player'
import knightConfig from './knight.config'
import AnimeSword from '../weapons/AnimeSword/AnimeSword'

export default class Knight extends Player {
  static config = knightConfig
  constructor(config) {
    config.useConfig = Knight.config
    super(config)

    // disconnect event
    this.events.on('disconnect', () => {
      this.sword.destroy()
      this.sword = null
    })

    this.setSword(new AnimeSword({ scene: this.scene, x: this.x, y: this.y }))
  }

  setSword(sword) {
    this.sword = sword
    this.sword.setOwner(this.characterId)
    this.scene.add.existing(this.sword)
    this.sword.setDepth(1)
  }

  update() {
    super.update()

    this.sword.setFlipX(!this.flipX)
    this.sword.setPosition(this.x, this.y)
    this.sword.update()
  }
}
