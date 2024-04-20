// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import Brushes from "../brush/Brushes";
import PositionedElement from "../PositionedElement";
import ElementHead from "../ElementHead";
import ElementArea from "../ElementArea";
import FloodFillPainter from "../FloodFillPainter";

/**
 *
 * @author Patrik Harag
 * @version 2024-04-20
 */
export default class CopyUtils {

    static copySingleElements(graphicsCommands, replacementElement = null) {
        const elements = [];

        const brush = Brushes.custom((tx, ty, r, element) => {
            if (CopyUtils.#canBeCopiedAsSingleElement(element.elementHead)) {
                elements.push(new PositionedElement(tx, ty, element.elementHead, element.elementTail));
                return replacementElement;  // remove
            }
            return null;  // ignore
        });

        graphicsCommands(brush);

        return elements;
    }

    static #canBeCopiedAsSingleElement(elementHead) {
        const elementTypeClass = ElementHead.getTypeClass(elementHead);
        if (elementTypeClass > ElementHead.TYPE_AIR && elementTypeClass < ElementHead.TYPE_STATIC) {
            return true;
        }
        const behaviour = ElementHead.getBehaviour(elementHead);
        if (behaviour === ElementHead.BEHAVIOUR_FISH || behaviour === ElementHead.BEHAVIOUR_FISH_BODY) {
            return true;
        }
        return false;
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

    static asTrimmedElementArea(elements) {
        if (elements.length === 0) {
            return null;
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

        const elementArea = ElementArea.create(w, h, ElementArea.TRANSPARENT_ELEMENT);
        for (const element of elements) {
            const tx = element.x - minX;
            const ty = element.y - minY;
            elementArea.setElement(tx, ty, element);
        }
        return elementArea;
    }
}