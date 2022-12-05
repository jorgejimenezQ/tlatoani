import female_atlas from './assets/female_atlas.json'
import female_png from './assets/female.png'
import female_animJson from './assets/female_anim.json'
import PlayerInputHandler from './input/PlayerInputHandler'
import StreamInputHandler from '../input/StreamInputHandler'

const playerConfig = {
  atlas: female_atlas,
  texture: 'female',
  image: female_png,
  type: 'player',
  health: 100,
  sensorSize: 24,
  collisionSize: 12,
  attack: 1,
  moveSpeed: 2,
  // TODO: Define the item class and add here
  // this will be used to create the items the player
  // drops when they die
  dropItems: [{ item: '', itemID: '', itemAssets: '' }],
  baseWeapon: {},
  animations: {
    json: female_animJson,
    idle: 'female_idle',
    walk: 'female_walk',
    key: 'female_anim',
  },
  collisionCallbacks: {
    outer: {
      start: (data) => {
        if (!data.gameObjectB || !data.gameObjectA) return
        const { gameObjectA, gameObjectB } = data
        if (gameObjectA.type === 'player' && gameObjectB.type === 'player') return
      },
      end: (data) => {},
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
    moveCommand: StreamInputHandler.constants.MOVE_INPUT,
    flipX: StreamInputHandler.constants.FLIP_INPUT,
  },
  streamCommands: {
    flipX: function (flipped) {
      return {
        execute: (player) => {
          player.flipX = flipped
        },
      }
    },
    moveCommand: function ({ x, y }) {
      return {
        execute: (player) => {
          player.setPosition(x, y)
        },
      }
    },
  },
  commandMaps: {
    flipX: PlayerInputHandler.constants.MOUSE_MOVE,
    moveCommand: PlayerInputHandler.constants.MOVE_INPUT,
  },
  commands: {
    flipX: function (pointer) {
      return {
        execute: (player) => {
          if (player.dead) return
          player.setFlipX(pointer.worldX < player.x)
        },
      }
    },
    moveCommand: function (velocity) {
      return {
        execute: (player) => {
          // Normalize the velocity
          velocity.normalize()
          velocity.scale(player.moveSpeed)

          // Set the velocity
          player.setVelocity(velocity.x, velocity.y)
        },
      }
    },
  },
}

export default playerConfig
