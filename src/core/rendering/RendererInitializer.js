// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import Renderer from "./Renderer";
import Renderer2D from "./Renderer2D";
import RenderingModeHeatmap from "./RenderingModeHeatmap";
import RenderingModeElementType from "./RenderingModeElementType";
import RendererWebGL from "./RendererWebGL";
import RendererNull from "./RendererNull";
import RenderingWebGLException from "./RenderingWebGLException";

/**
 * @interface
 *
 * @author Patrik Harag
 * @version 2024-04-06
 */
export default class RendererInitializer {

    getContextType() {
        throw 'Not implemented'
    }

    /**
     *
     * @param elementArea
     * @param chunkSize
     * @param context
     * @return {Renderer}
     */
    initialize(elementArea, chunkSize, context) {
        throw 'Not implemented'
    }

    // static factory methods

    static canvas2d() {
        return new RendererInitializer2D(null);
    }

    static canvas2dHeatmap() {
        return new RendererInitializer2D(new RenderingModeHeatmap());
    }

    static canvas2dElementType() {
        return new RendererInitializer2D(new RenderingModeElementType())
    }

    static canvasWebGL() {
        return new RendererInitializerWebGL();
    }

    static nullRenderer() {
        return new RendererInitializerNull();
    }
}

class RendererInitializer2D extends RendererInitializer {

    #mode;

    constructor(mode) {
        super();
        this.#mode = mode;
    }

    getContextType() {
        return '2d';
    }

    initialize(elementArea, chunkSize, context) {
        let renderer = new Renderer2D(elementArea, chunkSize, context);
        if (this.#mode !== null) {
            renderer.setMode(this.#mode);
        }
        return renderer;
    }
}

class RendererInitializerWebGL extends RendererInitializer {

    getContextType() {
        return 'webgl2';
    }

    initialize(elementArea, chunkSize, context) {
        try {
            return new RendererWebGL(elementArea, chunkSize, context);
        } catch (e) {
            throw new RenderingWebGLException(e);
        }
    }
}

class RendererInitializerNull extends RendererInitializer {

    constructor() {
        super();
    }

    getContextType() {
        return '2d';
    }

    initialize(elementArea, chunkSize, context) {
        return new RendererNull();
    }
}
