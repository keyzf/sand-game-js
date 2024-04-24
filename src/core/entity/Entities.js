// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import BirdEntity from "./BirdEntity";

/**
 *
 * @author Patrik Harag
 * @version 2024-04-24
 */
export default class Entities {

    static bird(x = undefined, y = undefined) {
        return { entity: 'bird', x: x, y: y };
    }

    static birdEntity(x, y, elementArea, random, processorContext) {
        return new BirdEntity(Entities.bird(x, y), elementArea, random, processorContext)
    }
}