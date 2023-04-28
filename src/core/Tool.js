import { Brush } from "./Brush.js";

/**
 *
 * @author Patrik Harag
 * @version 2023-04-15
 */
export class Tool {

    /** @type string */
    #category;

    /** @type string */
    #codeName;

    /** @type string */
    #displayName;

    constructor(category, codeName, displayName) {
        this.#category = category;
        this.#codeName = codeName;
        this.#displayName = displayName;
    }

    /**
     *
     * @return {string}
     */
    getCategory() {
        return this.#category;
    }

    /**
     *
     * @return {string}
     */
    getDisplayName() {
        return this.#displayName;
    }

    /**
     *
     * @return {string}
     */
    getCodeName() {
        return this.#codeName;
    }

    /**
     *
     * @param x {number}
     * @param y {number}
     * @param graphics {SandGameGraphics}
     * @param altModifier {boolean}
     * @return {void}
     */
    applyPoint(x, y, graphics, altModifier) {
        throw 'Not implemented';
    }

    /**
     *
     * @param x1 {number}
     * @param y1 {number}
     * @param x2 {number}
     * @param y2 {number}
     * @param graphics {SandGameGraphics}
     * @param altModifier {boolean}
     * @return {void}
     */
    applyDrag(x1, y1, x2, y2, graphics, altModifier) {
        // no action by default
    }

    /**
     *
     * @param x1 {number}
     * @param y1 {number}
     * @param x2 {number}
     * @param y2 {number}
     * @param graphics {SandGameGraphics}
     * @param altModifier {boolean}
     * @return {void}
     */
    applyArea(x1, y1, x2, y2, graphics, altModifier) {
        // no action by default
    }

    /**
     *
     * @param x {number}
     * @param y {number}
     * @param graphics {SandGameGraphics}
     * @param altModifier {boolean}
     * @return {void}
     */
    applyAround(x, y, graphics, altModifier) {
        // no action by default
    }


    // static factory methods

    static rectangleBrushTool(category, codeName, displayName, brush, size) {
        return new RectangleBrushTool(category, codeName, displayName, brush, size);
    }

    static pointBrushTool(category, codeName, displayName, brush) {
        return new PointBrushTool(category, codeName, displayName, brush);
    }
}

/**
 *
 * @author Patrik Harag
 * @version 2023-04-15
 */
class RectangleBrushTool extends Tool {

    /** @type Brush */
    #brush;

    /** @type Brush */
    #altBrush;

    /** @type number */
    #size;

    constructor(category, codeName, displayName, brush, size) {
        super(category, codeName, displayName);
        this.#brush = brush;
        this.#altBrush = Brush.gentle(brush);
        this.#size = size;
    }

    applyPoint(x, y, graphics, altModifier) {
        this.applyDrag(x, y, x, y, graphics, altModifier);
    }

    applyDrag(x1, y1, x2, y2, graphics, altModifier) {
        const brush = altModifier ? this.#altBrush : this.#brush;
        graphics.drawLine(x1, y1, x2, y2, this.#size, brush);
    }

    applyArea(x1, y1, x2, y2, graphics, altModifier) {
        const brush = altModifier ? this.#altBrush : this.#brush;
        graphics.drawRectangle(x1, y1, x2, y2, brush);
    }

    applyAround(x, y, graphics, altModifier) {
        const brush = altModifier ? this.#altBrush : this.#brush;
        graphics.floodFill(x, y, brush, 1);
    }
}

/**
 *
 * @author Patrik Harag
 * @version 2023-04-15
 */
class PointBrushTool extends Tool {

    /** @type Brush */
    #brush;

    constructor(category, codeName, displayName, brush) {
        super(category, codeName, displayName);
        this.#brush = brush;
    }


    applyPoint(x, y, graphics, aldModifier) {
        graphics.draw(x, y, this.#brush);
    }
}