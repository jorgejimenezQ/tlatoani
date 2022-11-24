import assets from './assetTable'

const baseWeaponConfig = {
  name: 'base',
  type: 'weapon',
  description: 'A base weapon configuration',
  texture: 'weapon',
  sensorSize: 1,
  collisionSize: null,
  scale: 0.8,
  speed: 3,

  fixedRotation: true,
  damage: 1,
  depth: 2,
  rotation: -90,
  originOffset: { x: 1, y: 1 },
  // offset: {
  //   x: -15,
  //   y: 7,
  // },
}

export default baseWeaponConfig
