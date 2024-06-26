// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import Entity from "./Entity";
import EntityPositionLookup from "./EntityPositionLookup";
import EntityFactories from "./EntityFactories";

/**
 *
 * @author Patrik Harag
 * @version 2024-05-04
 */
export default class EntityManager {

    /** @type GameState */
    #gameState;

    /** @type Entity[] */
    #entities = [];

    /** @type {EntityPositionLookup} */
    #positionLookupCache = null;

    /**
     *
     * @param serializedEntities {object[]}
     * @param gameState {GameState}
     */
    constructor(serializedEntities, gameState) {
        this.#gameState = gameState;

        for (let serializedEntity of serializedEntities) {
            this.addSerializedEntity(serializedEntity, false);
        }
    }

    addSerializedEntity(serializedEntity, autoInitialize = true) {
        try {
            const entity = this.#deserialize(serializedEntity);
            this.#entities.push(entity);
            if (autoInitialize) {
                entity.initialize();
            }
            return entity;
        } catch (e) {
            console.warn('Cannot deserialize entity', e);
            return null;
        }
    }

    /**
     *
     * @param serialized {object}
     * @return {Entity}
     */
    #deserialize(serialized) {
        if (typeof serialized !== 'object') {
            throw 'Serialized entity must be an object';
        }
        const factory = EntityFactories.findFactoryByEntityType(serialized.entity);
        if (factory !== null) {
            return factory(serialized, this.#gameState);
        }
        throw 'Entity not recognized';
    }

    performBeforeProcessing() {
        for (let i = 0; i < this.#entities.length; i++) {
            const entity = this.#entities[i];
            entity.performBeforeProcessing();
        }

        this.#positionLookupCache = null;
    }

    performAfterProcessing() {
        let toDelete = null;

        for (let i = 0; i < this.#entities.length; i++) {
            const entity = this.#entities[i];

            let active;
            try {
                active = entity.performAfterProcessing();
            } catch (e) {
                // some entities are very complex...
                // log error and remove broken entity
                console.error('Entity error', e);
                // TODO: rethrow + error reporting (when stable)
                active = false;
            }

            if (active === false) {
                if (toDelete === null) {
                    toDelete = [];
                }
                toDelete.push();
            }
        }

        if (toDelete !== null) {
            for (let i = toDelete.length - 1; i >= 0; i--) {
                const j = toDelete[i];
                this.#entities.splice(j, 1);
            }
        }

        this.#positionLookupCache = null;
    }

    serializeEntities() {
        const list = [];
        for (let entity of this.#entities) {
            list.push(entity.serialize());
        }
        return list;
    }

    /**
     *
     * @param x
     * @param y
     * @returns {Entity[]}
     */
    getAt(x, y) {
        if (this.#positionLookupCache === null) {
            const width = this.#gameState.elementArea.getWidth();
            const height = this.#gameState.elementArea.getHeight();
            this.#positionLookupCache = new EntityPositionLookup(this.#entities, width, height);
        }

        return this.#positionLookupCache.getAt(x, y);
    }

    countEntities(type) {
        let count = 0;
        for (let i = 0; i < this.#entities.length; i++) {
            const entity = this.#entities[i];
            if (type === entity.getType()) {
                count++;
            }
        }
        return count;
    }

    getEntities() {
        return this.#entities;
    }
}