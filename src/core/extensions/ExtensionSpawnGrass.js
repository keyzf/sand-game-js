// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import Extension from "./Extension";
import ProcessorModuleGrass from "../processing/ProcessorModuleGrass.js";

/**
 *
 * @author Patrik Harag
 * @version 2024-04-27
 */
export default class ExtensionSpawnGrass extends Extension {

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
        if (this.#processorContext.getIteration() % 3 === 0) {

            const x = this.#random.nextInt(this.#elementArea.getWidth());
            const y = this.#random.nextInt(this.#elementArea.getHeight() - 3) + 2;

            if (ProcessorModuleGrass.canGrowUpHere(this.#elementArea, x, y)) {
                const brush = this.#processorContext.getDefaults().getBrushGrass();
                this.#elementArea.setElement(x, y, brush.apply(x, y, this.#random));
                this.#processorContext.trigger(x, y);
            }
        }
    }
}