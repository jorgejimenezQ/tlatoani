import Phaser from 'phaser'
export default class Character extends Phaser.Physics.Matter.Sprite {
  constructor(config) {
    const { scene, x, y, texture, frame } = config
    super(scene.matter.world, x, y, texture, frame)

    // The name and type of the character
    if (!config.name) throw new Error('Character must have a name')

    // Character identifiers
    this.characterId = Phaser.Math.RND.uuid()
    this.name = config.name
    this.type = config.type || 'character'

    // Character attributes
    this.health = config.health || 100
    this._attack = config.attack || 2
    this.moveSpeed = config.moveSpeed || 1
    this.dropItems = config.dropItems || []

    // Character animations and sprites
    this.animations = config.animations

    // Set the depth of the character
    // this.setDepth(1)
    this.events = new Phaser.Events.EventEmitter()

    // Set the character's body
    this.sensorSize = config.sensorSize || this.width * 1.5
    this.collisionSize = config.collisionSize || this.width * 0.5
    this.characterSensor = null
    this.characterCollider = null

    // Add the character to the scene
    scene.add.existing(this)

    this.bodySetup(config)
    this.setFixedRotation()
    if (config.offset) this.setOrigin(config.offset.x, config.offset.y)

    // A vector to store the character's _position
    this._position = new Phaser.Math.Vector2(this.x, this.y)

    this.scene.input.on('pointermove', (pointer) => {
      if (this.dead) return
      this.setFlipX(pointer.worldX < this.x)
    })
  }

  update(time, delta) {
    // Is the character still alive?
    if (this.health <= 0) {
      // TODO: handle the character death
      this.deathEmitter.emit('death')
    }

    // console.log the magnitude of the character's velocity
    const { x, y } = this.body.velocity
    const velocityMagnitude = Math.sqrt(x * x + y * y)

    if (velocityMagnitude === 0) this.runIdleAnimation()
    else this.runWalkAnimation()
  }

  /** This method should be overridden by the child class*/
  setMoveCommand(command) {
    this.characterMoveCommand = command
  }

  runIdleAnimation() {
    this.anims.play(this.animations.idle, true)
  }

  runWalkAnimation() {
    this.anims.play(this.animations.walk, true)
  }

  /**
   * Lowers the character's health by the amount of damage.
   */
  damage(damage) {
    this.health -= damage

    // Is the character dead?
    if (this.health <= 0) {
      this.events.emit('death')
    }
  }

  /**
   */
  drop(quantity, item) {
    // TODO: We want to drop the items that the character has in its inventory
    // the items should be set at instantiation
  }

  /** Set up the character's body and collisions */
  bodySetup(config) {
    // Use the one provided or create a new one
    if (config.compoundBody) {
      this.setExistingBody(config.compoundBody)
    } else {
      const { Body, Bodies } = Phaser.Physics.Matter.Matter
      const { width: w, height: h } = this

      const { x, y } = config.bodyOffset || { x: 0, y: 0 }
      this.characterSensor = Bodies.circle(this.x, this.y, this.sensorSize, {
        isSensor: true,
        label: this.type + 'Sensor',
        uniqueId: this.characterId,
      })

      this.characterCollider = Bodies.circle(this.x, this.y, this.collisionSize, {
        isSensor: false,
        label: this.type + 'Collider',
        uniqueId: this.characterId,
      })

      const compoundBody = Body.create({
        parts: [this.characterSensor, this.characterCollider],
      })

      this.setExistingBody(compoundBody)
    }
  }

  /** Add collision event callbacks */
  addOnCollideOuterStart(callback) {
    if (!this.characterSensor)
      throw new Error('Item must have a sensor to add a collision callback')
    this.scene.matterCollision.addOnCollideStart({
      objectA: this.characterSensor,
      callback: callback,
      context: this,
    })
  }

  addOnCollideOuterEnd(callback) {
    if (!this.characterSensor)
      throw new Error('Item must have a sensor to add a collision callback')
    this.scene.matterCollision.addOnCollideEnd({
      objectA: this.characterSensor,
      callback: callback,
      context: this,
    })
  }

  addOnCollideInnerStart(callback) {
    if (!this.characterCollider)
      throw new Error('Item must have a collider to add a collision callback')
    this.scene.matterCollision.addOnCollideStart({
      objectA: this.characterCollider,
      callback: callback,
      context: this,
    })
  }

  addOnCollideInnerEnd(callback) {
    if (!this.characterCollider)
      throw new Error('Item must have a collider to add a collision callback')
    this.scene.matterCollision.addOnCollideEnd({
      objectA: this.characterCollider,
      callback: callback,
      context: this,
    })
  }

  get attack() {
    return this._attack
  }

  get position() {
    return this._position.set(this.x, this.y)
  }

  get velocity() {
    return this.body.velocity
  }

  get dead() {
    return this.health <= 0
  }
}
