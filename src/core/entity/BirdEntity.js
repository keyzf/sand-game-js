// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import ElementHead from "../ElementHead";
import ElementTail from "../ElementTail";
import Entity from "./Entity";
import Brushes from "../brush/Brushes";
import Element from "../Element";

/**
 *
 * @author Patrik Harag
 * @version 2024-04-19
 */
export default class BirdEntity extends Entity {

    static #WORLD_BOUNDARY = 10;

    static #BIRD = Brushes.color(0, 0, 0, Brushes.random([
        new Element(
            ElementHead.of(
                ElementHead.type8(ElementHead.TYPE_STATIC),
                ElementHead.behaviour8(0),
                ElementHead.modifiers8(ElementHead.HMI_CONDUCTIVE_1)),
            ElementTail.of(0, 0, 0, ElementTail.BLUR_TYPE_NONE))
    ]));


    #iteration = 0;
    #x = 0;
    #y = 0;
    #state = 0;

    constructor(x, y) {
        super();
        this.#x = x;
        this.#y = y;
    }

    #iterate(state, x, y, handler) {
        let part3; let part4;
        switch (state) {
            case 0:
            case 4:
                part3 = -1; part4 = -1;
                break;
            case 1:
                part3 = -1; part4 = -2;
                break;
            case 2:
                part3 = -2; part4 = -2;
                break;
            case 3:
                part3 = -2; part4 = -1;
                break;
            case 5:
            case 7:
                part3 = 0; part4 = 0;
                break;
            case 6:
                part3 = 0; part4 = 1;
                break;
            default:
                part3 = -1; part4 = -1;
        }

        handler(x, y, 1);
        handler(x + 1, y - 1, 2);
        handler(x - 1, y - 1, 2);
        handler(x + 2, y + part3, 3);
        handler(x - 2, y + part3, 3);
        handler(x + 3, y + part4, 4);
        handler(x - 3, y + part4, 4);
    }

    performBeforeProcessing(elementArea, random, defaults) {
        this.#repaint(elementArea, random);
    }

    performAfterProcessing(elementArea, random, defaults) {
        this.#iteration++;

        if (this.#iteration % 11 === 0) {
            // random move
            const xChange = random.nextInt(3) - 1;
            const yChange = random.nextInt(3) - 1;
            const [nx, ny] = this.#tryMove(this.#x, this.#y, xChange, yChange, elementArea);

            if (nx !== this.#x || ny !== this.#y) {
                // erase
                this.#iterate(this.#state, this.#x, this.#y, (x, y) => {
                    elementArea.setElement(x, y, defaults.getDefaultElement());
                });

                this.#x = nx;
                this.#y = ny;

                // repaint
                this.#repaint(elementArea, random);
            }
        }

        if (this.#iteration % 10 === 0) {
            // increment state

            // erase
            this.#iterate(this.#state, this.#x, this.#y, (x, y) => {
                elementArea.setElement(x, y, defaults.getDefaultElement());
            });

            this.#state++;
            if (this.#state === 8) {
                this.#state = 0;
            }

            // repaint
            this.#repaint(elementArea, random);
        }
    }

    #tryMove(x, y, xChange, yChange, elementArea) {
        // check boundaries

        if (x + xChange < BirdEntity.#WORLD_BOUNDARY && xChange < 0) {
            xChange = 0;
        }
        if (x + xChange > elementArea.getWidth() - BirdEntity.#WORLD_BOUNDARY && xChange > 0) {
            xChange = 0;
        }

        if (y + yChange < BirdEntity.#WORLD_BOUNDARY && yChange < 0) {
            yChange = 0;
        }
        if (y + yChange > elementArea.getHeight() - BirdEntity.#WORLD_BOUNDARY && yChange > 0) {
            yChange = 0;
        }

        // check obstacles

        function checkIsSpace(tx, ty) {
            const targetElementHead = elementArea.getElementHead(tx, ty);
            if (ElementHead.getTypeClass(targetElementHead) > ElementHead.TYPE_GAS) {
                return false;
            }
            if (ElementHead.getBehaviour(targetElementHead) === ElementHead.BEHAVIOUR_FIRE) {
                return false;
            }
            return true;
        }

        // test right | right
        if (xChange > 0 || xChange < 0) {
            for (let i = -3; i <= 2; i++) {
                if (!checkIsSpace(x + (xChange * 5), y + yChange + i)) {
                    xChange = 0;
                    break;
                }
            }
        }

        // test above | below
        if (yChange > 0 || yChange < 0) {
            for (let i = -5; i <= 5; i++) {
                if (!checkIsSpace(x + xChange + i, y + (yChange * 5))) {
                    yChange = 0;
                    break;
                }
            }
        }

        return [x + xChange, y + yChange];
    }

    #repaint(elementArea, random) {
        this.#iterate(this.#state, this.#x, this.#y, (x, y, part) => {
            const element = BirdEntity.#BIRD.apply(x, y, random);
            if (part < 3) {
                elementArea.setElement(x, y, element);
            } else {
                // add motion blur - ends of wings only
                const elementHead = element.elementHead;
                const elementTail = ElementTail.setBlurType(element.elementTail, ElementTail.BLUR_TYPE_1);
                elementArea.setElementHeadAndTail(x, y, elementHead, elementTail);
            }
        });
    }
}