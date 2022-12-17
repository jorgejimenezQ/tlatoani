import React, { useCallback, useEffect, useState } from 'react'
import Phaser from 'phaser'
import gameConfig from './game.config'
import socket from './connection/connect'

const Game = () => {
  const [newGame, setNewGame] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (socket.connected) setIsConnected(true)
  }, [isConnected, newGame])

  const startGame = useCallback(() => {
    new Phaser.Game(gameConfig)
  }, [])

  const onFindSession = (e) => {
    e.preventDefault()
    console.log('start game')
  }

  const onNewSession = (e) => {
    e.preventDefault()

    setNewGame(true)

    socket.emit('createSession', { username: 'test' })
  }

  return (
    <>
      <div id='game-content' />
      <form className='start_game_form'>
        <label>Username</label>
        <input type='text' name='username' />
        <label>Game ID</label>
        <input type='text' name='gameId' />
        <div className='button_horizontal'>
          <button onClick={onFindSession}>Find Session</button>
          <button onClick={onNewSession}>New Session</button>
        </div>
      </form>
    </>
  )
}

export default Game
