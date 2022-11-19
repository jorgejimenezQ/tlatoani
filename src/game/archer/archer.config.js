import archer_anim from './assets/archer_anim.json'
import archer_atlas from './assets/archer_atlas.json'
import archer_png from './assets/archer.png'
import playerConfig from '../player/player.config'

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
  },
  commands: {
    moveCommand: playerConfig.commands.moveCommand,
    attackCommand: function (pointer) {
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

export default archerConfig
