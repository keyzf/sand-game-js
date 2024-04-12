// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import ProcessorDefaults from "../core/processing/ProcessorDefaults";
import Element from "../core/Element";
import Brush from "../core/brush/Brush";
import BrushDefs from "./BrushDefs";
import StructureDefs from "./StructureDefs";
import BrushCollectionImpl from "./BrushCollectionImpl";

/**
 *
 * @author Patrik Harag
 * @version 2024-04-12
 */
export default class ProcessorDefaultsImpl extends ProcessorDefaults {

    /** @type BrushCollection */ #brushCollection;

    /** @type Element */ #defaultElement;

    /** @type Brush */ #brushWater;
    /** @type Brush */ #brushSteam;
    /** @type Brush */ #brushGrass ;
    /** @type Brush */ #brushTree;
    /** @type Brush */ #brushTreeWood;
    /** @type Brush */ #brushTreeWoodDark;
    /** @type Brush */ #brushTreeLeaf;
    /** @type Brush */ #brushTreeLeafDark;
    /** @type Brush */ #brushTreeRoot;
    /** @type Brush */ #brushFishHead;
    /** @type Brush */ #brushFishBody;
    /** @type Brush */ #brushFishCorpse;
    /** @type Brush */ #brushFire;
    /** @type Brush */ #brushAsh;

    /**
     *
     * @param extraBrushes {Object.<string, Brush>}
     */
    constructor(extraBrushes = {}) {
        super();

        this.#brushCollection = new BrushCollectionImpl(extraBrushes);

        function resolveBrush(codeName) {
            const brush = extraBrushes[codeName];
            if (brush === undefined || brush === null) {
                const byCodeName = BrushDefs.byCodeName(codeName);
                if (byCodeName === null) {
                    throw `Brush '${codeName}' not found`;
                }
                return byCodeName;
            } else {
                if (brush instanceof Brush) {
                    return brush;
                }
                throw `Provided brush '${codeName}' is not instance of Brush`;
            }
        }

        this.#defaultElement = resolveBrush('air').apply(0, 0, undefined);

        this.#brushWater = resolveBrush('water');
        this.#brushSteam = resolveBrush('steam');
        this.#brushGrass = resolveBrush('grass');
        this.#brushTree = resolveBrush('tree');
        this.#brushTreeWood = resolveBrush('tree_wood');
        this.#brushTreeWoodDark = resolveBrush('tree_wood_dark');
        this.#brushTreeLeaf = resolveBrush('tree_leaf');
        this.#brushTreeLeafDark = resolveBrush('tree_leaf_dark');
        this.#brushTreeRoot = resolveBrush('tree_root');
        this.#brushFishHead = resolveBrush('fish_head');
        this.#brushFishBody = resolveBrush('fish_body');
        this.#brushFishCorpse = resolveBrush('fish_corpse');
        this.#brushFire = resolveBrush('fire');
        this.#brushAsh = resolveBrush('ash');
    }

    getBrushCollection() {
        return this.#brushCollection;
    }

    getDefaultElement() {
        return this.#defaultElement;
    }

    // brushes

    getBrushWater() {
        return this.#brushWater;
    }

    getBrushSteam() {
        return this.#brushSteam;
    }

    getBrushGrass() {
        return this.#brushGrass;
    }

    getBrushTree() {
        return this.#brushTree;
    }

    getBrushTreeLeaf() {
        return this.#brushTreeLeaf;
    }

    getBrushTreeLeafDark() {
        return this.#brushTreeLeafDark;
    }

    getBrushTreeWood() {
        return this.#brushTreeWood;
    }

    getBrushTreeWoodDark() {
        return this.#brushTreeWoodDark;
    }

    getBrushTreeRoot() {
        return this.#brushTreeRoot;
    }

    getBrushFishHead() {
        return this.#brushFishHead;
    }

    getBrushFishBody() {
        return this.#brushFishBody;
    }

    getBrushFishCorpse() {
        return this.#brushFishCorpse;
    }

    getBrushFire() {
        return this.#brushFire;
    }

    getBrushAsh() {
        return this.#brushAsh;
    }

    // structures

    getTreeTrunkTemplates() {
        return StructureDefs.TREE_TRUNK_TEMPLATES;
    }

    getTreeLeafClusterTemplates() {
        return StructureDefs.TREE_CLUSTER_TEMPLATES;
    }
}
