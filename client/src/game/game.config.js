import Phaser from 'phaser'
import matterPlugin from 'phaser-matter-collision-plugin'
import AwaitLoaderPlugin from 'phaser3-rex-plugins/plugins/awaitloader-plugin.js'
import BootScene from './scenes/boot/BootScene'
import MenuScene from './scenes/menu/MenuScene'
import LoadScene from './scenes/load/LoadScene'
import PlayerSelect from './scenes/playerSelect/PlayerSelect'

const gameConfig = {
  type: Phaser.AUTO,
  width: 900,
  height: 650,
  parent: 'game-content',
  scene: [LoadScene, MenuScene, PlayerSelect],
  //   scene: [BootScene],
  // scale: {
  //   mode: Phaser.Scale.FIT,
  //   autoCenter: Phaser.Scale.CENTER_BOTH,
  // },
  backgroundColor: '#000000',
  physics: {
    default: 'matter',
    matter: {
      gravity: {
        y: 0,
      },
      debug: true,
    },
  },
  plugins: {
    global: [
      {
        key: 'rexAwaitLoader',
        plugin: AwaitLoaderPlugin,
        start: true,
      },
    ],
    scene: [
      {
        plugin: matterPlugin, // The plugin class
        key: 'matterCollision', // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
        mapping: 'matterCollision', // Where to store in the Scene, e.g. scene.matterCollision
      },
    ],
  },
}

export default gameConfig
