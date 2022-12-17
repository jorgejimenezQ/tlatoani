export default class Spawner {
  spawnRate = 1
  isActive = false
  limit = 5
  quantity = 0
  // Holds the timer for the spawner
  timer = null

  constructor() {}

  deactivate() {
    this.isActive = false
    // stop spawning enemies
    clearInterval(this.timer)
  }

  activate(callback) {
    // start spawning enemies
    if (this.isActive) return
    this.isActive = true

    // Spawn an enemy every spawnRate seconds
    this.timer = setInterval(() => {
      if (this.quantity >= this.limit) {
        this.deactivate()
        return
      }
      callback()
      this.quantity++
    }, this.spawnRate * 1000)
  }
}
