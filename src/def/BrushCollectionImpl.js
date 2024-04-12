// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import BrushCollection from "../core/brush/BrushCollection";
import BrushDefs from "./BrushDefs";

/**
 *
 * @author Patrik Harag
 * @version 2024-04-12
 */
export default class BrushCollectionImpl extends BrushCollection {

    /**
     * @type {Object.<string,Brush>}
     */
    #extraBrushes;

    constructor(extraBrushes) {
        super();
        this.#extraBrushes = extraBrushes;
    }

    getExtraBrushes() {
        return { ...this.#extraBrushes };
    }

    byCodeName(codeName) {
        const brush = this.#extraBrushes[codeName];
        if (brush !== undefined) {
            return brush;
        }
        return BrushDefs.byCodeName(codeName);
    }
}
