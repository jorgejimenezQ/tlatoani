import React from 'react'

import Phaser from 'phaser'
import matterPlugin from 'phaser-matter-collision-plugin'
import BootScene from './scenes/boot/BootScene'

import socket from './connection/connect'

const Game = () => {
  const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 300,
    parent: 'game-content',
    backgroundColor: '#000000',
    scene: [BootScene],
    scale: {
      zoom: 2,
    },
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
      scene: [
        {
          plugin: matterPlugin, // The plugin class
          key: 'matterCollision', // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
          mapping: 'matterCollision', // Where to store in the Scene, e.g. scene.matterCollision
        },
      ],
    },
  }

  new Phaser.Game(config)
  return <div id='game-content' />
}

export default Game
