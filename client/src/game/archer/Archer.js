import Phaser from 'phaser'
import Player from '../player/Player'
import archerConfig from './archer.config'
import Bow from '../weapons/bow/Bow'
import Arrow from '../weapons/arrow/Arrow'
import StaticArrow from '../weapons/arrow/StaticArrow'

export default class Archer extends Player {
  static config = archerConfig

  currentWeapon = null
  carryArrow = null
  weaponInput = null

  constructor(config) {
    super({ ...config, useConfig: Archer.config })
    // Add a bow for the archer
    this.fireRate = Bow.config.fireRate
    this.prepareWeapon()

    this.arrowShot = false
    this.arrow = null
    this.shootingTimeHasPassed = true

    // disconnect event
    this.events.on(
      'disconnect',
      () => {
        this.currentWeapon.bow.destroy()
        this.carryArrow.destroy()
        this.currentWeapon = null
        this.disconnected = true
      },
      this
    )

    this.addOnCollideInnerStart((data) => {})

    this.addOnCollideInnerEnd((data) => {})

    this.addOnCollideOuterStart((data) => {})

    this.addOnCollideOuterEnd((data) => {})
  }

  update() {
    super.update()

    // update current weapons
    if (this.currentWeapon) {
      const { bow } = this.currentWeapon
      const { x, y } = Bow.config.offset
      bow.setPosition(this.x + x, this.y + y)
      bow.update()

      // Update the arrow the player carries
      if (this.carryArrow) {
        this.carryArrow.setPosition(this.currentWeapon.bow.x, this.currentWeapon.bow.y)
        // Set the rotation of the arrow to the direction of the mouse pointer
        this.carryArrow.rotation = this.currentWeapon.bow.rotation + Phaser.Math.DegToRad(90)
      }
    }

    if (this.arrow) {
      this.arrow.update()
    }
  }

  // Get the player a weapon
  prepareWeapon() {
    // Add a bow for the archer
    this.currentWeapon = {}
    this.currentWeapon.bow = new Bow({
      scene: this.scene,
      x: this.x,
      y: this.y,
      texture: Bow.config.texture,
      frame: Bow.config.frame,
    })

    // This arrow will not be used to shoot. It is just a placeholder.
    this.carryArrow = new StaticArrow({
      scene: this.scene,
      x: this.x,
      y: this.y,
      texture: Arrow.config.texture,
      frame: Arrow.config.frame,
    })
  }
}
