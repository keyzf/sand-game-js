// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

/**
 *
 * @author Patrik Harag
 * @version 2024-04-27
 */
export default class Entities {

    static bird(x = undefined, y = undefined) {
        return { entity: 'bird', x: x, y: y };
    }

    static butterfly(x = undefined, y = undefined) {
        return { entity: 'butterfly', x: x, y: y };
    }

    static fish(x = undefined, y = undefined) {
        return { entity: 'fish', x: x, y: y };
    }
}
