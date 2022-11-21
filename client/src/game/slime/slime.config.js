import playerConfig from '../player/player.config'
import slime_atlas from './assets/slimes__atlas.json'
import slime_png from './assets/slimes_.png'
import slime_animJson from './assets/slimes__anim.json'

const slimeConfig = {
  ...playerConfig,
  atlas: slime_atlas,
  texture: 'slimes_',
  image: slime_png,
  health: 10,
  moveSpeed: 1,
  animations: {
    json: slime_animJson,
    idle: 'slime_idle',
    walk: 'slime_walk',
    key: 'slime_anim',
    firstFrame: 'slime_walk_f0',
  },
}

export default slimeConfig
