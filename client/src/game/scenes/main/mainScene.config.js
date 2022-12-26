import map from './assets/map-1.json'
import mapTileset from './assets/map_tileset.png'

const config = {
  key: 'main',
  background: {},
  tileMap: {
    key: 'map',
    mapJson: map,
    mapTileset: mapTileset,
    mapScale: 2,
    layers: [
      { key: 'Tile Layer 1', depth: 0, x: 0, y: 0 },
      { key: 'Tile Layer 2', depth: 1, x: 0, y: 0 },
      { key: 'Tile Layer 3', depth: 2, x: 0, y: 0 },
    ],
  },
}

export default config
