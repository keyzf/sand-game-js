// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import Tool from "./Tool";
import CursorDefinitionElementArea from "./CursorDefinitionElementArea";
import ElementArea from "../ElementArea";
import DeterministicRandom from "../DeterministicRandom";
import ProcessorContext from "../processing/ProcessorContext";
import GameState from "../GameState";

/**
 *
 * @author Patrik Harag
 * @version 2024-04-26
 */
export default class InsertEntityTool extends Tool {

    /** @type {function(object, GameState):Entity} */
    #entityFactory;

    /** @type {Entity} */
    #nextEntity;

    constructor(info, entityFactory) {
        super(info);
        this.#entityFactory = entityFactory;

        this.#createEntity();
    }

    #createEntity() {
        const tmpElementArea = ElementArea.create(1, 1, ElementArea.TRANSPARENT_ELEMENT);
        const tmpRandom = DeterministicRandom.DEFAULT;
        const tmpProcessorContext = new ProcessorContext();
        const gameState = new GameState(tmpElementArea, tmpRandom, tmpProcessorContext);
        this.#nextEntity = this.#entityFactory({}, gameState);
    }

    applyPoint(x, y, graphics, aldModifier) {
        const serialized = this.#nextEntity.serialize();
        serialized.x = x;
        serialized.y = y;

        graphics.insertEntity(serialized);

        this.#createEntity();
    }

    hasCursor() {
        return true;
    }

    createCursor() {
        const boundaries = 2;
        const [w, h] = this.#nextEntity.countMaxBoundaries();
        const defaultElement = ElementArea.TRANSPARENT_ELEMENT;
        const tmpElementArea = ElementArea.create(w + 2 * boundaries, h + 2 * boundaries, defaultElement);
        const centerX = Math.trunc(tmpElementArea.getWidth() / 2);
        const centerY = Math.trunc(tmpElementArea.getHeight() / 2);
        this.#nextEntity.paint(centerX, centerY, tmpElementArea, DeterministicRandom.DEFAULT);
        return new CursorDefinitionElementArea(tmpElementArea);
    }
}