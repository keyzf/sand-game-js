// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import ElementHead from "../ElementHead";

/**
 *
 * @author Patrik Harag
 * @version 2024-04-26
 */
export default class EntityUtils {

    static isElementFallingHeavyAt(elementArea, x, y) {
        const elementHead = elementArea.getElementHeadOrNull(x, y);
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

    static isElementLightAt(elementArea, x, y) {
        const elementHead = elementArea.getElementHeadOrNull(x, y);
        if (elementHead === null) {
            return false;
        }
        const typeClass = ElementHead.getTypeClass(elementHead);
        if (typeClass <= ElementHead.TYPE_GAS) {
            return true;
        }
        return false;
    }
}