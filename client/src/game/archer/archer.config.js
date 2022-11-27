import archer_anim from './assets/archer_anim.json'
import archer_atlas from './assets/archer_atlas.json'
import archer_png from './assets/archer.png'
import playerConfig from '../player/player.config'
import Phaser from 'phaser'
import PlayerInputHandler from '../player/input/PlayerInputHandler'
import StreamInputHandler from '../input/StreamInputHandler'
import ArcherStreamInputHandler from './input/ArcherStreamInputHandler'

const archerConfig = {
  atlas: archer_atlas,
  texture: 'archer',
  image: archer_png,
  type: 'player',
  health: 100,
  sensorSize: 24,
  collisionSize: 12,
  attack: 1,
  moveSpeed: 2.2,
  hasProjectiles: true,
  offset: {
    x: 0,
    y: 0.7,
  },
  bodyOffset: {
    x: 0,
    y: -9,
  },
  animations: {
    json: archer_anim,
    idle: 'archer_idle',
    walk: 'archer_walk',
    key: 'archer_anim',
    firstFrame: 'archer_idle_1',
  },
  collisionCallbacks: {
    ...playerConfig.collisionCallbacks,
  },
  streamCommandMaps: {
    ...playerConfig.streamCommandMaps,
    attackCommand: StreamInputHandler.constants.ATTACK_INPUT,
    rotateWeaponCommand: ArcherStreamInputHandler.constants.ROTATE_WEAPON_INPUT,
  },
  streamCommands: {
    ...playerConfig.streamCommands,
    rotateWeaponCommand: function (rotation) {
      return {
        execute: (archer) => {
          archer.currentWeapon.bow.rotation = rotation
          // archer.currentWeapon.rotation = rotation
        },
      }
    },
  },
  commandMaps: {
    ...playerConfig.commandMaps,
    weaponCommand: PlayerInputHandler.constants.MOUSE_MOVE,
    attackCommand: PlayerInputHandler.constants.POINTER_DOWN,
  },

  commands: {
    ...playerConfig.commands,
    // moveCommand: playerConfig.commands.moveCommand,
    weaponCommand: function (pointer) {
      return {
        execute: (player) => {
          // console.log('weaponCommand', pointer)
          player.currentWeapon.bow.rotation = Phaser.Math.Angle.Between(
            player.x,
            player.y,
            player.scene.input.activePointer.worldX,
            player.scene.input.activePointer.worldY
          )
        },
      }
    },
    attackCommand: function (pointer) {
      // console.log('attack command on archer config')
      const Arrow = require('../weapons/arrow/Arrow').default
      const Bow = require('../weapons/bow/Bow').default
      return {
        execute: (player) => {
          if (player.dead) return
          if (player.arrowShot) return
          if (player.arrow) return
          if (!player.shootingTimeHasPassed) return

          // Create a timer to limit the shooting rate
          player.scene.time.addEvent({
            delay: player.fireRate,
            callback: () => {
              player.shootingTimeHasPassed = true
            },
          })

          player.shootingTimeHasPassed = false
          player.arrowShot = true

          // create a new arrow
          player.arrow = new Arrow({
            scene: player.scene,
            x: player.x + Bow.config.offset.x,
            y: player.y + Bow.config.offset.y,
            texture: 'arrow',
            frame: 'arrow',
            mouseX: pointer.worldX,
            mouseY: pointer.worldY,
          })

          // subscribe to the arrow hit event
          player.arrow.events.on(
            'killArrow',
            () => {
              player.arrowShot = false
              player.arrow = null
            },
            player
          )
        },
      }
    },
  },
}

archerConfig.streamCommands.attackCommand = archerConfig.commands.attackCommand

export default archerConfig
