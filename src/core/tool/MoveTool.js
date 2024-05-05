// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import Tool from "./Tool";
import ToolInfo from "./ToolInfo";
import ElementArea from "../ElementArea";
import ElementHead from "../ElementHead";
import InsertElementAreaTool from "./InsertElementAreaTool";
import Brushes from "../brush/Brushes";
import CopyUtils from "./CopyUtils";

/**
 * It can be used to move elements from one place to another.
 * This tool works in three modes: click-click, drag-drop and selection-click.
 *
 * @author Patrik Harag
 * @version 2024-04-24
 */
export default class MoveTool extends Tool {

    /** @type number */
    #size;
    /** @type number */
    #solidBodyMaxArea;

    /** @type InsertElementAreaTool */
    #insertScene = null;

    constructor(info, size, solidBodyMaxArea) {
        super(info);
        this.#size = size;
        this.#solidBodyMaxArea = solidBodyMaxArea;
    }

    // POINT & DRAG AND DROP ACTION

    applyPoint(x, y, graphics, altModifier) {
        if (this.#insertScene === null) {
            this.#insertScene = this.#createInsertToolAt(x, y, graphics);
        } else {
            this.#insertScene.applyPoint(x, y, graphics, altModifier);
            this.#insertScene = null;
        }
    }

    onDragStart(x, y, graphics, altModifier) {
        // ignore
    }

    onDragEnd(x, y, graphics, altModifier) {
        if (this.#insertScene !== null) {
            this.#insertScene.applyPoint(x, y, graphics, altModifier);
            this.#insertScene = null;
        }
    }

    #createInsertToolAt(x, y, graphics) {
        const [elementArea, entities] = this.#copySingleElementsAt(x, y, graphics);
        return (elementArea !== null)
                ? new InsertElementAreaTool(new ToolInfo(), elementArea, entities)
                : null;
    }

    #copySingleElementsAt(x, y, graphics) {
        const defaultElement = graphics.getDefaults().getDefaultElement();
        const graphicsCommands = (brush) => graphics.drawLine(x, y, x, y, this.#size, brush, true);

        const elements = [];

        elements.push(...CopyUtils.copyNonSolidElements(graphicsCommands, defaultElement));

        elements.push(...CopyUtils.copySolidBodies(graphicsCommands, graphics, this.#solidBodyMaxArea, defaultElement));

        const [entities, entitiesElements] = CopyUtils.copyEntities(graphicsCommands, graphics, defaultElement);
        elements.push(...entitiesElements);

        return CopyUtils.trimmed(elements, entities);
    }

    // AREA ACTION

    isAreaModeEnabled() {
        return true;
    }

    applyArea(x1, y1, x2, y2, graphics, altModifier) {
        this.#insertScene = this.#createInsertTool(x1, y1, x2, y2, graphics);
    }

    #createInsertTool(x1, y1, x2, y2, graphics) {
        const [elementArea, entities] = this.#copyElements(x1, y1, x2, y2, graphics);
        return (elementArea !== null)
            ? new InsertElementAreaTool(new ToolInfo(), elementArea, entities)
            : null;
    }

    #copyElements(x1, y1, x2, y2, graphics) {
        const w = Math.abs(x1 - x2) + 1;
        const h = Math.abs(y1 - y2) + 1;
        const elementArea = ElementArea.create(w, h, ElementArea.TRANSPARENT_ELEMENT);
        const entities = [];

        const defaultElement = graphics.getDefaults().getDefaultElement();
        let empty = true;
        const brush = Brushes.custom((tx, ty, r, element) => {

            // process entities
            for (const entity of graphics.entities().getAt(tx, ty)) {
                if (entity.isActive()) {
                    const [serializedEntity] = entity.extract(defaultElement, x1, y1);
                    entities.push(serializedEntity);
                }
            }

            // process elements
            if (ElementHead.getTypeClass(element.elementHead) > ElementHead.TYPE_AIR) {
                let x = tx - Math.min(x1, x2);
                let y = ty - Math.min(y1, y2);
                elementArea.setElement(x, y, element);
                empty = false;
                return defaultElement;  // remove
            }
            return null;  // ignore
        });

        graphics.drawRectangle(x1, y1, x2, y2, brush, false);

        return (empty) ? null : [elementArea, entities];
    }

    // SECONDARY ACTION

    isSecondaryActionEnabled() {
        return (this.#insertScene !== null);
    }

    applySecondaryAction(x, y, graphics, altModifier) {
        this.#insertScene = null;
    }

    // CURSOR

    hasCursor() {
        return this.#insertScene !== null;
    }

    createCursor() {
        if (this.#insertScene !== null) {
            return this.#insertScene.createCursor();
        } else {
            return null;
        }
    }
}