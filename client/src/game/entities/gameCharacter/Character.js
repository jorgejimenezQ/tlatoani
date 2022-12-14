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
    this.isDead = false
    this.dropItems = config.dropItems || []

    this.damageText = this.scene.add.text(
      this.x + this.width + 10,
      this.y + this.height + 10,
      this.health,
      {
        font: '16px Quicksand',
        // wordWrapWidth: sprite.width,
        align: 'center',
        // backgroundColor: '#ffff00',
      }
    )

    // Character animations and sprites
    this.animations = config.animations

    // Set the depth of the character
    // this.setDepth(1)
    this.events = new Phaser.Events.EventEmitter()

    // Subscribe to the death EventEmitter
    if (config.deathCallback) this.events.on('death', config.deathCallback.bind(this))

    // Set the character's body
    this.sensorSize = config.sensorSize || this.width * 1.5
    this.collisionSize = config.collisionSize || this.width * 0.5
    this.characterSensor = null
    this.characterCollider = null

    // this.setScale(config.scale || 2)
    // Add the character to the scene
    scene.add.existing(this)

    this.bodySetup(config)
    if (!config.collisionCallbacks)
      throw new Error('The collision callbacks are not implemented yet')
    this.addOnCollideInnerStart(config.collisionCallbacks.inner.start)
    this.addOnCollideInnerEnd(config.collisionCallbacks.inner.end)

    this.addOnCollideOuterStart(config.collisionCallbacks.outer.start)
    this.addOnCollideOuterEnd(config.collisionCallbacks.outer.end)

    this.setFixedRotation()
    // Make the character not pushable

    if (config.offset) this.setOrigin(config.offset.x, config.offset.y)

    // A vector to store the character's _position
    this._position = new Phaser.Math.Vector2(this.x, this.y)

    // The last updates position
    this.lastPosition = new Phaser.Math.Vector2(this.x, this.y)
    this.moved = false
    this.lastFlipX = this.flipX
    this.flipped = false

    // Connection stuff
    this.connectionId = config.connectionId || null
    this.disconnected = false
    this.events.on('disconnect', () => {
      this.disconnected = true
      this.damageText.destroy()
      console.log('Character disconnected')
    })

    // Expose the character's configuration
    this.config = config
  }

  update(time, delta) {
    // Is the character still alive?
    //TODO: We should probably have a death animation.
    // Should we kill the character here? or in the game scene?
    if (this.health <= 0) {
      this.isDead = true
      this.damageText.destroy()
      return
    }

    // TODO: are we using these?
    if (this.lastPosition.x == this.x && this.lastPosition.y == this.y) this.moved = false
    else this.moved = true
    if (this.flipX == this.lastFlipX) this.flipped = false
    else this.flipped = true

    this.lastFlipX = this.flipX
    this.lastPosition.set(this.x, this.y)

    // console.log the magnitude of the character's velocity
    const { x, y } = this.body.velocity
    const velocityMagnitude = Math.sqrt(x * x + y * y)

    if (velocityMagnitude === 0) this.runIdleAnimation()
    else this.runWalkAnimation()

    // Display the character's health above the character
    this.damageText.setText(this.health)

    this.damageText.x = this.x
    this.damageText.y = this.y - 20

    //TODO: When the character is flipped we need to emit the flip event
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

    this.takeDamage()

    // Is the character dead?
    if (this.health <= 0) {
      this.events.emit('death')
    }
  }

  takeDamage(damage) {
    this.setTint(0xff0505)
    // Add red tint to this character
    this.scene.time.addEvent({
      delay: 100,
      callback: () => {
        this.clearTint()
      },
    })
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
        frictionStatic: 0,
        frictionAir: 0.02,
      })

      this.setExistingBody(compoundBody)
    }
  }

  /** Call to run the disconnect command */
  disconnect() {
    this.events.emit('disconnect')
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
}
