import female_atlas from './assets/female_atlas.json'
import female_png from './assets/female.png'
import female_animJson from './assets/female_anim.json'

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
  commands: {
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
