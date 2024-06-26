// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import DeterministicRandom from "../DeterministicRandom";
import InsertElementAreaTool from "./InsertElementAreaTool";
import Tool from "./Tool";

/**
 *
 * @author Patrik Harag
 * @version 2024-04-20
 */
export default class InsertRandomSceneTool extends Tool {

    /** @type Scene[] */
    #scenes;

    #currentTool;

    /** @type function */
    #onInsertHandler;

    constructor(info, scenes, onInsertHandler) {
        super(info);
        this.#scenes = scenes;
        this.#onInsertHandler = onInsertHandler;
        this.#initRandomTool();
    }

    #initRandomTool() {
        if (this.#scenes.length === undefined || this.#scenes.length === 0) {
            throw 'Scenes not set';
        }

        const i = DeterministicRandom.DEFAULT.nextInt(this.#scenes.length);
        const scene = this.#scenes[i];
        const elementArea = InsertElementAreaTool.asElementArea(scene);
        const serializedEntitiesOrNull = scene.createEntities();
        const serializedEntities = serializedEntitiesOrNull !== null ? serializedEntitiesOrNull : [];
        this.#currentTool = new InsertElementAreaTool(this.getInfo(), elementArea, serializedEntities, this.#onInsertHandler);
    }

    applyPoint(x, y, graphics, aldModifier) {
        this.#currentTool.applyPoint(x, y, graphics, aldModifier);
        this.#initRandomTool();
    }

    hasCursor() {
        return true;
    }

    createCursor() {
        return this.#currentTool.createCursor();
    }
}