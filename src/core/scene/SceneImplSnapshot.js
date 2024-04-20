// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import Scene from "./Scene.js";
import SandGame from "../SandGame";
import ElementArea from "../ElementArea.js";

/**
 *
 * @author Patrik Harag
 * @version 2024-04-20
 */
export default class SceneImplSnapshot extends Scene {

    /**
     * @type Snapshot
     */
    #snapshot;

    /**
     *
     * @param snapshot {Snapshot}
     */
    constructor(snapshot) {
        super();
        this.#snapshot = snapshot;
    }

    countSize(prefWidth, prefHeight) {
        return [this.#snapshot.metadata.width, this.#snapshot.metadata.height];
    }

    async createSandGame(prefWidth, prefHeight, defaults, context, rendererInitializer) {
        const elementArea = this.createElementArea(prefWidth, prefHeight, defaults.getDefaultElement());
        const serializedEntities = this.createEntities();
        const metadata = this.#snapshot.metadata;
        return new SandGame(elementArea, serializedEntities, metadata, defaults, context, rendererInitializer);
    }

    createElementArea(prefWidth, prefHeight, defaultElement) {
        return ElementArea.from(
                this.#snapshot.metadata.width,
                this.#snapshot.metadata.height,
                this.#snapshot.dataHeads,
                this.#snapshot.dataTails);
    }

    createEntities() {
        return this.#snapshot.serializedEntities;
    }
}
