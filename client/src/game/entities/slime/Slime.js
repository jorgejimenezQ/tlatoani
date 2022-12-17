import Player from '../player/Player.js'
import slimeConfig from './slime.config.js'

export default class Slime extends Player {
  static config = slimeConfig
  constructor(config) {
    config.useConfig = Slime.config
    super(config)
  }
}
