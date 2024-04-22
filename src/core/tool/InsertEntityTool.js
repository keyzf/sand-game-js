// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import Tool from "./Tool";
import CursorDefinitionElementArea from "./CursorDefinitionElementArea";

/**
 *
 * @author Patrik Harag
 * @version 2024-04-20
 */
export default class InsertEntityTool extends Tool {

    /** @type {function:Entity} */
    #entityFactory;

    /** @type {Entity} */
    #nextEntity;

    constructor(info, entityFactory) {
        super(info);
        this.#entityFactory = entityFactory;
        this.#nextEntity = this.#entityFactory();
    }

    applyPoint(x, y, graphics, aldModifier) {
        const serialized = this.#nextEntity.serialize();
        serialized.x = x;
        serialized.y = y;

        graphics.insertEntity(serialized);

        this.#nextEntity = this.#entityFactory();
    }

    hasCursor() {
        return this.#nextEntity.asElementArea(2) !== null;
    }

    createCursor() {
        return new CursorDefinitionElementArea(this.#nextEntity.asElementArea(2));
    }
}