// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

/**
 *
 * @author Patrik Harag
 * @version 2024-04-26
 */
export default class GameState {

    /** @type ElementArea */
    elementArea;
    /** @type DeterministicRandom */
    random;
    /** @type ProcessorContext */
    processorContext;

    constructor(elementArea, random, processorContext) {
        this.elementArea = elementArea;
        this.random = random;
        this.processorContext = processorContext;
    }
}