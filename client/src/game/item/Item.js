import Phaser from 'phaser'

export default class Item extends Phaser.Physics.Matter.Image {
  constructor(config) {
    let { scene, x, y, texture, frame } = config
    super(scene.matter.world, x, y, texture, frame)

    // The items identifiers
    if (!config.name) throw new Error('Item must have a name')
    this.type = config.type || 'item'
    this.name = config.name
    this.description = config.description || ''
    this.itemId = Phaser.Math.RND.uuid()
    this.events = new Phaser.Events.EventEmitter()

    // The items attributes
    if (config.offset) {
      this.setOrigin(config.offset.x, config.offset.y)
    }
    this.depth = config.depth || 1
    this.setFixedRotation()
    if (config.friction) this.setFriction(config.friction)
    if (config.scale) this.setScale(config.scale)
    this.itemSensor = null
    this.itemCollider = null

    this.bodySetup(config)

    // Add the item to the scene
    scene.add.existing(this)

    if (config.originOffset) this.setOrigin(config.originOffset.x, config.originOffset.y)
    if (config.rotation) this.setRotation(Phaser.Math.DegToRad(config.rotation))
    if (config.fixedRotation) this.setFixedRotation()
  }

  bodySetup(config) {
    // Build the item's body, if it has one
    const { Body, Bodies } = Phaser.Physics.Matter.Matter

    const parts = []
    if (config.sensorSize) {
      this.itemSensor = Bodies.circle(this.x, this.y, config.sensorSize, {
        isSensor: true,
        label: this.type + 'Sensor',
        uniqueId: this.name,
        inertia: Infinity,
      })

      parts.push(this.itemSensor)
    }

    if (config.collisionSize) {
      this.itemCollider = Bodies.circle(this.x, this.y, config.collisionSize, {
        isSensor: false,
        label: this.type + 'Collider',
        uniqueId: this.name,
        inertia: Infinity,
      })

      parts.push(this.itemCollider)
    }

    if (parts.length > 0) {
      const compoundBody = Body.create({
        parts: parts,
      })

      this.setExistingBody(compoundBody)
    }
  }

  /** Add collision event callbacks */
  addOnCollideOuterStart(callback) {
    if (!this.itemSensor) throw new Error('Item must have a sensor to add a collision callback')
    this.scene.matterCollision.addOnCollideStart({
      objectA: this.itemSensor,
      callback: callback,
      context: this,
    })
  }

  addOnCollideOuterEnd(callback) {
    if (!this.itemSensor) throw new Error('Item must have a sensor to add a collision callback')
    this.scene.matterCollision.addOnCollideEnd({
      objectA: this.itemSensor,
      callback: callback,
      context: this,
    })
  }

  addOnCollideInnerStart(callback) {
    if (!this.itemCollider) throw new Error('Item must have a collider to add a collision callback')
    this.scene.matterCollision.addOnCollideStart({
      objectA: this.itemCollider,
      callback: callback,
      context: this,
    })
  }

  addOnCollideInnerEnd(callback) {
    if (!this.itemCollider) throw new Error('Item must have a collider to add a collision callback')
    this.scene.matterCollision.addOnCollideEnd({
      objectA: this.itemCollider,
      callback: callback,
      context: this,
    })
  }
}
