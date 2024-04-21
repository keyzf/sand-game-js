// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import ElementHead from "../ElementHead";
import ElementTail from "../ElementTail";
import ElementArea from "../ElementArea";
import Element from "../Element";
import Entity from "./Entity";
import Brushes from "../brush/Brushes";
import DeterministicRandom from "../DeterministicRandom";

/**
 *
 * @author Patrik Harag
 * @version 2024-04-21
 */
export default class BirdEntity extends Entity {

    static #WORLD_BOUNDARY = 10;

    static #MAX_AVG_TEMPERATURE = 50

    static #BIRD_BRUSH = Brushes.color(0, 0, 0, Brushes.random([
        new Element(
            ElementHead.of(
                ElementHead.type8(ElementHead.TYPE_STATIC),
                ElementHead.behaviour8(ElementHead.BEHAVIOUR_ENTITY),
                ElementHead.modifiers8(ElementHead.HMI_CONDUCTIVE_1)),
            ElementTail.of(0, 0, 0, ElementTail.BLUR_TYPE_NONE))
    ]));

    static #STATES = [
        [[0, 0], [1, -1], [-1, -1], [2, -1], [-2, -1], [3, -1], [-3, -1]],
        [[0, 0], [1, -1], [-1, -1], [2, -1], [-2, -1], [3, -2], [-3, -2]],
        [[0, 0], [1, -1], [-1, -1], [2, -2], [-2, -2], [3, -2], [-3, -2]],
        [[0, 0], [1, -1], [-1, -1], [2, -2], [-2, -2], [3, -1], [-3, -1]],
        [[0, 0], [1, -1], [-1, -1], [2, -1], [-2, -1], [3, -1], [-3, -1]],
        [[0, 0], [1, -1], [-1, -1], [2,  0], [-2,  0], [3,  0], [-3,  0]],
        [[0, 0], [1, -1], [-1, -1], [2,  0], [-2,  0], [3,  1], [-3,  1]],
        [[0, 0], [1, -1], [-1, -1], [2,  0], [-2,  0], [3,  0], [-3,  0]],
    ];

    static #createStateTransition(stateFrom, stateTo) {
        const transitions = [];
        for (let i = 0; i < stateFrom.length; i++) {
            const [ax, ay] = stateFrom[i];
            const [bx, by] = stateTo[i];
            if (ax === bx && ay === by) {
                continue;  // no change
            }
            transitions.push([[ax, ay], [bx, by]]);
        }
        return transitions;
    }

    static #createStateTransitionTable(states) {
        const stateTransitions = [];
        for (let i = 0; i < states.length; i++) {
            stateTransitions.push(BirdEntity.#createStateTransition(states[i], states[i + 1 < states.length ? i + 1 : 0]));
        }
        return stateTransitions;
    }

    static #STATE_TRANSITIONS = BirdEntity.#createStateTransitionTable(BirdEntity.#STATES);


    #iteration = 0;
    #x = 0;
    #y = 0;
    #state = 0;

    constructor(serialized) {
        super();
        if (serialized.iteration !== undefined) {
            this.#iteration = serialized.iteration;
        }
        if (serialized.x !== undefined) {
            this.#x = serialized.x;
        }
        if (serialized.y !== undefined) {
            this.#y = serialized.y;
        }
        if (serialized.state !== undefined) {
            this.#state = serialized.state;
        } else {
            // random state by default
            this.#state = DeterministicRandom.DEFAULT.nextInt(8);
        }
    }

    serialize() {
        return {
            entity: 'bird',
            iteration: this.#iteration,
            x: this.#x,
            y: this.#y,
            state: this.#state,
        };
    }

    initialize(elementArea, random, defaults) {
        this.#paintAt(this.#x, this.#y, elementArea, random);
    }

    performBeforeProcessing(elementArea, random, defaults) {
        return this.#state !== -1;
    }

    performAfterProcessing(elementArea, random, defaults) {
        this.#iteration++;
        let isActive = this.#state !== -1;

        if (isActive) {
            // check state

            const x = this.#x;
            const y = this.#y;
            const points = BirdEntity.#STATES[this.#state];

            let totalTemperature = 0;
            for (const [dx, dy] of points) {
                const ex = x + dx;
                const ey = y + dy;

                let elementHead = elementArea.getElementHeadOrNull(ex, ey);
                if (elementHead === null) {
                    // lost body part / out of bounds
                    return this.#kill(elementArea);
                }

                if (ElementHead.getBehaviour(elementHead) !== ElementHead.BEHAVIOUR_ENTITY) {
                    // lost body part
                    return this.#kill(elementArea);
                }

                totalTemperature += ElementHead.getTemperature(elementHead);
            }

            if (totalTemperature / points.length > BirdEntity.#MAX_AVG_TEMPERATURE) {
                // killed by temperature
                return this.#kill(elementArea);
            }
        }

        if (isActive && this.#iteration % 11 === 0) {
            // random move

            const x = this.#x;
            const y = this.#y;

            const xChange = random.nextInt(3) - 1;
            const yChange = random.nextInt(3) - 1;
            const [nx, ny] = this.#countNewPosition(x, y, xChange, yChange, elementArea);

            if (nx !== x || ny !== y) {
                // move

                this.#relocate(elementArea, BirdEntity.#STATES[this.#state], x, y, nx, ny);

                this.#x = nx;
                this.#y = ny;
            }
        }

        if (isActive && this.#iteration % 10 === 0) {
            // increment state

            const x = this.#x;
            const y = this.#y;

            const transitions = BirdEntity.#STATE_TRANSITIONS[this.#state];
            for (const [[dx1, dy1], [dx2, dy2]] of transitions) {
                elementArea.swap(x + dx1, y + dy1, x + dx2, y + dy2);
            }

            this.#state++;
            if (this.#state === BirdEntity.#STATES.length) {
                this.#state = 0;
            }
        }

        return isActive;
    }

    #countNewPosition(x, y, xChange, yChange, elementArea) {
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

    #relocate(elementArea, state, x, y, nx, ny) {
        const sortedPoints = [...state];

        if (nx > x) {
            sortedPoints.sort((a, b) => b[0] - a[0]);
        } else if (nx < x) {
            sortedPoints.sort((a, b) => a[0] - b[0]);
        }
        if (ny > y) {
            sortedPoints.sort((a, b) => b[1] - a[1]);
        } else if (ny < y) {
            sortedPoints.sort((a, b) => a[1] - b[1]);
        }

        for (const [dx, dy] of sortedPoints) {
            elementArea.swap(x + dx, y + dy, nx + dx, ny + dy);
        }
    }

    #kill(elementArea) {
        const x = this.#x;
        const y = this.#y;

        for (const [dx, dy] of BirdEntity.#STATES[this.#state]) {
            const ex = x + dx;
            const ey = y + dy;

            const elementHead = elementArea.getElementHeadOrNull(ex, ey);
            if (elementHead === null) {
                continue;
            }

            if (ElementHead.getBehaviour(elementHead) !== ElementHead.BEHAVIOUR_ENTITY) {
                continue;
            }

            let newElementHead = elementHead;
            newElementHead = ElementHead.setType(newElementHead, ElementHead.type8Solid(ElementHead.TYPE_STATIC, 4, true));
            newElementHead = ElementHead.setBehaviour(newElementHead, ElementHead.BEHAVIOUR_NONE);
            newElementHead = ElementHead.setSpecial(newElementHead, 0);
            elementArea.setElementHead(ex, ey, newElementHead);
        }

        this.#state = -1;
        return false;  // not active
    }

    #paintAt(x, y, elementArea, random) {
        for (const [dx, dy] of BirdEntity.#STATES[this.#state]) {
            const ex = x + dx;
            const ey = y + dy;

            const element = BirdEntity.#BIRD_BRUSH.apply(ex, ey, random);
            if (Math.abs(dx) < 2) {
                elementArea.setElement(ex, ey, element);
            } else {
                // add motion blur - ends of wings only
                const elementHead = element.elementHead;
                const elementTail = ElementTail.setBlurType(element.elementTail, ElementTail.BLUR_TYPE_1);
                elementArea.setElementHeadAndTail(ex, ey, elementHead, elementTail);
            }
        }
    }

    asElementArea() {
        const elementArea = ElementArea.create(9, 9, ElementArea.TRANSPARENT_ELEMENT);
        this.#paintAt(4, 5, elementArea, DeterministicRandom.DEFAULT);
        return elementArea;
    }
}