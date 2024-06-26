// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

/**
 *
 * @author Patrik Harag
 * @version 2024-03-23
 */
export default class ProcessorContext {

    static OPT_CYCLES_PER_SECOND = 120;
    static OPT_FRAMES_PER_SECOND = 60;


    /**
     * @returns number
     */
    getIteration() {
        throw 'Not implemented';
    }

    /**
     * @returns GameDefaults
     */
    getDefaults() {
        throw 'Not implemented';
    }

    /**
     * @returns {boolean}
     */
    isFallThroughEnabled() {
        throw 'Not implemented';
    }

    /**
     * @returns {boolean}
     */
    isErasingEnabled() {
        throw 'Not implemented';
    }

    trigger(x, y) {
        throw 'Not implemented';
    }

    triggerSolidCreated(elementHead, x, y) {
        throw 'Not implemented';
    }
}