import Player from '../entities/player/Player'
import Slime from '../entities/slime/Slime'
import Knight from '../entities/knight/Knight'
import Archer from '../entities/archer/Archer'
import Enemy from '../entities/enemies/Enemy'

// input handlers
import KnightInputHandler from '../entities/knight/input/KnightInputHandler'
import ArcherInputHandler from '../entities/archer/input/ArcherInputHandler'
import PlayerInputHandler from '../entities/player/input/PlayerInputHandler'
import StreamInputHandler from '../input/StreamInputHandler'
import ArcherStreamInputHandler from '../entities/archer/input/ArcherStreamInputHandler'
import EnemyInputHandler from '../entities/enemies/input/EnemyInput'

const characterTypes = {
  player: { class: Player, config: Player.config, inputHandler: PlayerInputHandler },
  slime: { class: Slime, config: Slime.config, inputHandler: PlayerInputHandler },
  knight: { class: Knight, config: Knight.config, inputHandler: KnightInputHandler },
  archer: {
    class: Archer,
    config: Archer.config,
    inputHandler: ArcherInputHandler,
    streamInputHandler: ArcherStreamInputHandler,
  },
  enemy: {
    class: Enemy,
    config: Enemy.config,
    inputHandler: EnemyInputHandler,
  },
}

const createCharacter = (type, scene, x, y) => {
  // Create the character
  const character = new characterTypes[type].class({
    scene,
    name: type,
    x,
    y,
    texture: characterTypes[type].config.texture,
    frame: characterTypes[type].config.animations.firstFrame,
  })

  return character
}

const createInputHandler = (type, scene) => {
  // console.log(characterTypes[type])
  // Input handler
  const inputHandler = new characterTypes[type].inputHandler(scene.input)
  const config = characterTypes[type].config

  const commandsKeys = Object.keys(config.commands)
  commandsKeys.forEach((key) => {
    const command = config.commands[key]
    inputHandler.setCommand(config.commandMaps[key], command)
  })
  return inputHandler
}

const createStreamedInput = (type) => {
  const inputClass = characterTypes[type].streamInputHandler || StreamInputHandler
  const config = characterTypes[type].config
  const inputHandler = new inputClass()

  const commandsKeys = Object.keys(config.streamCommands)
  commandsKeys.forEach((key) => {
    console.log('Created stream command: ', key)
    const command = config.streamCommands[key]
    inputHandler.setCommand(config.streamCommandMaps[key], command)
  })

  return inputHandler
}

export { createCharacter, createInputHandler, createStreamedInput }
