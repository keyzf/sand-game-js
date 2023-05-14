import {Scene} from "./Scene.js";
import {SandGame} from "./SandGame";
import {ElementArea} from "./ElementArea.js";

/**
 *
 * @author Patrik Harag
 * @version 2023-04-28
 */
export class SceneImplSnapshot extends Scene {

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

    createSandGame(context, prefWidth, prefHeight, defaultElement) {
        let elementArea = this.createElementArea(prefWidth, prefHeight, defaultElement);
        return new SandGame(context, elementArea, this.#snapshot.metadata, defaultElement);
    }

    createElementArea(prefWidth, prefHeight, defaultElement) {
        return ElementArea.from(this.#snapshot.metadata.width, this.#snapshot.metadata.height, this.#snapshot.data);
    }
}