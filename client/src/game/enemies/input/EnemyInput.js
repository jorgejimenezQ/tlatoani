export default class EnemyInputHandler {
  static constants = {
    MOVE_INPUT: 'MOVE_INPUT',
    ATTACK_INPUT: 'ATTACK_INPUT',
    FLIP_X: 'FLIP_X',
  }
  commandQueue = []

  constructor() {
    this.keyMaps = {
      MOVE_INPUT: this.setMoveCommand.bind(this),
      ATTACK_INPUT: this.setAttackCommand.bind(this),
      FLIP_X: this.setFlipXCommand.bind(this),
    }

    this.moveCommand = null
    this.attackCommand = null
    this.flipXCommand = null
    this.target = null
  }

  // handle move input
  handleMoveInput(target) {
    if (!this.moveCommand) throw new Error('The move command cannot be null')
    if (!target) return

    this.commandQueue.push(this.moveCommand(target))
  }

  // handle attack input
  handleAttackInput() {}

  // Set Commands
  setMoveCommand(command) {
    if (!command) throw new Error('The command passed in cannot be null')
    this.moveCommand = command
  }

  setAttackCommand(command) {
    if (!command) throw new Error('The command passed in cannot be null')
    this.attackCommand = command
  }

  setFlipXCommand(command) {
    if (!command) throw new Error('The command passed in cannot be null')
    this.flipXCommand = command
  }

  /** Set the command to be execute when the mouse pointer is down */
  setCommand(key, command) {
    // Validate the key and command
    if (!command) throw new Error('The command passed in cannot be null')
    if (!this.keyMaps[key]) throw new Error('The key passed in is not a valid key')

    // Use the key to set the command
    this.keyMaps[key](command)
  }

  /** Get all the commands in the queue */
  getCommandQueue() {
    let queue = []
    if (this.commandQueue.length > 0) {
      queue = this.commandQueue
      this.commandQueue = []
    }

    return queue
  }
}
