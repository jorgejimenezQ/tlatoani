import Phaser from 'phaser'

import assets from './bootScene.config'

// Characters
import Player from '../../player/Player'
import Archer from '../../archer/Archer'
import Slime from '../../slime/Slime'
import Knight from '../../knight/Knight'

// Character Factory
import { createCharacter, createInputHandler } from '../../factory/factory'

// Items
import Bow from '../../weapons/bow/Bow'

// Multiplayer stuff
// import socket from '../../connection/connect'
import EntitiesService from '../../service/entitiesStorage.service'
import SocketConnection from '../../connection/connect'

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')

    this.spawnPoints = []
    this.cursorKeys = null
    // TEST PLAYER
    this.player = null
    // Input handler
    this.playerInputHandler = null
    this.socketConnection = new SocketConnection()
    this.socketConnection.connect()
    this.socket = this.socketConnection.socket
    this.entitiesService = new EntitiesService()
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

    // Set the spawn points
    this.spawnPoints = this.map.getObjectLayer('Spawn Points').objects

    // Set the camera
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels + 50)

    // set the camera to follow the player
    this.cameras.main.setZoom(1.5)
    this.cameras.main.setLerp(0.1, 0.1)

    this.socket.on('player', (data) => {
      // console.log('Player connected', data)

      const spawnPoint = this.spawnPoints[data.spawnPoint]

      const player = createCharacter(data.type, this, spawnPoint.x, spawnPoint.y)
      const input = createInputHandler(data.type, this)

      this.playerInputHandler = input
      this.player = player
      this.player.connectionId = data.connectionId
      this.entitiesService.setPlayer(this.player)

      // Set the camera to follow the player
      this.cameras.main.startFollow(this.player)
    })

    this.socket.on('players', (data) => {
      // console.log('Players connected', data)
      const keys = Object.keys(data)
      keys.forEach((key) => {
        if (!data[key].spawnPoint) return
        this.addPlayer(data[key])
      })
    })

    this.socket.on('playerAdded', this.addPlayer.bind(this))
    this.socket.on('playerDisconnected', this.removePlayer.bind(this))
    this.socket.on('updatePlayer', this.updatePlayer.bind(this))
  }

  update() {
    if (!this.player) return
    this.playerInputHandler.handleMoveInput()
    this.playerInputHandler.handlePointerInput()

    // execute all the player's commands in the queue
    const commands = this.playerInputHandler.getCommandQueue()
    if (commands.length > 0) {
      while (commands.length > 0) {
        const command = commands.shift()
        if (!command.execute) continue
        command.execute(this.player)
        // console.log(JSON.stringify(this.player))
      }
    }

    this.player.update()

    // Update the other players
    this.entitiesService.otherPlayers.forEach((player) => {
      if (player.disconnected) {
        // console.log(player)
        player.disconnect()
        player.destroy()
        this.entitiesService.removePlayer(player)
        return
      }

      player.update()

      if (player.name === 'archer' && player.arrowShot) {
        //TODO: get the arrow from the player and add it to the scene
      }
    })

    // If the player has moved send the new position to the server
    // if (this.player.moved) {
    if (true) {
      // Send data to the server
      const playerData = JSON.stringify({
        connectionId: this.player.connectionId,
        velocity: this.player.velocity,
        position: this.player.position,
        rotation: this.player.rotation,
        flipX: this.player.flipX,
        health: this.player.health,
        arrowShot: this.player.arrowShot || false,
        arrow: this.player.arrow ? this.player.arrow.mousePosition : null,
      })

      this.socket.emit('playerMoved', playerData)
    }
  }

  removePlayer(data) {
    // console.log('Player disconnected', data)
    // const removedPlayer = this.entitiesService.removePlayer(data)
    const player = this.entitiesService.getOtherPlayer(data)
    player.disconnected = true
  }

  addPlayer(data) {
    // Create the other player with no input handler for now
    // TODO: Create the input handler for the other players
    const spawnPoint = this.spawnPoints[data.spawnPoint]
    const player = createCharacter(data.type, this, spawnPoint.x, spawnPoint.y)
    player.connectionId = data.connectionId
    this.entitiesService.addOtherPlayer(player)
    // console.log(this.entitiesService.otherPlayers)
    return player
  }

  updatePlayer(data) {
    // console.log('player updated broadcasted', data)
    data = JSON.parse(data)

    // console.log(data.velocity.x, data.velocity.y)
    const player = this.entitiesService.getOtherPlayer(data.connectionId)
    if (!player) return

    if (data.arrowShot && !player.arrowShot) {
      Archer.config.commands
        .attackCommand({ worldX: data.arrow.x, worldY: data.arrow.y })
        .execute(player)
    }

    if (player.name === 'archer') {
      //TODO: update the bow and arrow direction
    }

    player.setVelocity(data.velocity.x, data.velocity.y)
    player.setPosition(data.position.x, data.position.y)
    player.setFlipX(data.flipX)
    // player.update()
  }
}
