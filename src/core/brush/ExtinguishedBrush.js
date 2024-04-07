// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import Element from "../Element";
import ElementHead from "../ElementHead";
import AbstractEffectBrush from "./AbstractEffectBrush";

/**
 *
 * @author Patrik Harag
 * @version 2024-04-07
 */
export default class ExtinguishedBrush extends AbstractEffectBrush {

    constructor(innerBrush) {
        super(innerBrush);
    }

    apply(x, y, random, oldElement) {
        const element = this._retrieveElement(x, y, random, oldElement);
        if (element === null) {
            return null;
        }

        const behaviour = ElementHead.getBehaviour(element.elementHead);
        if (behaviour === ElementHead.BEHAVIOUR_FIRE_SOURCE) {
            const newElementHead = ElementHead.setBehaviour(element.elementHead, ElementHead.BEHAVIOUR_NONE);
            return new Element(newElementHead, element.elementTail);
        } else {
            return null;
        }
    }
}