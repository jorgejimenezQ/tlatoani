import PlayerInputHandler from '../../player/input/PlayerInputHandler'

export default class KnightInputHandler extends PlayerInputHandler {
  constructor(input) {
    super(input)
  }

  handleMoveInput() {
    super.handleMoveInput()
  }

  handlePointerInput() {
    super.handlePointerInput()
    if (this.input.activePointer.isDown) {
      this.commandQueue.push(this.pointerDownCommand())
    }
  }
}
