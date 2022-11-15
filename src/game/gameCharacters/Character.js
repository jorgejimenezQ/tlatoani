import Phaser from 'phaser'
export default class Character extends Phaser.Physics.Matter.Sprite {
  constructor(config) {
    const { scene, x, y, texture, frame, health } = config
    super(scene.matter.world, x, y, texture, frame)

    // Set the depth of the character
    this.setDepth(1)
    this.health = health
    this.events = new Phaser.Events.EventEmitter()

    // Add the character to the scene
    scene.add.existing(this)
  }

  update(time, delta) {
    // Update the character

    // Is the character still alive?
    if (this.health <= 0) {
      // TODO: handle the character death
      this.deathEmitter.emit('death')
    }
  }

  takeDamage(damage) {
    // Take damage
  }

  drops(quantity, item) {
    // Drop items
  }
}
