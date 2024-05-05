// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import Brushes from "../brush/Brushes";
import PositionedElement from "../PositionedElement";
import ElementHead from "../ElementHead";
import ElementArea from "../ElementArea";
import FloodFillPainter from "../FloodFillPainter";

/**
 *
 * @author Patrik Harag
 * @version 2024-04-27
 */
export default class CopyUtils {

    static copyNonSolidElements(graphicsCommands, replacementElement = null) {
        const elements = [];

        function canBeCopiedAsNonSolidElement(elementHead) {
            const elementTypeClass = ElementHead.getTypeClass(elementHead);
            if (elementTypeClass > ElementHead.TYPE_AIR && elementTypeClass < ElementHead.TYPE_STATIC) {
                return true;
            }
            return false;
        }

        const brush = Brushes.custom((tx, ty, r, element) => {
            if (canBeCopiedAsNonSolidElement(element.elementHead)) {
                elements.push(new PositionedElement(tx, ty, element.elementHead, element.elementTail));
                return replacementElement;  // remove
            }
            return null;  // ignore
        });

        graphicsCommands(brush);

        return elements;
    }

    static copySolidBodies(graphicsCommands, graphics, maxArea, replacementElement) {
        const elements = [];

        const brush = Brushes.custom((tx, ty, r, element) => {
            if (ElementHead.getTypeClass(element.elementHead) === ElementHead.TYPE_STATIC
                    && ElementHead.getTypeModifierSolidBodyId(element.elementHead) !== 0) {

                const newElements = CopyUtils.copySolidBody(tx, ty, graphics, maxArea, replacementElement);
                for (const newElement of newElements) {
                    elements.push(newElement);
                }
            }
            return null;  // ignore here
        });

        graphicsCommands(brush);

        return elements;
    }

    static copySolidBody(x, y, graphics, maxArea, replacementElement = null) {
        const solidBodyElements = [];
        const collectingBrush = Brushes.custom((tx, ty, random, element) => {
            solidBodyElements.push(new PositionedElement(tx, ty, element.elementHead, element.elementTail));
            return null;  // ignore here
        });
        graphics.floodFill(x, y, collectingBrush, FloodFillPainter.NEIGHBOURHOOD_SOLID_BODY);

        if (solidBodyElements.length > maxArea) {
            return [];  // too big
        }
        for (let solidBodyElement of solidBodyElements) {
            graphics.draw(solidBodyElement.x, solidBodyElement.y, replacementElement);
        }
        return solidBodyElements;
    }

    static copyEntities(graphicsCommands, graphics, defaultElement) {
        const elements = [];
        const entities = [];

        const brush = Brushes.custom((tx, ty, r, element) => {
            for (const entity of graphics.entities().getAt(tx, ty)) {
                if (entity.isActive()) {
                    const [extractedSerializedEntity, extractedElements] = entity.extract(defaultElement, 0, 0);
                    entities.push(extractedSerializedEntity);
                    elements.push(...extractedElements);
                }
            }
            return null;  // ignore
        });

        graphicsCommands(brush);

        return [entities, elements];
    }

    static trimmed(elements, entities) {
        if (elements.length === 0) {
            return [null, null];
        }

        let minX = Number.MAX_VALUE;
        let maxX = Number.MIN_VALUE;
        let minY = Number.MAX_VALUE;
        let maxY = Number.MIN_VALUE;
        for (const element of elements) {
            minX = Math.min(minX, element.x);
            maxX = Math.max(maxX, element.x);
            minY = Math.min(minY, element.y);
            maxY = Math.max(maxY, element.y);
        }
        const w = maxX - minX + 1;
        const h = maxY - minY + 1;

        // create element area
        const elementArea = ElementArea.create(w, h, ElementArea.TRANSPARENT_ELEMENT);
        for (const element of elements) {
            const tx = element.x - minX;
            const ty = element.y - minY;
            elementArea.setElement(tx, ty, element);
        }

        // map entities
        for (let serializedEntity of entities) {
            if (typeof serializedEntity.x === 'number') {
                serializedEntity.x -= minX;
            }
            if (typeof serializedEntity.y === 'number') {
                serializedEntity.y -= minY;
            }
        }

        return [elementArea, entities];
    }
}