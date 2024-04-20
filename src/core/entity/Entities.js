// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import BirdEntity from "./BirdEntity";

/**
 *
 * @author Patrik Harag
 * @version 2024-04-20
 */
export default class Entities {

    static bird(x, y) {
        return new BirdEntity({ x: x, y: y });
    }

    /**
     *
     * @param serialized {object}
     * @return {Entity}
     */
    static deserialize(serialized) {
        if (typeof serialized !== 'object') {
            throw 'Serialized entity must be an object';
        }
        switch (serialized.entity) {
            case 'bird':
                return new BirdEntity(serialized);
        }
        throw 'Entity not recognized';
    }
}