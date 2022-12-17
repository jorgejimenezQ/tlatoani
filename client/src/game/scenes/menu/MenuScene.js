import Phaser from 'phaser'
import menuSceneConfig from './menuScene.config'
import playerSelectConfig from '../playerSelect/playerSelectScene.config'

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: menuSceneConfig.key })
    this.button = null
    this.text = null
    this.socket = null
  }
  init(data) {
    this.socket = data.socket
  }

  create() {
    this.add.image(0, 0, menuSceneConfig.background.key).setScale(0.7).setOrigin(0, 0)
    // Add "TLATOANI" this.text in black
    this.add.text(100, 100, 'TLATOANI', { fontSize: '64px', fill: '#000' })
    this.button = this.add
      .rectangle(100, 200, 180, 50, '#0000ff')
      .setOrigin(0)
      .setInteractive({ useHandCursor: true })

    // add this.text to the this.button
    this.text = this.add
      .text(140, 210, 'Start', { fontSize: '32px', fill: '#ffffff' })
      .setOrigin(0)
      .setInteractive({ useHandCursor: true })

    this.button.setStrokeStyle(2, 0x000000)

    this.button.on('pointerover', this.buttonHover.bind(this))
    this.button.on('pointerout', this.buttonOut.bind(this))
    this.button.on('pointerdown', this.buttonClick.bind(this))
    this.text.on('pointerover', this.buttonHover.bind(this))
    this.text.on('pointerout', this.buttonOut.bind(this))
    this.text.on('pointerdown', this.buttonClick.bind(this))
  }

  buttonHover() {
    this.button.setFillStyle(0x0000ff, 0.5)
  }

  buttonOut() {
    this.button.setFillStyle(0x000000, 1)
  }

  buttonClick() {
    // Start the player select scene
    this.scene.start(playerSelectConfig.key, { socket: this.socket })
  }
}
