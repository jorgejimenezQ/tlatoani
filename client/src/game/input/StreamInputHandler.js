export default class StreamInputHandler {
  static constants = {
    ATTACK_INPUT: 'ATTACK_INPUT',
    MOVE_INPUT: 'MOVE_INPUT',
    FLIP_INPUT: 'FLIP_INPUT',
    DEATH_INPUT: 'DEATH_INPUT',
  }

  constructor() {
    this.commandQueue = []
    this.InputHandlers = []

    this.attacking = false
    this.position = null
    this.flipped = false

    this.keyMaps = {
      ATTACK_INPUT: this.setAttackCommand.bind(this),
      MOVE_INPUT: this.setMoveCommand.bind(this),
      FLIP_INPUT: this.setFlipXCommand.bind(this),
      DEATH_INPUT: this.setDeathCommand.bind(this),
    }

    this.moveCommand = () => {}
    this.attackCommand = () => {}
    this.flipXCommand = () => {}
  }

  handleMove() {
    if (!this.position) return
    this.commandQueue.push(this.moveCommand(this.position))
  }

  handleAttack() {
    if (this.attacking) {
      this.commandQueue.push(this.attackCommand())
    }
  }

  handleFlipX() {
    this.commandQueue.push(this.flipXCommand(this.flipped))
  }

  // TODO: handle death command
  // TODO: handle ... command

  // Set command by the key
  setCommand(key, command) {
    if (!this.keyMaps[key]) throw new Error('The key passed in is not a valid key')
    this.keyMaps[key](command)
  }

  /** queue */
  /**
   * Returns the oldest command in the queue. If the queue is empty, it returns null.
   * @returns {Command} The oldest command in the queue
   */
  commandDequeue() {
    if (!this.commandQueue.length) return null
    return this.commandQueue.shift()
  }
  /** Get all the commands in the queue */
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
  /** Set all the commands */
  setMoveCommand(command) {
    this.moveCommand = command
  }

  setAttackCommand(command) {
    this.attackCommand = command
  }

  setFlipXCommand(command) {
    this.flipXCommand = command
  }

  setDeathCommand(command) {
    this.deathCommand = command
  }
}
