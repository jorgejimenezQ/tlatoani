import Phaser from 'phaser'
import mainSceneConfig from './mainScene.config'
import store from '../../../app/store'
import EntitiesService from '../../service/entitiesStorage.service'
import InputHandlerService from '../../service/inputHandler.service'
import { createCharacter, createInputHandler, createStreamedInput } from '../../factory/factory'

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: mainSceneConfig.key })
    this.socket = null
    this.layers = []
    this.playerType = null
    this.playerIndex = null
    this.gameSessionId = null
    this.connectionId = null
    this.entitiesService = new EntitiesService()
    this.inputHandlerService = new InputHandlerService(this.entitiesService)

    this.playerInputHandler = null
    this.player = null
  }

  init({ socket }) {
    this.socket = socket

    this.playerType = store.getState().gameSession.playerType
    this.playerIndex = store.getState().gameSession.playerIndex
    this.gameSessionId = store.getState().gameSession.gameSessionId
    this.connectionId = store.getState().connection.connectionId

    console.log(
      'MainScene init',
      this.playerType,
      this.playerIndex,
      this.gameSessionId,
      this.connectionId
    )
  }

  preload() {}

  create() {
    // Create the map and set the tileset
    this.map = this.make.tilemap({ key: mainSceneConfig.tileMap.key })
    const tileset = this.map.addTilesetImage('map_tileset', 'tiles', 32, 32, 0, 0)

    // Create the layers
    mainSceneConfig.tileMap.layers.forEach((layer) => {
      const newLayer = this.map.createLayer(layer.key, tileset, layer.x, layer.y)
      newLayer.setDepth(layer.depth)
      newLayer.setCollisionByProperty({ collides: true })
      this.matter.world.convertTilemapLayer(newLayer)
      this.layers.push(newLayer)
    })

    // Set the camera
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels + 50)
    this.cameras.main.setZoom(1.5)
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

    // Create the player
    const spawnPoint = this.spawnPoints[this.playerIndex]

    const player = createCharacter(this.playerType, this, spawnPoint.x, spawnPoint.y)
    const input = createInputHandler(this.playerType, this)

    this.playerInputHandler = input
    this.player = player
    this.player.connectionId = this.socket.connectionId
    // this.entitiesService.setPlayer(this.player)

    // Set the camera to follow the player
    this.cameras.main.startFollow(this.player)

    // Handle the other players
    const otherPlayers = store.getState().gameSession.otherPlayers

    console.log('otherPlayers', otherPlayers)
    // connectionId: "922dd00b-1a9f-4f89-be14-bc35560a6e35"
    // playerType: "knight"
    // selectedPlayerIndex: 0
    // username: "player_2"

    otherPlayers.forEach((player) => {
      const spawnPoint = this.spawnPoints[player.selectedPlayerIndex]
      const newPlayer = createCharacter(player.playerType, this, spawnPoint.x, spawnPoint.y)
      newPlayer.connectionId = player.connectionId
      newPlayer.username = player.username

      const input = createStreamedInput(player.playerType)
      this.entitiesService.addOtherPlayer(newPlayer, input)
    })

    this.socket.on(
      'updateEnemy',
      this.inputHandlerService.updateEnemyInput.bind(this.inputHandlerService)
    )
    this.socket.on('playerDisconnected', this.removePlayer.bind(this))
    this.socket.on('updatePlayer', this.updatePlayer.bind(this))
    this.socket.on('enemySpawned', this.spawnEnemy.bind(this))
    this.socket.on('spawnerTriggered', this.spawnerTriggered.bind(this))
    this.socket.on('destroyEnemy', this.destroyEnemy.bind(this))
  }

  update() {
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
    this.updateEnemies()
  }

  sendPlayerData() {
    const playerData = {
      gameSessionId: this.gameSessionId,
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
    }

    this.socket.emit('playerData', playerData)
  }

  addPlayer(playerData) {
    // Create the other player with no input handler for now
    const spawnPoint = this.spawnPoints[playerData.spawnPoint]
    const player = createCharacter(playerData.type, this, spawnPoint.x, spawnPoint.y)
    player.connectionId = playerData.connectionId

    // Create the streamed input handler for this player
    const input = createStreamedInput(playerData.type)
    this.entitiesService.addOtherPlayer(player, input)

    return player
  }

  updatePlayer(data) {
    // data = JSON.parse(data)
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

  updateEnemies() {
    // Update the enemies
    this.entitiesService.enemies.forEach(({ enemy, inputHandler }) => {
      console.log(enemy.connectionId)
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

  destroyEnemy(enemyId) {
    const { enemy } = this.entitiesService.getEnemy(enemyId)
    if (!enemy) return

    enemy.health = 0
  }

  spawnerTriggered(data) {
    const trigger = this.triggerPoints.find((trigger) => trigger.name === 'trigger_' + data)
    if (!trigger) return
    trigger.isTriggered = true
  }

  removePlayer(data) {
    const { player, inputHandler } = this.entitiesService.getOtherPlayer(data)
    player.disconnect()
  }
}
