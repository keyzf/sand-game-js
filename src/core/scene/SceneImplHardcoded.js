// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import Scene from "./Scene.js";
import SandGame from "../SandGame.js";
import ElementArea from "../ElementArea.js";

/**
 *
 * @author Patrik Harag
 * @version 2024-05-08
 */
export default class SceneImplHardcoded extends Scene {

    name;
    description;

    /** @type function(SandGame):Promise<any>|any */
    #onCreated;

    /** @type function(SandGame) */
    #onOpened;

    constructor({name, description, onCreated, onOpened}) {
        super();
        this.#onCreated = onCreated;
        this.#onOpened = onOpened;
        this.name = name;
        this.description = description;
    }

    countSize(prefWidth, prefHeight) {
        return [prefWidth, prefHeight];
    }

    async createSandGame(prefWidth, prefHeight, defaults, context, rendererInitializer) {
        let elementArea = this.createElementArea(prefWidth, prefHeight, defaults.getDefaultElement());
        let sandGame = new SandGame(elementArea, [], null, defaults, context, rendererInitializer);
        await this.#onCreated(sandGame);
        return sandGame;
    }

    createElementArea(prefWidth, prefHeight, defaultElement) {
        return ElementArea.create(prefWidth, prefHeight, defaultElement);
    }

    executeOnOpened(sandGame) {
        if (this.#onOpened !== undefined) {
            this.#onOpened(sandGame);
        }
    }
}
