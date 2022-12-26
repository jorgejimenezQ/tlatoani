import { configureStore } from '@reduxjs/toolkit'
import gameSessionReducer from '../features/gameSession/gameSessionSlice'
import connectionReducer from '../features/connection/connectionSlice'

export default configureStore({
  reducer: {
    gameSession: gameSessionReducer,
    connection: connectionReducer,
  },
})
