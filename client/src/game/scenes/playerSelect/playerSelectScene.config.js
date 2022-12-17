import PlayerSelectBG from './assets/Castle Tower.png'
import knightConfig from '../../entities/knight/knight.config'
import archerConfig from '../../entities/archer/archer.config'

const config = {
  key: 'playerSelect',
  background: {
    key: 'playerSelectBG',
    image: PlayerSelectBG,
  },
  players: {
    knight: {
      config: knightConfig,
      text: 'Knight',
    },
    archer: {
      config: archerConfig,
      text: 'Archer',
    },
    // slime: {},
    // mage: {},
    // elf: {},
  },
}

export default config
