import PlayerSelectBG from './assets/Castle Tower.png'
import knightConfig from '../../entities/knight/knight.config'
import archerConfig from '../../entities/archer/archer.config'
import slimeConfig from '../../entities/slime/slime.config'

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
    // slime: {
    //   config: slimeConfig,
    //   text: 'Slime',
    // },
    // mage: {},
    // elf: {},
  },
}

config.playerLimit = Object.keys(config.players).length

export default config
