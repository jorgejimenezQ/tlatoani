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
    this.flipX = false
  }

  // handle move input
  handleMoveInput(target) {
    if (!this.moveCommand) throw new Error('The move command cannot be null')
    if (!target) return

    this.commandQueue.push(this.moveCommand(target))
  }

  handleFlipX() {
    if (this.flipX === null) return

    this.commandQueue.push(this.flipXCommand(this.flipX))
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

  /**
   * Will set the status for the input handler. It will set the the move, attack, or flipX command. If the command is not
   * set, it will throw an error.
   *
   * @param {string} key The key to set the command
   * @param {object} data The data to pass to the command
   */
  setInputStatus(key, data) {
    // Validate the key
    if (!this.keyMaps[key]) throw new Error('The key passed in is not a valid key')

    // Set the command
    this.keyMaps[key](data)
  }
}
