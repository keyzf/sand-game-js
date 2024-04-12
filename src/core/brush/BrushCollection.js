// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

/**
 * @interface
 *
 * @author Patrik Harag
 * @version 2024-04-12
 */
export default class BrushCollection {

    /**
     *
     * @returns {Object.<string,Brush>}
     */
    getExtraBrushes() {
        throw 'Not implemented';
    }

    /**
     *
     * @param codeName {string}
     * @returns {Brush|null}
     */
    byCodeName(codeName) {
        throw 'Not implemented';
    }
}
