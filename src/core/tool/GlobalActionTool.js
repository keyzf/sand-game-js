// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import Tool from "./Tool";

/**
 *
 * @author Patrik Harag
 * @version 2024-05-04
 */
export default class GlobalActionTool extends Tool {

    /** @type function(SandGame) */
    #handler;

    constructor(info, handler) {
        super(info);
        this.#handler = handler;
    }

    /**
     *
     * @return {function((SandGame))}
     */
    getHandler() {
        return this.#handler;
    }
}