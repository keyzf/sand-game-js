// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

/**
 *
 * @author Patrik Harag
 * @version 2024-04-19
 */
export default class EntityManager {

    /** @type Entity[] */
    #entities = [];

    addEntity(entity) {
        this.#entities.push(entity);
    }

    performBeforeProcessing(elementArea, random, defaults) {
        for (let entity of this.#entities) {
            entity.performBeforeProcessing(elementArea, random, defaults);
        }
    }

    performAfterProcessing(elementArea, random, defaults) {
        for (let entity of this.#entities) {
            entity.performAfterProcessing(elementArea, random, defaults);
        }
    }
}