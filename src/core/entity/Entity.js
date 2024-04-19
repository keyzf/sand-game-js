// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

/**
 *
 * @author Patrik Harag
 * @version 2024-04-19
 */
export default class Entity {

    /**
     *
     * @param elementArea {ElementArea}
     * @param random {DeterministicRandom}
     * @param defaults {ProcessorDefaults}
     * @returns {void}
     */
    performBeforeProcessing(elementArea, random, defaults) {
        throw 'Not implemented';
    }

    /**
     *
     * @param elementArea {ElementArea}
     * @param random {DeterministicRandom}
     * @param defaults {ProcessorDefaults}
     * @returns {void}
     */
    performAfterProcessing(elementArea, random, defaults) {
        throw 'Not implemented';
    }
}