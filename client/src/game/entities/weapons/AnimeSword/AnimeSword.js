import Item from '../../item/Item'
import animeSwordConfig from './animeSword.config'
import Phaser from 'phaser'

export default class AnimeSword extends Item {
  static config = animeSwordConfig
  constructor(config) {
    const useConfig = config.useConfig || AnimeSword.config
    super({ ...config, ...useConfig })

    this.damage = useConfig.damage
    this.initialRotation = useConfig.rotation
    this.rotationSpeed = useConfig.rotationSpeed
    this.ownerId = null
    this.swinging = false
    this.swingingRotation = Phaser.Math.DegToRad(useConfig.rotation)
    this.currentTarget = null
    this.events.on('swingComplete', () => {
      if (this.currentTarget && !this.currentTarget.isDead) {
        this.currentTarget.damage(this.damage)
      }
    })
  }

  setOwner(ownerId) {
    this.ownerId = ownerId
  }

  update() {
    if (this.currentTarget && this.currentTarget.isDead) this.currentTarget = null
    if (this.swinging) {
      this.swingingRotation += this.rotationSpeed
    } else {
      this.swingingRotation = Phaser.Math.DegToRad(this.initialRotation)
    }

    if (this.swingingRotation >= 100) {
      this.swinging = false
      this.swingingRotation = Phaser.Math.DegToRad(this.initialRotation)
      this.events.emit('swingComplete')
    }

    if (this.flipX) {
      this.rotation = -this.swingingRotation
    } else {
      this.rotation = this.swingingRotation
    }
  }

  setSwing(swinging) {
    this.swinging = swinging
  }
}
