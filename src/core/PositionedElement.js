// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import Element from "./Element";

/**
 *
 * @author Patrik Harag
 * @version 2024-04-20
 */
export default class PositionedElement extends Element {

    x;
    y;

    constructor(x, y, elementHead, elementTail) {
        super(elementHead, elementTail);
        this.x = x;
        this.y = y;
    }
}
