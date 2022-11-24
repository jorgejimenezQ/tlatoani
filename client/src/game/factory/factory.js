import Player from '../player/Player'
import Slime from '../slime/Slime'
import Knight from '../knight/Knight'
import Archer from '../archer/Archer'

// input handlers
import KnightInputHandler from '../knight/input/KnightInputHandler'
import ArcherInputHandler from '../archer/input/ArcherInputHandler'
import PlayerInputHandler from '../player/input/PlayerInputHandler'

const characterTypes = {
  player: { class: Player, config: Player.config, inputHandler: PlayerInputHandler },
  slime: { class: Slime, config: Slime.config, inputHandler: PlayerInputHandler },
  knight: { class: Knight, config: Knight.config, inputHandler: KnightInputHandler },
  archer: { class: Archer, config: Archer.config, inputHandler: ArcherInputHandler },
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

  // Set each command
  //TODO: This could be dynamic somehow so we don't have to set each command.
  const moveCommand = characterTypes[type].config.commands.moveCommand
  const attackCommand = characterTypes[type].config.commands.attackCommand
  const flipXCommand = characterTypes[type].config.commands.flipX
  const weaponCommand = characterTypes[type].config.commands.weaponCommand

  if (moveCommand) inputHandler.setMoveCommand(moveCommand)
  if (attackCommand) inputHandler.setPointerDownCommand(attackCommand)
  if (flipXCommand) inputHandler.setMouseMoveInput(flipXCommand)
  if (weaponCommand) inputHandler.setMouseMoveInput(weaponCommand)

  return inputHandler
}

export { createCharacter, createInputHandler }
