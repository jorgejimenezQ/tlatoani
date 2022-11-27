export default class EnemyInput {
  static constants = {
    MOVE_INPUT: 'moveInput',
    ATTACK_INPUT: 'attackInput',
  }
  constructor() {
    this.keyMaps = {
      MOVE_INPUT: this.setMoveCommand.bind(this),
      ATTACK_INPUT: this.setAttackCommand.bind(this),
    }

    this.moveCommand = null
    this.attackCommand = null
  }

  // handle move input
  handleMoveInput() {}

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
}
