// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import ElementArea from "../ElementArea";
import Brushes from "../brush/Brushes";
import CursorDefinitionElementArea from "./CursorDefinitionElementArea";
import Tool from "./Tool";

/**
 *
 * @author Patrik Harag
 * @version 2024-04-20
 */
export default class InsertElementAreaTool extends Tool {

    static asElementArea(scene) {
        return scene.createElementArea(InsertElementAreaTool.DEFAULT_W, InsertElementAreaTool.DEFAULT_H,
                ElementArea.TRANSPARENT_ELEMENT);
    }


    static DEFAULT_W = 30;
    static DEFAULT_H = 30;

    /** @type ElementArea */
    #elementArea;
    /** @type object[] */
    #serializedEntities;
    /** @type function */
    #onInsertHandler;

    constructor(info, elementArea, serializedEntities, onInsertHandler) {
        super(info);
        this.#elementArea = elementArea;
        this.#serializedEntities = serializedEntities;
        this.#onInsertHandler = onInsertHandler;
    }

    applyPoint(x, y, graphics, aldModifier) {
        const elementArea = this.#elementArea;
        const offsetX = x - Math.trunc(elementArea.getWidth() / 2);
        const offsetY = y - Math.trunc(elementArea.getHeight() / 2);

        // apply elements
        let brush = Brushes.custom((tx, ty) => {
            const element = elementArea.getElement(tx - offsetX, ty - offsetY);
            if (element.elementHead !== ElementArea.TRANSPARENT_ELEMENT.elementHead
                && element.elementTail !== ElementArea.TRANSPARENT_ELEMENT.elementTail) {

                return element;
            }
            return null;
        });
        if (aldModifier) {
            brush = Brushes.gentle(brush);
        }

        for (let i = 0; i < elementArea.getWidth() && offsetX + i < graphics.getWidth(); i++) {
            const tx = offsetX + i;
            if (tx < 0) {
                continue;
            }

            for (let j = 0; j < elementArea.getHeight() && offsetY + j < graphics.getHeight(); j++) {
                const ty = offsetY + j;
                if (ty < 0) {
                    continue;
                }

                graphics.draw(tx, ty, brush);
            }
        }

        // apply entities
        for (const serializedEntity of this.#serializedEntities) {
            const serializedClone = Object.assign({}, serializedEntity);
            // map entity position
            if (typeof serializedClone.x === 'number') {
                serializedClone.x += offsetX;
            }
            if (typeof serializedClone.y === 'number') {
                serializedClone.y += offsetY;
            }
            graphics.insertEntity(serializedClone);
        }

        if (this.#onInsertHandler !== undefined) {
            this.#onInsertHandler();
        }
    }

    hasCursor() {
        return true;
    }

    createCursor() {
        return new CursorDefinitionElementArea(this.#elementArea);
    }
}