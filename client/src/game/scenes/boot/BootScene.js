import Phaser from 'phaser'
import EventEmitter from 'events'

import assets from './bootScene.config'

// Characters
import Player from '../../player/Player'
import Archer from '../../archer/Archer'
import Slime from '../../slime/Slime'
import Knight from '../../knight/Knight'

// Character Factory
import createCharacter from '../../factory/factory'

// Items
import Bow from '../../weapons/bow/Bow'

// Input handler
import InputHandler from '../../input/InputHandler'
import ArcherInputHandler from '../../archer/input/ArcherInputHandler'
import KnightInputHandler from '../../knight/input/KnightInputHandler'

// Online stuff
import socket from '../../connection/connect'
import entitiesService from '../../service/entitiesStorage.service'

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')

    this.cursorKeys = null

    // TEST PLAYER
    this.player = null

    // Input handler
    this.playerInputHandler = null
    this.customEvents = new EventEmitter()
  }

  preload() {
    // Load the map tileset
    this.load.image('tiles', assets.mapTileset)
    // Load the map
    this.load.tilemapTiledJSON('map', assets.mapJson)

    // Load player assets using Player.config
    this.load.atlas(Player.config.texture, Player.config.image, Player.config.atlas)
    this.load.animation(Player.config.animations.key, Player.config.animations.json)

    // Load archer assets using Archer.config
    this.load.atlas(Archer.config.texture, Archer.config.image, Archer.config.atlas)
    this.load.animation(Archer.config.animations.key, Archer.config.animations.json)

    // Load slime assets using Slime.config
    this.load.atlas(Slime.config.texture, Slime.config.image, Slime.config.atlas)
    this.load.animation(Slime.config.animations.key, Slime.config.animations.json)

    // Load knight assets using Knight.config
    this.load.atlas(Knight.config.texture, Knight.config.image, Knight.config.atlas)
    this.load.animation(Knight.config.animations.key, Knight.config.animations.json)

    // Load weapon assets using Bow.config
    this.load.atlas('weapon', Bow.config.image, Bow.config.atlas)
  }

  create() {
    // Create the map and set the tileset
    this.map = this.make.tilemap({ key: 'map' })
    const tileset = this.map.addTilesetImage('map_tileset', 'tiles', 32, 32, 0, 0)
    const layer1 = this.map.createLayer('Tile Layer 1', tileset, 0, 0)
    const layer2 = this.map.createLayer('Tile Layer 2', tileset, 0, 0)
    const layer3 = this.map.createLayer('Tile Layer 3', tileset, 0, 0)
    // set the depth of the layers
    layer1.setDepth(0)
    layer2.setDepth(1)
    layer3.setDepth(2)

    // Set the collision between the player and the map
    layer1.setCollisionByProperty({ collides: true })
    layer2.setCollisionByProperty({ collides: true })
    layer3.setCollisionByProperty({ collides: true })

    // Set the collision tiles
    this.matter.world.convertTilemapLayer(layer1)
    this.matter.world.convertTilemapLayer(layer2)
    this.matter.world.convertTilemapLayer(layer3)

    // Set the camera
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels + 50)

    // set the camera to follow the player
    this.cameras.main.setZoom(1.5)
    this.cameras.main.setLerp(0.1, 0.1)

    socket.emit('getPlayer', socket.id)
    entitiesService.events.on('characterChanged', (entity) => {
      // Create the player
      const result = createCharacter(entity.toLowerCase(), this, 300, 100)
      this.playerInputHandler = result.inputHandler
      this.player = result.character

      // Set the camera to follow the player
      this.cameras.main.startFollow(this.player)
    })
  }

  update() {
    if (!this.player) return
    this.playerInputHandler.handleMoveInput()
    this.playerInputHandler.handlePointerInput()
    // execute all the player's commands in the queue
    const commands = this.playerInputHandler.getCommandQueue()
    // console.log(JSON.stringify(commands))
    if (commands.length > 0) {
      while (commands.length > 0) {
        const command = commands.shift()
        if (!command.execute) continue
        command.execute(this.player)
        // console.log(JSON.stringify(this.player))
      }
    }

    this.player.update()

    // Send data to the server
    const playerData = JSON.stringify({
      id: socket.id,
      velocity: this.player.velocity,
      position: this.player.position,
      rotation: this.player.rotation,
      flipX: this.player.flipX,
      health: this.player.health,
    })
    socket.emit('updatePlayer', playerData)
  }
}
