// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import Element from "../Element.js";
import Brush from "../brush/Brush.js";

/**
 * @interface
 *
 * @author Patrik Harag
 * @version 2024-04-12
 */
export default class ProcessorDefaults {

    /**
     *
     * @return BrushCollection
     */
    getBrushCollection() {
        throw 'Not implemented';
    }

    /**
     * @return Element
     */
    getDefaultElement() {
        throw 'Not implemented';
    }

    // brushes

    /**
     * @return Brush
     */
    getBrushWater() {
        throw 'Not implemented';
    }

    /**
     * @return Brush
     */
    getBrushSteam() {
        throw 'Not implemented';
    }

    /**
     * @return Brush
     */
    getBrushGrass() {
        throw 'Not implemented';
    }

    /**
     * @return Brush
     */
    getBrushTree() {
        throw 'Not implemented';
    }

    /**
     * @return Brush
     */
    getBrushTreeWood() {
        throw 'Not implemented';
    }

    /**
     * @return Brush
     */
    getBrushTreeWoodDark() {
        throw 'Not implemented';
    }

    /**
     * @return Brush
     */
    getBrushTreeRoot() {
        throw 'Not implemented';
    }

    /**
     * @return Brush
     */
    getBrushTreeLeaf() {
        throw 'Not implemented';
    }

    /**
     * @return Brush
     */
    getBrushTreeLeafDark() {
        throw 'Not implemented';
    }

    /**
     * @return Brush
     */
    getBrushFishHead() {
        throw 'Not implemented';
    }

    /**
     * @return Brush
     */
    getBrushFishBody() {
        throw 'Not implemented';
    }

    /**
     * @return Brush
     */
    getBrushFishCorpse() {
        throw 'Not implemented';
    }

    /**
     * @return Brush
     */
    getBrushFire() {
        throw 'Not implemented';
    }

    /**
     * @return Brush
     */
    getBrushAsh() {
        throw 'Not implemented';
    }

    // structures

    /**
     * @return []
     */
    getTreeTrunkTemplates() {
        throw 'Not implemented';
    }

    /**
     * @return []
     */
    getTreeLeafClusterTemplates() {
        throw 'Not implemented';
    }
}
