// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

/**
 * @interface
 *
 * @author Patrik Harag
 * @version 2024-04-21
 */
export default class Entity {

    /**
     *
     * @param elementArea {ElementArea}
     * @param random {DeterministicRandom}
     * @param defaults {ProcessorDefaults}
     * @returns {void}
     */
    initialize(elementArea, random, defaults) {
        throw 'Not implemented';
    }

    /**
     *
     * @param elementArea {ElementArea}
     * @param random {DeterministicRandom}
     * @param defaults {ProcessorDefaults}
     * @returns {boolean} alive
     */
    performBeforeProcessing(elementArea, random, defaults) {
        throw 'Not implemented';
    }

    /**
     *
     * @param elementArea {ElementArea}
     * @param random {DeterministicRandom}
     * @param defaults {ProcessorDefaults}
     * @returns {boolean} alive
     */
    performAfterProcessing(elementArea, random, defaults) {
        throw 'Not implemented';
    }

    /**
     *
     * @returns {object}
     */
    serialize() {
        throw 'Not implemented';
    }

    /**
     *
     * @returns {ElementArea}
     */
    asElementArea(bounds = 0) {
        return null;  // unsupported by default
    }
}