// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import Scene from "./Scene.js";
import SandGame from "../SandGame.js";
import ElementArea from "../ElementArea.js";

/**
 *
 * @author Patrik Harag
 * @version 2024-04-20
 */
export default class SceneImplTmpResize extends Scene {

    /**
     * @type Snapshot
     */
    #snapshot;

    constructor(snapshot) {
        super();
        this.#snapshot = snapshot;
    }

    countSize(prefWidth, prefHeight) {
        return [prefWidth, prefHeight];
    }

    async createSandGame(prefWidth, prefHeight, defaults, context, rendererInitializer) {
        const oldWidth = this.#snapshot.metadata.width;
        const oldHeight = this.#snapshot.metadata.height;
        const oldMetadata = this.#snapshot.metadata;
        const oldElementArea = ElementArea.from(oldWidth, oldHeight, this.#snapshot.dataHeads, this.#snapshot.dataTails);
        const oldSerializedEntities = this.#snapshot.serializedEntities;

        const newElementArea = this.createElementArea(prefWidth, prefHeight, defaults.getDefaultElement());
        const newSandGame = new SandGame(newElementArea, [], oldMetadata, defaults, context, rendererInitializer);

        let offsetY;
        if (prefHeight === oldHeight) {
            offsetY = 0;
        } else if (prefHeight > oldHeight) {
            offsetY = prefHeight - oldHeight;
        } else {
            offsetY = -(oldHeight - prefHeight);
        }

        // copy elements
        newSandGame.graphics().insertElementArea(oldElementArea, 0, offsetY);

        // copy entities
        for (let serializedEntity of oldSerializedEntities) {
            // map entity position
            const serializedClone = Object.assign({}, serializedEntity);
            if (offsetY !== 0) {
                if (typeof serializedClone.y === 'number') {
                    serializedClone.y += offsetY;
                }
            }
            newSandGame.entities().insertEntity(serializedClone);
        }

        return newSandGame;
    }

    createElementArea(prefWidth, prefHeight, defaultElement) {
        return ElementArea.create(prefWidth, prefHeight, defaultElement);
    }
}
