import React, { useCallback, useEffect, useState } from 'react'
import Phaser from 'phaser'
import gameConfig from './game.config'
import socket from './connection/connect'
import { useSelector, useDispatch } from 'react-redux'
import { setGameSession, updateUsername } from '../features/gameSession/gameSessionSlice'
import { setConnection } from '../features/connection/connectionSlice'
import playerSelectSceneConfig from './scenes/playerSelect/playerSelectScene.config'

const Game = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [username, setUsername] = useState('')
  const [gameStarted, setGameStarted] = useState(false)
  const otherPlayers = useSelector((state) => state.gameSession.otherPlayers)

  const currentGameSession = useSelector((state) => state.gameSession.gameSessionId)

  const dispatch = useDispatch()

  useEffect(() => {
    if (socket.connected) setIsConnected(true)
    dispatch(setConnection(socket.connectionId))
  }, [isConnected])

  const onJoinGame = (e) => {
    e.preventDefault()

    if (username === '') {
      console.log('Please enter a username')
      return
    }

    const playerLimit = playerSelectSceneConfig.playerLimit

    socket.emit('joinSession', username, playerLimit, (response) => {
      setGameStarted(true)
      dispatch(setGameSession({ session: response.session, isHost: response.isHost }))
      new Phaser.Game(gameConfig)
    })
    dispatch(updateUsername(username))
  }

  return (
    <>
      <div id='game-content' />
      <form className={'start_game_form ' + (gameStarted ? 'hidden' : '')}>
        {/* <h1>{username}</h1> */}
        <label>Username</label>
        <input
          type='text'
          name='username'
          onChange={(e) => {
            setUsername(e.target.value)
          }}
        />
        <div className='button_horizontal'>
          <button onClick={onJoinGame} disabled={gameStarted}>
            Join Game
          </button>
        </div>
      </form>
      <div style={{ color: 'white' }}>
        <h2>The Other Players</h2>
        {otherPlayers.map((player) => {
          return <p key={player.connectionId}>{player.username + ' - ' + player.playerType}</p>
        })}
      </div>
    </>
  )
}

export default Game
