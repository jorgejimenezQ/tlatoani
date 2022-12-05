import assets from '../assetTable'

const bowConfig = {
  name: 'bow',
  type: 'weapon',
  description: 'A bow and arrow',
  texture: 'weapon',
  frame: assets.bow,
  atlas: assets.weapons_atlas,
  image: assets.weaponsPng,
  sensorSize: 6,
  scale: 0.75,
  // TODO: factor in the archer's speed
  fireRate: 1000,
  offset: {
    x: 2,
    y: 7,
  },
}

export default bowConfig
