import Phaser from 'phaser'
import playerSelectConfig from './playerSelectScene.config'
import SimpleButton from '../../simpleButton/SimpleButton'

export default class PlayerSelect extends Phaser.Scene {
  selectBtnY = 250
  selectBtnX = 100
  selectorX = 50
  selectBtnMargin = 100

  textX = 50
  textY = 100

  constructor() {
    super({ key: playerSelectConfig.key })
    this.socket = null
    this.player = null
    this.selected = null
    this.confirmBtn = null
    this.playerBtns = []
    this.prompt = null
  }

  init({ socket }) {
    this.socket = socket
  }

  create() {
    // Add background
    this.add.image(0, 0, playerSelectConfig.background.key).setScale(0.7).setOrigin(0, 0)
    // Add a rectangle that covers the whole screen
    this.add.rectangle(0, 0, 1200, 900, 0x000000, 0.3).setOrigin(0, 0)
    const knight = playerSelectConfig.players.knight.config

    // Add "Select your character" this.text in white with transparent background
    this.prompt = this.add.text(50, 100, 'Select your character', {
      fontSize: '64px',
    })

    const playerKeys = Object.keys(playerSelectConfig.players)
    playerKeys.forEach((key, index) => {
      const btnWidth = 180
      const btnHeight = 50
      // Add a button for each character
      this.playerBtns.push(
        new SimpleButton(
          this,
          this.selectBtnX,
          this.selectBtnY + index * this.selectBtnMargin,
          btnWidth,
          btnHeight,
          playerSelectConfig.players[key].text,
          { fontSize: '32px', fill: '#ffffff' },
          () => this.selectPlayer(index)
        )
      )
    })

    // Add a confirm button
    const btnW = 180
    const btnH = 50
    const btnX = 500
    const btnY = 300
    this.confirmBtn = new SimpleButton(
      this,
      btnX,
      btnY,
      btnW,
      btnH,
      'Confirm',
      { fontSize: '32px', fill: '#ffffff' },
      this.confirmClick.bind(this)
    )

    this.socket.emit('getOtherPlayers', (otherPlayers) => {
      const otherPlayerIds = Object.keys(otherPlayers)
      console.log(otherPlayers)
      otherPlayerIds.forEach((id) => {
        if (otherPlayers[id].selectedPlayerIndex !== null && id !== this.socket.connectionId) {
          this.selectOtherPlayer(otherPlayers[id].selectedPlayerIndex)
        }
      })
    })

    this.socket.on('startGame', () => {
      const startBtnX = 500
      const startBtnY = 400
      const startBtnW = 220
      const startBtnH = 50

      new SimpleButton(
        this,
        startBtnX,
        startBtnY,
        startBtnW,
        startBtnH,
        'Start Game',
        { fontSize: '32px', fill: '#ffffff' },
        () => this.startGame.bind(this)
      )
    })

    this.socket.on('otherPlayerSelected', (data) => {
      this.selectOtherPlayer(data.selectedPlayerIndex)
    })
  }

  update() {}

  confirmClick() {
    console.log(this.player)
    if (this.player == null) return

    this.socket.emit('playerSelect', {
      selectedPlayer: this.player,
      connectionId: this.socket.connectionId,
    })
    this.confirmBtn.hide()

    // Changed the prompt to "Waiting for other player..."
    this.prompt.setText('Waiting for other players...').setFontSize(32)

    // Disable the other buttons
    this.playerBtns.forEach((btn, index) => {
      if (index !== this.player) btn.disable()
    })

    // this.scene.start('game')
  }

  selectPlayer(index, color = 0x00ff00) {
    const x = 80

    if (!this.selected)
      this.selected = this.add.circle(x, this.getSelectedPosition(index), 10, color, 1)
    else this.selected.setPosition(x, this.getSelectedPosition(index))

    this.player = index
  }

  selectOtherPlayer(index, color = 0xff0000) {
    // Put a red circle on the selected player
    const x = 80
    const y = this.selectBtnY + index * this.selectBtnMargin + 25

    this.add.circle(x, y, 10, 0xff0000, 1)

    // Disable the button for the selected player
    this.playerBtns[index].disable()
  }

  getSelectedPosition(index) {
    return this.selectBtnY + index * this.selectBtnMargin + 25
  }

  startGame() {
    this.scene.start('game')
  }
}
