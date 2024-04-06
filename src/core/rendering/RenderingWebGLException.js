// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

/**
 *
 * @author Patrik Harag
 * @version 2024-04-06
 */
export default class RenderingWebGLException {

    #error;

    constructor(error) {
        this.#error = error;
    }

    getError() {
        return this.#error;
    }
}
