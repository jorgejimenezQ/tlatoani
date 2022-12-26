import Phaser from 'phaser'

// Scenes
import sceneKeys from '../keys/sceneKeys'
import assets from './loadScene.config'
import menuSceneConfig from '../menu/menuScene.config'
import playerSelectSceneConfig from '../playerSelect/playerSelectScene.config'

// Characters
import Player from '../../entities/player/Player'
import Archer from '../../entities/archer/Archer'
import Slime from '../../entities/slime/Slime'
import Knight from '../../entities/knight/Knight'

// Character Factory
// import { createCharacter, createInputHandler, createStreamedInput } from '../../factory/factory'

// Items
import Bow from '../../entities/weapons/bow/Bow'

// Multiplayer stuff
// import socket from '../../connection/connect'
// import EntitiesService from '../../service/entitiesStorage.service'
// import SocketConnection from '../../connection/connect'
import socket from '../../connection/connect'
import Enemy from '../../entities/enemies/Enemy'
import mainSceneConfig from '../main/mainScene.config'
// import InputHandler from '../../input/InputHandler'
// import InputHandlerService from '../../service/inputHandler.service'

export default class LoadScene extends Phaser.Scene {
  constructor() {
    super({ key: sceneKeys.LOAD })
    // const socketConn = new SocketConnection()
    // socketConn.connect()
    // this.socket = socketConn.getSocket()
  }

  init() {
    // All the plugins installed with phaser are:
    // this.events
    // this.cameras
    // this.add
    // this.add
    // this.make
    // this.scene

    // this.children
    // this.sys.updateList

    // this.time
    // this.data
    // this.input
    // this.load
    // this.tweens
    // this.lights
    console.log('LoadScene init')
  }

  preload() {
    // Using rexAwait to wait for the socket to connect before running the create method and starting the next scene
    // this.load.rexAwait((successCallback, failureCallback) => {
    //   console.log('inside the rexAwait')

    //   new Promise((resolve, reject) => {
    //     if (!this.socket) return reject()

    //     this.socket.on('connect', () => {
    //       console.log('connected to server')
    //       resolve()
    //     })
    //   })
    //     .then(() => {
    //       console.log('connected')
    //       successCallback()
    //     })
    //     .catch(() => {
    //       console.log('not connected')
    //       failureCallback()
    //     })
    // })

    console.log('after the rexAwait')
    // this.load.image('logo', logo)
    // Load backgrounds
    this.load.image(menuSceneConfig.background.key, menuSceneConfig.background.image)
    this.load.image(
      playerSelectSceneConfig.background.key,
      playerSelectSceneConfig.background.image
    )

    // Load the map tileset
    this.load.image('tiles', assets.mapTileset)

    // Load the map
    console.log(mainSceneConfig)
    this.load.tilemapTiledJSON(mainSceneConfig.tileMap.key, assets.mapJson)

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

    console.log('end of preload')
    // Loading process
    const loadingBorder = this.add
      .graphics({
        lineStyle: {
          width: 10,
          color: 0xffffff,
        },
      })
      .setDepth(2)

    const loadingBar = this.add.graphics({
      fillStyle: {
        color: 0xff0000,
      },
    })
    const width = this.cameras.main.width
    const height = 50
    const x = 20
    const y = this.cameras.main.height / 2 - 50
    const loadingText = this.add.text(20, this.cameras.main.height / 2 - 100, 'Loading...', {
      font: '20px monospace',
      fill: '#ffffff',
    })
    loadingBorder.strokeRect(x, y, width - 20, height)
    this.load.on('progress', (value) => {
      // Display the progress value
      loadingText.setText(`Loading... ${parseInt(value * 100)}%`)
      loadingBar.fillRect(x, y, (width - 20) * value, height)
    })
    const fileText = this.add.text(20, this.cameras.main.height / 2 + 50, '', {
      font: '20px monospace',
      fill: '#ffffff',
    })

    // Add the name of the file being loaded
    this.load.on('fileprogress', (file) => {
      fileText.setText(`Loading asset: ${file.key}`)
    })
  }

  create() {
    this.scene.start(menuSceneConfig.key, { socket })
  }
}
