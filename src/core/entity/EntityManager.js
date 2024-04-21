// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import Entities from "./Entities";
import Entity from "./Entity";

/**
 *
 * @author Patrik Harag
 * @version 2024-04-21
 */
export default class EntityManager {

    /** @type Entity[] */
    #entities = [];

    /**
     *
     * @param serializedEntities {object[]}
     */
    constructor(serializedEntities) {
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
            const entity = Entities.deserialize(serializedEntity);
            this.#entities.push(entity);
            return entity;
        } catch (e) {
            console.warn('Cannot deserialize entity', e);
            return null;
        }
    }

    performBeforeProcessing(elementArea, random, defaults) {
        for (let i = 0; i < this.#entities.length; i++) {
            const entity = this.#entities[i];
            entity.performBeforeProcessing(elementArea, random, defaults);
        }
    }

    performAfterProcessing(elementArea, random, defaults) {
        let toDelete = null;

        for (let i = 0; i < this.#entities.length; i++) {
            const entity = this.#entities[i];
            const active = entity.performAfterProcessing(elementArea, random, defaults);
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
}