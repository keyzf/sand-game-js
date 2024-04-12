// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import DeterministicRandom from "../DeterministicRandom";
import Tool from "./Tool";

/**
 *
 * @author Patrik Harag
 * @version 2024-04-12
 */
export default class MeteorTool extends Tool {

    #meteor;
    #meteorFromLeft;
    #meteorFromRight;

    constructor(info, meteor, meteorFromLeft, meteorFromRight) {
        super(info);
        this.#meteor = meteor;
        this.#meteorFromLeft = meteorFromLeft;
        this.#meteorFromRight = meteorFromRight;
    }

    applyPoint(x, y, graphics, aldModifier) {
        const diffSlope4 = Math.trunc(y / 4);
        if (x < diffSlope4 + 10) {
            // right only
            graphics.draw(x + diffSlope4, 1, this.#meteorFromRight);
            return;
        }
        if (x > graphics.getWidth() - diffSlope4 - 10) {
            // left only
            graphics.draw(x - diffSlope4, 1, this.#meteorFromLeft);
            return;
        }

        if (x < graphics.getWidth() / 2) {
            if (DeterministicRandom.DEFAULT.next() < 0.8) {
                graphics.draw(x + diffSlope4, 1, this.#meteorFromRight);
            } else {
                graphics.draw(x, 1, this.#meteor);
            }
        } else {
            if (DeterministicRandom.DEFAULT.next() < 0.8) {
                graphics.draw(x - diffSlope4, 1, this.#meteorFromLeft);
            } else {
                graphics.draw(x, 1, this.#meteor);
            }
        }
    }
}