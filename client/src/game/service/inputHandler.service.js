export default class InputHandlerService {
  entitiesService = null
  constructor(entitiesService) {
    this.entitiesService = entitiesService
  }

  updateEnemyInput(data) {
    const { enemy, inputHandler } = this.entitiesService.getEnemy(data.enemy.connectionId)

    // TODO: Should we emit to the server to remove the enemy if we don't have a reference to it?
    if (!enemy) return

    // FlipX
    inputHandler.flipX = data.flipX

    // Target
    inputHandler.target = data.currentTarget
  }
}
