import assets from '../assetTable'
const arrowConfig = {
  name: 'arrow',
  type: 'weapon',
  description: 'A simple arrow',
  texture: 'weapon',
  frame: assets.arrow,
  atlas: assets.weapons_atlas,
  image: assets.weaponsPng,
  sensorSize: 6,
  scale: 0.75,
  speed: 4,
  fixedRotation: true,
  damage: 1,
  //   offset: {
  //     x: 3,
  //     y: 7,
  //   }
}
export default arrowConfig
