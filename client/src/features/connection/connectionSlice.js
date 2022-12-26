import { createSlice } from '@reduxjs/toolkit'

/**
 *
 * The connection slice of the redux store. This slice is responsible for
 * storing the connection object, which contains the connectionId and
 * the connectionName.
 *
 * The connectionId is the unique identifier for the connection.
 */

const initialState = {
  connectionId: null,
}

const connectionSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    setConnection: (state, action) => {
      state.connectionId = action.payload
    },
  },
})

export default connectionSlice.reducer
export const { setConnection } = connectionSlice.actions
