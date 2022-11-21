import Phaser from 'phaser'

export default class InputHandler {
  // Create a queue of commands to be executed
  commandQueue = []

  // All the input handlers
  InputHandlers = []

  constructor(input) {
    this.input = input

    this.keys = input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    })

    this.downKeyCommand = () => {
      return {
        execute: () => {
          console.log('down key pressed')
        },
      }
    }
    this.upKeyCommand = () => {
      return {
        execute: () => {
          console.log('up key pressed')
        },
      }
    }
    this.leftKeyCommand = () => {
      return {
        execute: () => {
          console.log('left key pressed')
        },
      }
    }
    this.rightKeyCommand = () => {
      return {
        execute: () => {
          console.log('right')
        },
      }
    }

    //TODO: Figure out how to make this work
    this.pointerDownCommand = () => {
      console.log('pointer down')
      return {
        execute: () => {
          console.log('pointer down')
        },
      }
    }
  }

  /**
   *
   */
  handleMoveInput() {
    if (this.keys.up.isDown) this.commandQueue.push(this.upKeyCommand)
    if (this.keys.down.isDown) this.commandQueue.push(this.downKeyCommand)
    if (this.keys.left.isDown) this.commandQueue.push(this.leftKeyCommand)
    if (this.keys.right.isDown) this.commandQueue.push(this.rightKeyCommand)
  }

  handlePointerInput() {
    if (this.input.activePointer.isDown) this.commandQueue.push(this.pointerDownCommand)
  }

  getCommandQueue() {
    let queue = []
    if (this.commandQueue.length > 0) {
      queue = this.commandQueue
      this.clearCommandQueue()
    }

    return queue
  }

  clearCommandQueue() {
    this.commandQueue = []
  }

  /** Set the command to be execute when the mouse pointer is down */
  setCommand(command) {}

  setPointerDownCommand(command) {
    if (!command) throw new Error('The command passed in cannot be null')
    this.pointerDownCommand = command
  }

  /** Set the command to be executed when the up key is pressed */
  setUpKeyCommand(command) {
    if (!command) throw new Error('The command passed in cannot be null')
    this.upKeyCommand = command
  }

  /** Set the command to be executed when the down key is pressed */
  setDownKeyCommand(command) {
    if (!command) throw new Error('The command passed in cannot be null')
    this.downKeyCommand = command
  }

  /** Set the command to be executed when the left key is pressed */
  setLeftKeyCommand(command) {
    if (!command) throw new Error('The command passed in cannot be null')
    this.leftKeyCommand = command
  }

  /** Set the command to be executed when the right key is pressed */
  setRightKeyCommand(command) {
    if (!command) throw new Error('The command passed in cannot be null')
    this.rightKeyCommand = command
  }

  /** Change the input keys */
  setUpKey(key) {
    this.keys.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[key.toUpperCase()])
  }

  setDownKey(key) {
    this.keys.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[key.toUpperCase()])
  }

  setLeftKey(key) {
    this.keys.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[key.toUpperCase()])
  }

  setRightKey(key) {
    this.keys.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[key.toUpperCase()])
  }
}