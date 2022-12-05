import Item from '../../item/Item'
import arrowConfig from './arrow.config'
import Phaser from 'phaser'

export default class Arrow extends Item {
  static config = arrowConfig
  constructor(config) {
    const useConfig = config.useConfig || Arrow.config
    super({ ...config, ...useConfig })

    this.damage = useConfig.damage

    // Get the direction vector of the mouse pointer
    this.mousePosition = { x: config.mouseX, y: config.mouseY }
    this.speed = useConfig.speed
    const { mouseX, mouseY } = config
    this.direction = new Phaser.Math.Vector2(mouseX - this.x, mouseY - this.y)

    // Set rotation to the direction of the mouse pointer
    this.rotation =
      Phaser.Math.Angle.Between(this.x, this.y, mouseX, mouseY) + Phaser.Math.DegToRad(90)

    // Kill the arrow after two seconds
    this.scene.time.addEvent({
      delay: 2000,
      callback: () => {
        this.events.emit('killArrow')
        this.destroy()
      },
    })

    this.addOnCollideOuterStart((data) => {
      if (!data.gameObjectB || !data.gameObjectA) return
      if (data.bodyB.isSensor) return
      if (data.gameObjectB.type == 'player') return
      if (data.gameObjectB.type == 'weapon') return

      if (data.gameObjectB.type == 'enemy') {
        data.gameObjectB.damage(this.damage)
      }

      this.events.emit('killArrow')
      this.destroy()
    })
    this.addOnCollideOuterEnd((data) => {})
  }

  update() {
    // Move the arrow in the direction of the mouse pointer
    this.direction.normalize()
    this.direction.scale(this.speed)

    // Move the arrow in the direction of the mouse pointer
    this.setVelocity(this.direction.x, this.direction.y)
  }
}
