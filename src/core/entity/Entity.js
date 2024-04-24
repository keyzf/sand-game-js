// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

/**
 * @interface
 *
 * @author Patrik Harag
 * @version 2024-04-24
 */
export default class Entity {

    /**
     * @return {number}
     */
    getX() {
        throw 'Not implemented';
    }

    /**
     * @return {number}
     */
    getY() {
        throw 'Not implemented';
    }

    /**
     * @returns {boolean}
     */
    isActive() {
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
     * @returns {void}
     */
    initialize() {
        throw 'Not implemented';
    }

    /**
     *
     * @returns {boolean} alive
     */
    performBeforeProcessing() {
        throw 'Not implemented';
    }

    /**
     *
     * @returns {boolean} alive
     */
    performAfterProcessing() {
        throw 'Not implemented';
    }

    /**
     *
     * @param defaultElement {Element}
     * @param rx {number} relative x
     * @param ry {number} relative y
     */
    extract(defaultElement, rx, ry) {
        throw 'Not implemented';
    }

    paint(x, y, elementArea, random) {
        throw 'Not implemented';
    }

    /**
     *
     * @returns {[number, number]}
     */
    countMaxBoundaries() {
        throw 'Not implemented';
    }
}