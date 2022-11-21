import assets from '../assetTable'
import baseWeaponConfig from '../weaponBase.config'

const animeSwordConfig = {
  ...baseWeaponConfig,
  frame: assets.animeSword,
  rotationSpeed: 6,
  rotation: 130,
  damage: 5,
}

export default animeSwordConfig
