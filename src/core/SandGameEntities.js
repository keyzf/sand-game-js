// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import Entity from "./entity/Entity";

/**
 * Public API for working with entities.
 *
 * @author Patrik Harag
 * @version 2024-05-04
 */
export default class SandGameEntities {

    /** @type number */
    #width;
    /** @type number */
    #height;

    /** @type EntityManager */
    #entityManager;

    /** @type {function(number,number)} */
    #triggerFunction;

    constructor(width, height, entityManager, triggerFunction) {
        this.#width = width;
        this.#height = height;
        this.#entityManager = entityManager;
        this.#triggerFunction = triggerFunction;
    }

    insertEntity(serializedEntity) {
        if (serializedEntity instanceof Entity) {
            throw 'Entity instance not supported here';
        }

        // check is not out of bounds
        if (typeof serializedEntity.y === 'number') {
            if (serializedEntity.y < 0 || serializedEntity.y >= this.#height) {
                return;  // out of bounds
            }
        }
        if (typeof serializedEntity.x === 'number') {
            if (serializedEntity.x < 0 || serializedEntity.x >= this.#width) {
                return;  // out of bounds
            }
        }

        this.#entityManager.addSerializedEntity(serializedEntity);

        if (typeof serializedEntity.x === 'number' && typeof serializedEntity.y === 'number') {
            this.#triggerFunction(serializedEntity.x, serializedEntity.y);
        }
    }

    // TODO: hide _elementArea, etc.
    /**
     *
     * @param x
     * @param y
     * @returns {Entity[]}
     */
    getAt(x, y) {
        return this.#entityManager.getAt(x, y);
    }

    assignWaypoint(x, y) {
        for (const entity of this.#entityManager.getEntities()) {
            if (typeof entity.assignWaypoint === 'function') {
                entity.assignWaypoint(x, y);
            }
        }
    }
}