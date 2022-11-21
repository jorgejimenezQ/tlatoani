import Item from '../../item/Item'
import arrowConfig from './arrow.config'

export default class StaticArrow extends Item {
  static config = arrowConfig
  constructor(config) {
    super({ ...config, ...StaticArrow.config })
  }
}
