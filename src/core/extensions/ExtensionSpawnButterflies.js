// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import Extension from "./Extension";
import ElementHead from "../ElementHead.js";
import Entities from "../entity/Entities";

/**
 *
 * @author Patrik Harag
 * @version 2024-05-05
 */
export default class ExtensionSpawnButterflies extends Extension {

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
        if ((this.#processorContext.getIteration() + 500) % 1000 === 0) {
            const butterflyCount = this.#entityManager.countEntities('butterfly');

            if (butterflyCount > 3) {
                return;
            }

            const x = this.#random.nextInt(this.#elementArea.getWidth() - 20) + 10;
            const y = this.#findSpawnY(this.#elementArea, x);
            if (y !== null) {
                this.#entityManager.addSerializedEntity(Entities.butterfly(x, y));
                this.#processorContext.trigger(x, y);
            }
        }
    }

    #findSpawnY(elementArea, x) {
        let airCount = 0;

        for (let y = 0; y < elementArea.getHeight(); y++) {
            const elementHead = elementArea.getElementHead(x, y);
            if (ElementHead.getTypeClass(elementHead) === ElementHead.TYPE_AIR) {
                airCount++;
            } else if (ElementHead.getBehaviour(elementHead) === ElementHead.BEHAVIOUR_GRASS) {
                if (airCount >= 15 && this.#isSpaceAround(x, y - 4)) {
                    return y - 4;
                }
                break;
            } else {
                airCount = 0;
            }
        }

        return null;
    }

    #isSpaceAround(x, y) {
        for (let dy = -5; dy <= 2; dy++) {
            for (let dx = -5; dx <= 5; dx++) {
                const ex = x + dx;
                const ey = y + dy;
                const elementHead = this.#elementArea.getElementHeadOrNull(ex, ey);
                if (elementHead === null) {
                    return false;
                }
                if (ElementHead.getTypeClass(elementHead) !== ElementHead.TYPE_AIR) {
                    return false;
                }
                if (ElementHead.getTemperature(elementHead) > 0) {
                    return false;
                }
            }
        }
        return true;
    }
}