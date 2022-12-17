import playerConfig from '../player/player.config'
import knight_atlas from './assets/knight_atlas.json'
import knight_png from './assets/knight.png'
import knight_animJson from './assets/knight_anim.json'
import PlayerInputHandler from '../player/input/PlayerInputHandler'
import StreamInputHandler from '../../input/StreamInputHandler'

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
  collisionCallbacks: {
    outer: {
      start: (data) => {
        if (!data.gameObjectB || !data.gameObjectA) return
        const { gameObjectA, gameObjectB, bodyB } = data
        if (gameObjectB.type === 'player' || gameObjectB.dead || bodyB.isSensor) return

        // TODO: Calculate the distance between the player and enemy
        if (gameObjectB.type === 'enemy' && !gameObjectA.sword.currentTarget) {
          gameObjectA.sword.currentTarget = gameObjectB
        }
      },
      end: (data) => {
        if (!data.gameObjectB || !data.gameObjectA) return
        const { gameObjectA, gameObjectB } = data
        if (gameObjectA.type === 'player' && gameObjectB.type === 'player') return

        if (gameObjectB.type === 'enemy' && gameObjectA.sword.currentTarget) {
          gameObjectA.sword.currentTarget = null
        }
      },
    },
    inner: {
      start: (data) => {
        const { bodyB, gameObjectA, gameObjectB } = data

        if (!bodyB.isSensor && gameObjectA.type === 'player' && gameObjectB.type === 'player')
          return
        // console.log('inner: ', data)
      },
      end: (data) => {},
    },
  },
  streamCommandMaps: {
    ...playerConfig.streamCommandMaps,
    attackCommand: StreamInputHandler.constants.ATTACK_INPUT,
  },
  streamCommands: {
    ...playerConfig.streamCommands,
    attackCommand: function () {
      return {
        execute: (knight) => {
          knight.sword.setSwing(true)
        },
      }
    },
  },
  commandMaps: {
    ...playerConfig.commandMaps,
    attackCommand: PlayerInputHandler.constants.POINTER_DOWN,
  },
  commands: {
    ...playerConfig.commands,
    // moveCommand: playerConfig.commands.moveCommand,
    attackCommand: function (pointer) {
      return {
        execute: (knight) => {
          knight.sword.setSwing(true)
        },
      }
    },
    // resetSword: function (pointer) {
    //   return {
    //     execute: (player) => {
    //       // // player.sword.rotation += Phase.Math. player.sword.rotationSpeed
    //       // player.sword.rotation += Phaser.Math.DegToRad(player.sword.rotationSpeed)
    //       // if (player.sword.rotation > 360) {
    //       //   player.sword.rotation = 0
    //       // }
    //     },
    //   }
    // },
  },
}

export default knightConfig
