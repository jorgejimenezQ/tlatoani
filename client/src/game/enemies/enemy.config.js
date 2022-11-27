import big_zombie_atlas from './assets/big_zombie_atlas.json'
import big_zombie_animJson from './assets/big_zombie_anim.json'
import big_zombie_png from './assets/big_zombie.png'

const enemyConfig = {
  atlas: big_zombie_atlas,
  texture: 'big_zombie',
  image: big_zombie_png,
  type: 'enemy',
  health: 100,
  sensorSize: 100,
  collisionSize: 12,
  attack: 1,
  moveSpeed: 2,
  dropItems: [{ item: '', itemID: '', itemAssets: '' }],
  baseWeapon: {},
  animations: {
    json: big_zombie_animJson,
    idle: 'zombie_idle',
    walk: 'zombie_walk',
    key: 'bi_zombie_anim',
  },
  collisionCallbacks: {
    outer: {
      start: (data) => {
        // Get the characters involved
        const enemy = data.gameObjectA
        const other = data.gameObjectB

        // If the other character is not a player, return
        if (other.type !== 'player') return
        if (data.bodyB.isSensor) return

        // Set the enemy as the target
        enemy.targets = other
      },
      end: (data) => {
        if (!data.gameObjectA || !data.gameObjectB) return

        // Get the characters involved
        const enemy = data.gameObjectA
        const other = data.gameObjectB

        // If the other character is not a player, return
        if (other.type !== 'player') return
        if (data.bodyB.isSensor) return

        // Remove the target
        enemy.removeTarget(other)
      },
    },
    inner: {
      start: (data) => {},
      end: (data) => {},
    },
  },
  commands: {
    flipX: function (flipped) {
      return {
        execute: (enemy) => {
          enemy.flipX = flipped
        },
      }
    },
    attackCommand: function (data) {
      return {
        execute: () => {},
      }
    },
  },
}

export default enemyConfig
