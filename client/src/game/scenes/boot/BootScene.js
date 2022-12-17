/** @type {import{../../../../../typings/phaser}} */
import Phaser from 'phaser'

import bootSceneConfig from './bootScene.config'

// Characters
import Player from '../../entities/player/Player'
import Archer from '../../entities/archer/Archer'
import Slime from '../../entities/slime/Slime'
import Knight from '../../entities/knight/Knight'

// Character Factory
import { createCharacter, createInputHandler, createStreamedInput } from '../../factory/factory'

// Items
import Bow from '../../entities/weapons/bow/Bow'

// Multiplayer stuff
// import socket from '../../connection/connect'
import EntitiesService from '../../service/entitiesStorage.service'
import SocketConnection from '../../connection/connect'
import Enemy from '../../entities/enemies/Enemy'
import InputHandler from '../../input/InputHandler'
import InputHandlerService from '../../service/inputHandler.service'

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
    this.inputHandlerService = new InputHandlerService(this.entitiesService)
    this.playerReady = false
    this.triggerPoints = null
  }

  preload() {
    // Load the map tileset
    this.load.image('tiles', bootSceneConfig.mapTileset)
    // Load the map
    this.load.tilemapTiledJSON('map', bootSceneConfig.mapJson)

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

    // Load enemy assets using Enemy.config
    this.load.atlas(Enemy.config.texture, Enemy.config.image, Enemy.config.atlas)
    this.load.animation(Enemy.config.animations.key, Enemy.config.animations.json)

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
    // this.cameras.main.setZoom(1.5)
    this.cameras.main.setLerp(0.1, 0.1)
    this.cameras.main.zoom = 2

    // Set the spawn points
    this.spawnPoints = this.map.getObjectLayer('Spawn Points').objects
    this.enemySpawnPoints = this.map.getObjectLayer('Enemy Spawn Points').objects
    this.enemySpawnPoints = this.enemySpawnPoints.map((point) => {
      return { ...point, type: 'enemy', id: point.name.split('_')[1] }
    })

    // Filter the trigger objects
    this.triggerPoints = this.enemySpawnPoints.filter((object) => object.name.includes('trigger'))
    this.triggerPoints = this.triggerPoints.map((point) => {
      const id = point.name.split('_')[1]
      const spawner = this.enemySpawnPoints.find((spawner) => spawner.id === id)
      return { ...point, type: 'trigger', id: id, isTriggered: false, spawner: spawner }
    })

    this.socket.on('player', (data) => {
      const spawnPoint = this.spawnPoints[data.spawnPoint]

      const player = createCharacter(data.type, this, spawnPoint.x, spawnPoint.y)
      const input = createInputHandler(data.type, this)

      this.playerInputHandler = input
      this.player = player
      this.player.connectionId = data.connectionId
      // this.entitiesService.setPlayer(this.player)

      // Set the camera to follow the player
      this.cameras.main.startFollow(this.player)

      // Set the player ready
      this.playerReady = true
    })

    /** Listen for the server  */

    this.socket.on('players', (data) => {
      const keys = Object.keys(data)
      keys.forEach((key) => {
        if (!data[key].spawnPoint) return
        this.addPlayer(data[key])
      })
    })

    this.socket.on(
      'updateEnemy',
      this.inputHandlerService.updateEnemyInput.bind(this.inputHandlerService)
    )
    this.socket.on('playerAdded', this.addPlayer.bind(this))
    this.socket.on('playerDisconnected', this.removePlayer.bind(this))
    this.socket.on('updatePlayer', this.updatePlayer.bind(this))
    this.socket.on('enemySpawned', this.spawnEnemy.bind(this))
    this.socket.on('spawnerTriggered', this.spawnerTriggered.bind(this))
    this.socket.on('destroyEnemy', this.destroyEnemy.bind(this))
  }

  update() {
    // if (this.pause) return
    if (!this.player || !this.playerReady) return
    this.playerInputHandler.handleMoveInput()
    this.playerInputHandler.handlePointerInput()

    // execute all the player's commands in the queue
    const commands = this.playerInputHandler.getCommandQueue()
    if (commands.length > 0) {
      while (commands.length > 0) {
        const command = commands.shift()
        if (!command.execute) continue
        command.execute(this.player)
      }
    }

    this.player.update()
    this.sendPlayerData()

    // Check for triggers
    this.triggerPoints.forEach((trigger) => {
      if (this.player.y < trigger.y && !trigger.isTriggered) {
        this.socket.emit('spawnerTrigger', { triggerId: trigger.name.split('_')[1] })
        trigger.isTriggered = true
      }
    })

    // Update the other players
    this.updateOtherPlayers()

    // Update the enemies
    this.entitiesService.enemies.forEach(({ enemy, inputHandler }) => {
      if (enemy.isDead) {
        this.socket.emit('enemyDeath', { connectionId: enemy.connectionId })
        enemy.destroy()
        return
      }
      // execute all the enemy's commands in the queue
      const commands = inputHandler.getCommandQueue()
      if (commands.length > 0) {
        while (commands.length > 0) {
          const command = commands.shift()
          if (!command.execute) continue
          command.execute(enemy)
        }
      }

      // Handle enemy input
      // TODO: Fix the way we are handling the enemy move input
      if (inputHandler.target) {
        let target = null
        if (inputHandler.target.targetId === this.player.connectionId) target = this.player
        else target = this.entitiesService.getOtherPlayer(inputHandler.target.targetId).player

        // console.log(inputHandler.target)
        inputHandler.handleMoveInput(target)
      }

      // Update the enemy flipped state
      inputHandler.handleFlipX()

      enemy.update()
      if (enemy.isDead) {
        this.socket.emit('enemyDeath', { connectionId: enemy.connectionId })
        enemy.destroy()
        return
      }
      this.socket.emit('enemyData', {
        enemy: {
          connectionId: enemy.connectionId,
          velocity: enemy.velocity,
          x: enemy.x,
          y: enemy.y,
          health: enemy.health,
          type: enemy.type,
          currentTarget: enemy.currentTarget || null,
        },
        targets: enemy.targets,
      })
    })
  }

  updateOtherPlayers() {
    this.entitiesService.otherPlayers.forEach(({ player, inputHandler }) => {
      //TODO: Create a handler and command for disconnected
      if (player.disconnected) {
        player.destroy()
        this.entitiesService.removePlayer(player)
        return
      }

      // Get the oldest command from the queue
      const streamCommands = inputHandler.getCommandQueue()
      if (streamCommands.length > 0) {
        while (streamCommands.length > 0) {
          const command = streamCommands.shift()
          if (!command.execute) continue
          command.execute(player)
        }
      }

      // Update the player
      player.update()

      if (player.name === 'archer' && player.arrowShot) {
        //TODO: get the arrow from the player and add it to the scene
      }
    })
  }

  sendPlayerData() {
    // If the player has moved send the new position to the server
    // if (this.player.moved) {
    // Send data to the server
    const playerData = JSON.stringify({
      connectionId: this.player.connectionId,
      velocity: this.player.velocity,
      position: this.player.position,
      attacking: this.player.attacking() || null,
      rotation: this.player.rotation,
      flipX: this.player.flipX,
      health: this.player.health,
      arrowShot: this.player.arrowShot || false,
      arrow: this.player.arrow ? this.player.arrow.mousePosition : null,
      weaponRotation: this.player.name === 'archer' ? this.player.currentWeapon.bow.rotation : null,
    })

    this.socket.emit('playerData', playerData)
  }

  spawnerTriggered(data) {
    const trigger = this.triggerPoints.find((trigger) => trigger.name === 'trigger_' + data)
    if (!trigger) return
    trigger.isTriggered = true
  }

  destroyEnemy(enemyId) {
    const { enemy } = this.entitiesService.getEnemy(enemyId)
    if (!enemy) return

    enemy.health = 0
  }

  spawnEnemy(data) {
    // Create an enemy
    const enemy = createCharacter(
      'enemy',
      this,
      this.enemySpawnPoints[0].x + Math.random() * 100,
      this.enemySpawnPoints[0].y + Math.random() * 100
    )
    // Create the input handler for this enemy
    const inputHandler = createInputHandler('enemy', this)

    enemy.connectionId = data.connectionId
    this.entitiesService.addEnemy({ enemy, inputHandler: inputHandler })
  }

  removePlayer(data) {
    const { player, inputHandler } = this.entitiesService.getOtherPlayer(data)
    player.disconnect()
  }

  addPlayer(data) {
    // Create the other player with no input handler for now
    // TODO: Create the input handler for the other players
    const spawnPoint = this.spawnPoints[data.spawnPoint]
    const player = createCharacter(data.type, this, spawnPoint.x, spawnPoint.y)
    player.connectionId = data.connectionId

    // Create the streamed input handler for this player
    const input = createStreamedInput(data.type)
    this.entitiesService.addOtherPlayer(player, input)

    return player
  }

  updatePlayer(data) {
    data = JSON.parse(data)
    const { player, inputHandler } = this.entitiesService.getOtherPlayer(data.connectionId)

    inputHandler.attacking = data.attacking
    inputHandler.position = data.position
    inputHandler.flipped = data.flipX

    inputHandler.arrowShot = data.arrowShot
    inputHandler.arrow = data.arrow
    inputHandler.weaponRotation = data.weaponRotation

    // Update the input handler
    if (inputHandler.handleAttack) inputHandler.handleAttack()
    if (inputHandler.handleMove) inputHandler.handleMove()
    if (inputHandler.handleFlipX) inputHandler.handleFlipX()
    if (inputHandler.handleRotateWeapon) inputHandler.handleRotateWeapon()
  }
}
