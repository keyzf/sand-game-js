// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import Extension from "./Extension";
import ElementHead from "../ElementHead.js";

/**
 *
 * @author Patrik Harag
 * @version 2024-04-27
 */
export default class ExtensionSpawnTrees extends Extension {

    /** @type ElementArea */
    #elementArea;
    /** @type DeterministicRandom */
    #random;
    /** @type ProcessorContext */
    #processorContext;

    /**
     *
     * @param gameState {GameState}
     */
    constructor(gameState) {
        super();
        this.#elementArea = gameState.elementArea;
        this.#random = gameState.random;
        this.#processorContext = gameState.processorContext;
    }

    run() {
        const iteration = this.#processorContext.getIteration();
        if (iteration > 1000 && iteration % 4 === 0) {

            const x = this.#random.nextInt(this.#elementArea.getWidth() - 12) + 6;
            const y = this.#random.nextInt(this.#elementArea.getHeight() - 16) + 15;

            if (ExtensionSpawnTrees.couldGrowUpHere(this.#elementArea, x, y)) {
                const brush = this.#processorContext.getDefaults().getBrushTree();
                this.#elementArea.setElement(x, y, brush.apply(x, y, this.#random));
                this.#processorContext.trigger(x, y);
            }
        }
    }

    static couldGrowUpHere(elementArea, x, y) {
        if (x < 0 || y < 12) {
            return false;
        }
        if (x > elementArea.getWidth() - 5 || y > elementArea.getHeight() - 2) {
            return false;
        }
        let e1 = elementArea.getElementHead(x, y);
        if (ElementHead.getBehaviour(e1) !== ElementHead.BEHAVIOUR_GRASS) {
            return false;
        }
        if (ElementHead.getTemperature(e1) > 0) {
            return false;
        }
        let e2 = elementArea.getElementHead(x, y + 1);
        if (ElementHead.getBehaviour(e2) !== ElementHead.BEHAVIOUR_SOIL) {
            return false;
        }
        if (ElementHead.getTemperature(e2) > 0) {
            return false;
        }

        // check space directly above
        for (let dy = 1; dy < 18; dy++) {
            if (!ExtensionSpawnTrees.#isSpaceHere(elementArea, x, y - dy)) {
                return false;
            }
        }

        // check trees around
        for (let dx = -15; dx < 15; dx++) {
            if (ExtensionSpawnTrees.#isOtherThreeThere(elementArea, x + dx, y - 4)) {
                return false;
            }
        }

        // check space above - left & right
        for (let dy = 10; dy < 15; dy++) {
            if (!ExtensionSpawnTrees.#isSpaceHere(elementArea, x - 8, y - dy)) {
                return false;
            }
            if (!ExtensionSpawnTrees.#isSpaceHere(elementArea, x + 8, y - dy)) {
                return false;
            }
        }

        return true;
    }

    static #isSpaceHere(elementArea, tx, ty) {
        let targetElementHead = elementArea.getElementHead(tx, ty);
        if (ElementHead.getTypeClass(targetElementHead) === ElementHead.TYPE_AIR) {
            return true;
        }
        if (ElementHead.getBehaviour(targetElementHead) === ElementHead.BEHAVIOUR_GRASS) {
            return true;
        }
        return false;
    }

    static #isOtherThreeThere(elementArea, tx, ty) {
        let targetElementHead = elementArea.getElementHead(tx, ty);
        let behaviour = ElementHead.getBehaviour(targetElementHead);
        if (behaviour === ElementHead.BEHAVIOUR_TREE_TRUNK || behaviour === ElementHead.BEHAVIOUR_TREE) {
            return true;
        }
        return false;
    }
}