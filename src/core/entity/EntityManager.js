// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import Entities from "./Entities";
import Entity from "./Entity";

/**
 *
 * @author Patrik Harag
 * @version 2024-04-20
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
        for (let entity of this.#entities) {
            entity.performBeforeProcessing(elementArea, random, defaults);
        }
    }

    performAfterProcessing(elementArea, random, defaults) {
        for (let entity of this.#entities) {
            entity.performAfterProcessing(elementArea, random, defaults);
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