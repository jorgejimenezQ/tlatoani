import PlayerInputHandler from '../../player/input/PlayerInputHandler'

export default class Archer extends PlayerInputHandler {
  constructor(input) {
    super(input)
  }

  handleMoveInput() {
    return super.handleMoveInput()
  }

  handlePointerInput() {
    super.handlePointerInput()
    if (this.input.activePointer.isDown) {
      const pointer = this.input.activePointer
      this.commandQueue.push(this.pointerDownCommand(pointer))
    }
  }
}
