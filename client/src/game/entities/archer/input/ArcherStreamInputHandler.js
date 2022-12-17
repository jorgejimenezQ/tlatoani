import StreamInputHandler from '../../../input/StreamInputHandler'

export default class ArcherStreamInputHandler extends StreamInputHandler {
  static constants = {
    ...StreamInputHandler.constants,
    ROTATE_WEAPON_INPUT: 'ROTATE_WEAPON_INPUT',
  }

  constructor() {
    super()

    this.keyMaps = {
      ...this.keyMaps,
      ROTATE_WEAPON_INPUT: this.setRotateWeaponCommand.bind(this),
    }

    this.arrowShot = false
    this.arrow = null
    this.weaponRotation = null
  }

  handleAttack() {
    if (this.arrowShot && this.arrow)
      this.commandQueue.push(this.attackCommand({ worldX: this.arrow.x, worldY: this.arrow.y }))
  }

  handleRotateWeapon() {
    if (this.weaponRotation) {
      this.commandQueue.push(this.rotateWeaponCommand(this.weaponRotation))
    }
  }

  setRotateWeaponCommand(command) {
    this.rotateWeaponCommand = command
  }
}
