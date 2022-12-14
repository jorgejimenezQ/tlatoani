import PlayerInputHandler from '../../player/input/PlayerInputHandler'

export default class Archer extends PlayerInputHandler {
  // static config = {
  //   ...PlayerInputHandler.constants,
  //   POINTER_INPUT: 'POINTER_INPUT',
  // }

  constructor(input) {
    super(input)
  }

  handleMoveInput() {
    super.handleMoveInput()
  }

  handlePointerInput() {
    // super.handlePointerInput()
    if (this.input.activePointer.isDown) {
      const pointer = this.input.activePointer
      this.commandQueue.push(this.pointerDownCommand(pointer))
    }
  }
}
