// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import BirdEntity from "./BirdEntity";

/**
 *
 * @author Patrik Harag
 * @version 2024-04-19
 */
export default class Entities {

    static bird(x, y) {
        return new BirdEntity(x, y);
    }
}