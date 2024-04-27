// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import Extension from "./Extension";
import ElementHead from "../ElementHead.js";
import Entities from "../entity/Entities";

/**
 *
 * @author Patrik Harag
 * @version 2024-04-27
 */
export default class ExtensionSpawnFish extends Extension {

    /** @type ElementArea */
    #elementArea;
    /** @type DeterministicRandom */
    #random;
    /** @type ProcessorContext */
    #processorContext;
    /** @type EntityManager */
    #entityManager;

    /**
     *
     * @param gameState {GameState}
     */
    constructor(gameState) {
        super();
        this.#elementArea = gameState.elementArea;
        this.#random = gameState.random;
        this.#processorContext = gameState.processorContext;
        this.#entityManager = gameState.entityManager;
    }

    run() {
        if (this.#processorContext.getIteration() % 9 === 0) {
            const fishCount = this.#entityManager.countEntities('fish');

            if (fishCount > 4) {
                return;
            }

            const x = this.#random.nextInt(this.#elementArea.getWidth() - 2) + 1;
            const y = this.#random.nextInt(this.#elementArea.getHeight() - 2) + 1;

            if (this.#couldSpawnHere(this.#elementArea, x, y)) {
                this.#entityManager.addSerializedEntity(Entities.fish(x, y));
                this.#processorContext.trigger(x, y);
            }
        }
    }

    #couldSpawnHere(elementArea, x, y) {
        // space around
        if (x < 1 || y < 1) {
            return false;
        }
        if (x + 1 >= elementArea.getWidth() || y + 1 >= elementArea.getHeight()) {
            return false;
        }

        // check temperature
        const elementHead = elementArea.getElementHead(x, y);
        if (ElementHead.getTemperature(elementHead) > 0) {
            return false;
        }

        // water around
        if (!this.#isWater(elementArea, x, y) || !this.#isWater(elementArea, x - 1, y)
            || !this.#isWater(elementArea, x + 1, y) || !this.#isWater(elementArea, x + 2, y)
            || !this.#isWater(elementArea, x + 1, y + 1) || !this.#isWater(elementArea, x + 2, y + 1)
            || !this.#isWater(elementArea, x + 1, y - 1) || !this.#isWater(elementArea, x + 2, y - 1)) {
            return false;
        }

        // sand around
        return this.#isSand(elementArea, x, y + 2)
            || this.#isSand(elementArea, x + 1, y + 2);
    }

    #isWater(elementArea, x, y) {
        if (!elementArea.isValidPosition(x, y)) {
            return false;
        }
        const targetElementHead = elementArea.getElementHead(x, y);
        const type = ElementHead.getTypeClass(targetElementHead);
        return type === ElementHead.TYPE_FLUID;
    }

    #isSand(elementArea, x, y) {
        if (!elementArea.isValidPosition(x, y)) {
            return false;
        }
        const targetElementHead = elementArea.getElementHead(x, y);
        const type = ElementHead.getTypeClass(targetElementHead);
        return type === ElementHead.TYPE_POWDER || type === ElementHead.TYPE_POWDER_WET;
    }
}