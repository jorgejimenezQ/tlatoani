import Phaser from 'phaser'

export default class SimpleButton extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, width, height, text, style, callback) {
    super(scene, x, y, width, height, 0x000000, 0.5)
    this.setOrigin(0, 0)
    this.setDepth(1)
    this.setInteractive({ useHandCursor: true })

    this.on('pointerdown', callback)
    this.on('pointerover', this.buttonHover.bind(this))
    this.on('pointerout', this.buttonOut.bind(this))

    this.scene.add.existing(this)
    this.text = this.scene.add
      .text(x + width / 2, y + height / 2, text, style)
      .setOrigin(0.5, 0.5)
      .setDepth(1)
  }

  buttonHover() {
    this.setFillStyle(0x000000, 0.8)
  }

  buttonOut() {
    this.setFillStyle(0x000000, 0.5)
  }

  hide() {
    this.setVisible(false)
    this.text.setVisible(false)
  }

  show() {
    this.setVisible(true)
    this.text.setVisible(true)
  }

  disable() {
    this.removeInteractive()
    this.text.removeInteractive()
    this.setFillStyle(0x000000, 0.2)
  }
}
