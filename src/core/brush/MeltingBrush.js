// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import ElementHead from "../ElementHead";
import ElementTail from "../ElementTail";
import Element from "../Element";
import AbstractEffectBrush from "./AbstractEffectBrush";

/**
 *
 * @author Patrik Harag
 * @version 2024-04-07
 */
export default class MeltingBrush extends AbstractEffectBrush {

    constructor(innerBrush) {
        super(innerBrush);
    }

    apply(x, y, random, oldElement) {
        const element = this._retrieveElement(x, y, random, oldElement);
        if (element === null) {
            return null;
        }

        const heatModIndex = ElementHead.getHeatModIndex(element.elementHead);
        if (ElementHead.hmiToMeltingTemperature(heatModIndex) < (1 << ElementHead.FIELD_TEMPERATURE_SIZE)) {
            let newElementHead = element.elementHead;
            newElementHead = ElementHead.setHeatModIndex(newElementHead, ElementHead.hmiToMeltingHMI(heatModIndex));
            newElementHead = ElementHead.setType(newElementHead, ElementHead.TYPE_FLUID);

            let newElementTail = ElementTail.setBlurType(element.elementTail, ElementTail.BLUR_TYPE_1);

            return new Element(newElementHead, newElementTail);
        }
        return element;
    }
}