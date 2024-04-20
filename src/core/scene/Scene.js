// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

/**
 * @interface
 *
 * @author Patrik Harag
 * @version 2024-04-20
 */
export default class Scene {

    /**
     * @returns [width: number, height: number]
     */
    countSize(prefWidth, prefHeight) {
        throw 'Not implemented';
    }

    /**
     * @param prefWidth {number}
     * @param prefHeight {number}
     * @param processorDefaults {ProcessorDefaults}
     * @param context {CanvasRenderingContext2D|WebGLRenderingContext}
     * @param rendererInitializer {RendererInitializer}
     * @returns Promise<SandGame>
     */
    createSandGame(prefWidth, prefHeight, processorDefaults, context, rendererInitializer) {
        throw 'Not implemented';
    }

    /**
     * @param prefWidth
     * @param prefHeight
     * @param defaultElement
     * @returns ElementArea
     */
    createElementArea(prefWidth, prefHeight, defaultElement) {
        throw 'Not implemented';
    }

    /**
     * Creates entities in serialized state.
     * It may not be supported, but it doesn't mean that there are none - they man be generated in createSandGame.
     *
     * @returns {object[]}
     */
    createEntities() {
        return null;
    }
}
