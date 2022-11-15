import Phaser from 'phaser'
import Player from '../../player/Player'

/** Map */
import map from '../../assets/mapLayers/map-1.json'
import mapTileset from '../../assets/mapLayers/map_tileset.png'

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')

    this.cursorKeys = null

    // TEST PLAYER
    this.player = null
  }

  preload() {
    // Load the map tileset
    this.load.image('tiles', mapTileset)

    // Load the map
    this.load.tilemapTiledJSON('map', map)

    // Load player assets using Player.config
    this.load.atlas('player', Player.config.image, Player.config.atlas)
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

    // Set the collision tiles
    this.matter.world.convertTilemapLayer(layer1)
    this.matter.world.convertTilemapLayer(layer2)
    this.matter.world.convertTilemapLayer(layer3)

    this.player = new Player({
      scene: this,
      x: 100,
      y: 100,
      texture: 'player',
      frame: 'townsfolk_f_idle_1',
    })

    // Set the camera
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels + 50)
    // set the camera to follow the player
    this.cameras.main.startFollow(this.player)
  }

  update() {
    this.player.update()
  }
}
