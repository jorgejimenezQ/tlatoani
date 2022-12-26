import { createSlice } from '@reduxjs/toolkit'

/**
 * The gameSession slice of the redux store. This slice is responsible for
 * storing the gameSession object, which contains the gameSessionId and
 * the gameSessionName.
 */

const initialState = {
  gameSessionId: null,
  username: null,
  playerType: null,
  playerIndex: null,
  isHost: false,
  /**
   * { connectionId, username, playerType, selectedPlayerIndex }
   */
  otherPlayers: [],
}

const gameSessionSlice = createSlice({
  name: 'gameSession',
  initialState,
  reducers: {
    setGameSession: (state, action) => {
      console.log(action.payload)
      const { session, isHost } = action.payload
      state.gameSessionId = session
      state.isHost = isHost
    },
    updateUsername: (state, action) => {
      state.username = action.payload
    },
    setPlayerType: (state, action) => {
      state.playerType = action.payload
    },
    setPlayerIndex: (state, action) => {
      state.playerIndex = action.payload
    },
    addPlayer: (state, action) => {
      state.otherPlayers.push(action.payload)
    },
  },
})

export default gameSessionSlice.reducer
export const { setGameSession, updateUsername, setPlayerType, setPlayerIndex, addPlayer } =
  gameSessionSlice.actions
