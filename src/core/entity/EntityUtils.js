// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import ElementHead from "../ElementHead";

/**
 *
 * @author Patrik Harag
 * @version 2024-04-28
 */
export default class EntityUtils {

    static isElementFallingHeavy(elementHead) {
        if (elementHead === null) {
            return false;
        }
        const typeClass = ElementHead.getTypeClass(elementHead);
        if (typeClass === ElementHead.TYPE_POWDER || typeClass === ElementHead.TYPE_POWDER_WET) {
            return true;
        }
        if (typeClass === ElementHead.TYPE_STATIC) {
            if (ElementHead.getBehaviour(elementHead) === ElementHead.BEHAVIOUR_ENTITY) {
                return false;
            }
            if (ElementHead.getTypeModifierSolidBodyId(elementHead) > 0) {
                return true;
            }
        }
        return false;
    }

    static isElementLight(elementHead) {
        if (elementHead === null) {
            return false;
        }
        const typeClass = ElementHead.getTypeClass(elementHead);
        if (typeClass <= ElementHead.TYPE_GAS) {
            return true;
        }
        return false;
    }

    static isElementWater(elementHead) {
        if (elementHead === null) {
            return false;
        }
        const typeClass = ElementHead.getTypeClass(elementHead);
        if (typeClass === ElementHead.TYPE_FLUID) {
            return true;
        }
        return false;
    }
}