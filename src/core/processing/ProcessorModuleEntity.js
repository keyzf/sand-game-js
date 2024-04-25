// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import ElementHead from "../ElementHead";

/**
 *
 * @author Patrik Harag
 * @version 2024-04-25
 */
export default class ProcessorModuleEntity {

    /** @type ElementArea */
    #elementArea;

    /** @type DeterministicRandom */
    #random;

    /** @type ProcessorContext */
    #processorContext;

    constructor(elementArea, random, processorContext) {
        this.#elementArea = elementArea;
        this.#random = random;
        this.#processorContext = processorContext;
    }

    behaviourEntity(elementHead, x, y) {
        const special = ElementHead.getSpecial(elementHead);

        if (special < 5) {
            // increment
            const newElementHead = ElementHead.setSpecial(elementHead, special + 1);
            this.#elementArea.setElementHead(x, y, newElementHead);
        } else {
            // destroy
            const type = this.#random.nextInt(100) < 20 ? ElementHead.TYPE_POWDER : ElementHead.TYPE_POWDER_WET;

            let newElementHead = elementHead;
            newElementHead = ElementHead.setType(newElementHead, ElementHead.type8Powder(type, 4));
            newElementHead = ElementHead.setBehaviour(newElementHead, ElementHead.BEHAVIOUR_NONE);
            newElementHead = ElementHead.setSpecial(newElementHead, 0);
            this.#elementArea.setElementHead(x, y, newElementHead);
        }
    }
}