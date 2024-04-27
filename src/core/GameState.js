// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

/**
 *
 * @author Patrik Harag
 * @version 2024-04-27
 */
export default class GameState {

    /** @type ElementArea */
    elementArea;
    /** @type DeterministicRandom */
    random;
    /** @type ProcessorContext */
    processorContext;
    /** @type EntityManager */
    entityManager;

    constructor(elementArea, random, processorContext, entityManager) {
        this.elementArea = elementArea;
        this.random = random;
        this.processorContext = processorContext;
        this.entityManager = entityManager;
    }
}