import Item from '../../item/Item'
import bowConfig from './bow.config'
import Phaser from 'phaser'

export default class Bow extends Item {
  static config = bowConfig

  constructor(config) {
    super({ ...config, ...Bow.config })
  }

  update() {
    this.rotation = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      this.scene.input.activePointer.worldX,
      this.scene.input.activePointer.worldY
    )
  }
}
