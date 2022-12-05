/** @type {import("../../../../typings/phaser")} */

import Character from '../gameCharacter/Character'
import enemyConfig from './enemy.config'
import Phaser from 'phaser'

export default class Enemy extends Character {
  static config = enemyConfig

  /**
   *
   */
  _targets = []
  currentTarget = null
  idle = true

  constructor(config) {
    const useConfig = config.useConfig || Enemy.config
    if (config.useConfig) delete config.useConfig
    super({ ...config, ...useConfig })

    this.moveSpeed = useConfig.moveSpeed
  }

  update() {
    super.update()

    if (this.dead) {
      this.setVelocity(0)
      return
    }
    if (!this.currentTarget) return
    // Calculate the direction from the enemy to the target
    const targetVector = new Phaser.Math.Vector2(this.currentTarget.x, this.currentTarget.y)
    const enemyVector = new Phaser.Math.Vector2(this.x, this.y)
    const direction = targetVector.subtract(enemyVector).normalize().scale(this.moveSpeed)

    this.setVelocity(direction.x, direction.y)
    // this.setFlipX(this.flipX)
  }

  attacking() {
    return false
  }

  /**
   * Sets the target of the enemy.
   *
   * @param {Player} target The target to set.
   */
  addTarget(target) {
    // add the target if it hasn't been added yet
    const targetExists = this._targets.find((t) => t.connectionId === target.connectionId)
    if (!targetExists) {
      const targetId = target.connectionId
      this._targets.push({ targetId: targetId, position: { x: target.x, y: target.y } })
    }
  }

  /**
   * Removes the target from the enemy.
   * @param {Player} target The target to remove.
   */
  removeTarget(target) {
    const targetId = target.characterId
    delete this._targets[targetId]
  }

  get targets() {
    return this._targets
  }
}
