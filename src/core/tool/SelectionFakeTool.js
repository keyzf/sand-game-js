// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import Tool from "./Tool";

/**
 *
 * @author Patrik Harag
 * @version 2024-05-07
 */
export default class SelectionFakeTool extends Tool {

    #tools;

    constructor(info, tools) {
        super(info);
        this.#tools = tools;
    }

    getTools() {
        return this.#tools;
    }
}