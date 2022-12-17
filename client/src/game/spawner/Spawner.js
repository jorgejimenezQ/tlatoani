export default class Spawner {
  //TODO: Finish implementing
  constructor(Prototype) {
    this.Prototype = Prototype
    this.instances = []
  }

  spawn(config) {
    const instance = new this.Prototype(config)
    this.instances.push(instance)
    return instance
  }
}
