// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import Tool from "./Tool";

/**
 *
 * @author Patrik Harag
 * @version 2023-12-25
 */
export default class PointBrushTool extends Tool {

    /** @type {{dx: number, dy: number, brush: Brush}[]} */
    #points;

    constructor(info, points) {
        super(info);
        this.#points = points;
    }

    applyPoint(x, y, graphics, aldModifier) {
        for (const {dx, dy, brush} of this.#points) {
            graphics.draw(x + dx, y + dy, brush);
        }
    }
}