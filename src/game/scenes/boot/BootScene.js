import Phaser from 'phaser'

import assets from './bootScene.config'

// Characters
import Player from '../../player/Player'
import Archer from '../../archer/Archer'
import Slime from '../../slime/Slime'

// Items
import Bow from '../../weapons/bow/Bow'
import InputHandler from '../../input/InputHandler'
import ArcherInputHandler from '../../archer/input/ArcherInputHandler'

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')

    this.cursorKeys = null

    // TEST PLAYER
    this.player = null

    // Input handler
    this.playerInputHandler = null
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

    console.log(Slime.config)

    // Load weapon assets using Bow.config
    this.load.atlas('weapon', Bow.config.image, Bow.config.atlas)
  }

  create() {
    // Handle the input
    this.playerInputHandler = new ArcherInputHandler(this.input)
    this.playerInputHandler.setMoveCommand(Archer.config.commands.moveCommand)
    this.playerInputHandler.setPointerDownCommand(Archer.config.commands.attackCommand)

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

    // this.player = new Archer({
    //   scene: this,
    //   name: 'player one',
    //   x: 300,
    //   y: 100,
    //   texture: Archer.config.texture,
    //   frame: 'archer_idle_1',

    // })

    this.player = new Slime({
      scene: this,
      name: 'slime',
      x: 300,
      y: 100,
      texture: Slime.config.texture,
      frame: 'slime_idle_f0',
    })

    // Set the camera
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels + 50)

    // set the camera to follow the player
    this.cameras.main.startFollow(this.player)
    this.cameras.main.setZoom(1.5)
    this.cameras.main.setLerp(0.1, 0.1)
  }

  update() {
    this.playerInputHandler.handleMoveInput()
    this.playerInputHandler.handlePointerInput()

    const commands = this.playerInputHandler.getCommandQueue()

    if (commands.length > 0) {
      while (commands.length > 0) {
        const command = commands.shift()
        command.execute(this.player)
      }
    }

    this.player.update()
  }
}
