export default class Game {
  players = {}
  playerTypes = ['archer', 'knight']
  numPlayers = 0
  socket = null

  // playerTypes = ['archer', 'knight', 'slime']
  // playerTypes = ['archer']
  // playerTypes = ['knight']
  spawner = null
  session
  constructor(session, socket) {
    this.session = session
    this.socket = socket
  }

  addPlayer(playerConnectionId) {
    // this.players.push(player)
  }

  gameFull() {
    const numPlayers = Object.keys(this.players).length
    return numPlayers >= this.playerTypes.length
  }
}
