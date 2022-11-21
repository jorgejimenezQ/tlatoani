import InputHandler from '../../input/InputHandler'
import Phaser from 'phaser'

export default class PlayerInputHandler extends InputHandler {
  constructor(input) {
    super(input)

    this.moveCommand = null
  }

  handleMoveInput() {
    let velocity = new Phaser.Math.Vector2(0, 0)
    if (this.keys.up.isDown) velocity.y = -1
    else if (this.keys.down.isDown) velocity.y = 1

    if (this.keys.left.isDown) velocity.x = -1
    else if (this.keys.right.isDown) velocity.x = 1

    // if (velocity.x === 0 && velocity.y === 0) return
    this.commandQueue.push(this.moveCommand(velocity))
  }

  setMoveCommand(command) {
    if (!command) throw new Error('The command passed in cannot be null')
    this.moveCommand = command
  }
}
