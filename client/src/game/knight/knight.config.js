import Phaser from 'phaser'
import playerConfig from '../player/player.config'
import knight_atlas from './assets/knight_atlas.json'
import knight_png from './assets/knight.png'
import knight_animJson from './assets/knight_anim.json'

const knightConfig = {
  ...playerConfig,
  atlas: knight_atlas,
  texture: 'knight',
  image: knight_png,
  health: 100,
  moveSpeed: 1.5,
  animations: {
    json: knight_animJson,
    idle: 'knight_idle',
    walk: 'knight_walk',
    key: 'knight_anim',
    firstFrame: 'knight_f_idle_anim_f0',
  },
  commands: {
    moveCommand: playerConfig.commands.moveCommand,
    attackCommand: function (pointer) {
      return {
        execute: (player) => {
          // console.log(player.sword.rotation)
          // console.log(Phaser.Math.RadToDeg(player.sword.rotation))
          // // player.sword.rotation += Phase.Math. player.sword.rotationSpeed
          // player.sword.rotation += Phaser.Math.DegToRad(player.sword.rotationSpeed)
          // if (player.sword.rotation > Phaser.Math.DegToRad(250)) {
          //   player.sword.rotation = 0
          // }
          player.sword.setSwing(true)
        },
      }
    },
    resetSword: function (pointer) {
      return {
        execute: (player) => {
          // // player.sword.rotation += Phase.Math. player.sword.rotationSpeed
          // player.sword.rotation += Phaser.Math.DegToRad(player.sword.rotationSpeed)
          // if (player.sword.rotation > 360) {
          //   player.sword.rotation = 0
          // }
        },
      }
    },
  },
}

export default knightConfig
