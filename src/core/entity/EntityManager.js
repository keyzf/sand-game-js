// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import Entity from "./Entity";
import EntityPositionLookup from "./EntityPositionLookup";
import EntityFactories from "./EntityFactories";

/**
 *
 * @author Patrik Harag
 * @version 2024-04-27
 */
export default class EntityManager {

    /** @type GameState */
    #gameState;

    /** @type Entity[] */
    #entities = [];

    /**
     *
     * @param serializedEntities {object[]}
     * @param gameState {GameState}
     */
    constructor(serializedEntities, gameState) {
        this.#gameState = gameState;

        for (let serializedEntity of serializedEntities) {
            this.addSerializedEntity(serializedEntity);
        }
    }

    addEntity(entity) {
        if (entity instanceof Entity) {
            this.#entities.push(entity);
        } else {
            throw 'Entity instance expected';
        }
    }

    addSerializedEntity(serializedEntity) {
        try {
            const entity = this.#deserialize(serializedEntity);
            this.#entities.push(entity);
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
    }

    performAfterProcessing() {
        let toDelete = null;

        for (let i = 0; i < this.#entities.length; i++) {
            const entity = this.#entities[i];
            const active = entity.performAfterProcessing();
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
    }

    serializeEntities() {
        const list = [];
        for (let entity of this.#entities) {
            list.push(entity.serialize());
        }
        return list;
    }

    createPositionLookup(width, height) {
        return new EntityPositionLookup(this.#entities, width, height);
    }
}