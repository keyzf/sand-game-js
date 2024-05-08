// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import SceneImplHardcoded from "./SceneImplHardcoded";

/**
 *
 * @author Patrik Harag
 * @version 2024-05-08
 */
export default class Scenes {

    /**
     *
     * @param name {string}
     * @param onCreated {function(SandGame):Promise<any>|any}
     * @param onOpened {(function(SandGame):void)|undefined}
     */
    static custom(name, onCreated, onOpened = undefined) {
        return new SceneImplHardcoded({
            name: name,
            onCreated: onCreated,
            onOpened: onOpened
        });
    }
}
