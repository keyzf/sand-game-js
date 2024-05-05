// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import Entity from "./Entity";

/**
 *
 * @author Patrik Harag
 * @version 2024-04-24
 */
export default class EntityPositionLookup {

    #table;
    #width;
    #height;

    /**
     *
     * @param entities {Entity[]}
     * @param width {number} element area width
     * @param height {number} element area height
     */
    constructor(entities, width, height) {
        this.#width = width;
        this.#height = height;
        const table = new Map();
        for (const entity of entities) {
            const index = (entity.getY() * width) + entity.getX();
            let array = table.get(index);
            if (array === undefined) {
                array = [];
                table.set(index, array);
            }
            array.push(entity);
        }
        this.#table = table;
    }

    /**
     *
     * @param x {number}
     * @param y {number}
     * @return {Entity[]}
     */
    getAt(x, y) {
        if (x < 0 || y < 0) {
            return [];
        }
        if (x >= this.#width || y >= this.#height) {
            return [];
        }
        const array = this.#table.get((y * this.#width) + x);
        return array !== undefined ? array : [];
    }
}