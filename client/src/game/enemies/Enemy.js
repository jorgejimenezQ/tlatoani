import Character from '../gameCharacter/Character'
import enemyConfig from './enemy.config'
import Phaser from 'phaser'

export default class Enemy extends Character {
  static config = enemyConfig

  /**
   *
   */
  _targets = {}
  currentTarget = null

  constructor(config) {
    const useConfig = config.useConfig || Enemy.config
    if (config.useConfig) delete config.useConfig
    super({ ...config, ...useConfig })
  }

  update() {
    super.update()

    // Get the distance between the enemy and all  the targets
    const targets = Object.keys(this._targets)
    for (let key of targets) {
      const currentTarget = this._targets[key]

      // The target is dead, remove it
      if (!this._targets[key].target) {
        delete this._targets[key]
        continue
      }

      const distance = Phaser.Math.Distance.Between(
        this.x,
        this.y,
        this._targets[key].target.x,
        this._targets[key].target.y
      )

      this._targets[key].distance = distance

      // Update the aggro score base on distance
      if (distance < currentTarget.distance) this._targets[key].aggroScore += 1
      // Cap the aggro score at 100
      if (this._targets[key].aggroScore > 100) this._targets[key].aggroScore = 100
    }

    // Sort the targets by aggro score
    const sortedTargets = Object.keys(this._targets).sort((a, b) => {
      return this._targets[a].aggroScore - this._targets[b].aggroScore
    })
    if (sortedTargets.length > 0) this.currentTarget = this._targets[sortedTargets[0]].target
  }

  attacking() {
    return false
  }

  /**
   * Sets the target of the enemy.
   *
   * @param {Player} target The target to set.
   */
  set targets(target) {
    const targetId = target.characterId
    this._targets[targetId] = { aggroScore: 0, target, distance: Infinity }
  }

  /**
   * Removes the target from the enemy.
   * @param {Player} target The target to remove.
   */
  removeTarget(target) {
    const targetId = target.characterId
    delete this._targets[targetId]
  }
}
