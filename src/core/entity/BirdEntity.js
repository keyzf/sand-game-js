// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import ElementHead from "../ElementHead";
import ElementTail from "../ElementTail";
import ElementArea from "../ElementArea";
import Element from "../Element";
import Entity from "./Entity";
import Brushes from "../brush/Brushes";
import DeterministicRandom from "../DeterministicRandom";
import CyclicStateDefinition from "./CyclicStateProvider";

// TODO: waypoint(x, y)
// TODO: support collisions with other entities
// TODO: support flammability
// TODO: handle solid body / powder above
// TODO: handle cannot change state for a long time

/**
 * Simple bird-like entity.
 * The [0, 0] must be centered horizontally.
 *
 * @author Patrik Harag
 * @version 2024-04-22
 */
export default class BirdEntity extends Entity {

    static #BIRD_STATE_DEFINITION = CyclicStateDefinition.create([
        [[0, 0], [1, -1], [-1, -1], [2, -1], [-2, -1], [3, -1], [-3, -1]],
        [[0, 0], [1, -1], [-1, -1], [2, -1], [-2, -1], [3, -2], [-3, -2]],
        [[0, 0], [1, -1], [-1, -1], [2, -2], [-2, -2], [3, -2], [-3, -2]],
        [[0, 0], [1, -1], [-1, -1], [2, -2], [-2, -2], [3, -1], [-3, -1]],
        [[0, 0], [1, -1], [-1, -1], [2, -1], [-2, -1], [3, -1], [-3, -1]],
        [[0, 0], [1, -1], [-1, -1], [2,  0], [-2,  0], [3,  0], [-3,  0]],
        [[0, 0], [1, -1], [-1, -1], [2,  0], [-2,  0], [3,  1], [-3,  1]],
        [[0, 0], [1, -1], [-1, -1], [2,  0], [-2,  0], [3,  0], [-3,  0]],
    ]);

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


    /** @type CyclicStateDefinition */
    #stateDefinition;

    #iteration = 0;
    #x = 0;
    #y = 0;
    #state = 0;

    constructor(serialized) {
        super();
        this.#stateDefinition = BirdEntity.#BIRD_STATE_DEFINITION;

        if (serialized.iteration !== undefined) {
            this.#iteration = serialized.iteration;
        } else {
            // set randomly; so state change will not be on the same time
            this.#iteration = DeterministicRandom.DEFAULT.nextInt(this.#stateDefinition.getStatesCount());
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
            this.#state = DeterministicRandom.DEFAULT.nextInt(this.#stateDefinition.getStatesCount());
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
            const points = this.#stateDefinition.getStates()[this.#state];

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

                this.#relocate(elementArea, this.#stateDefinition.getStates()[this.#state], x, y, nx, ny);

                this.#x = nx;
                this.#y = ny;
            }
        }

        if (isActive && this.#iteration % 10 === 0) {
            // increment state

            const x = this.#x;
            const y = this.#y;

            const transitions = this.#stateDefinition.getTransitions()[this.#state];

            let allowed = true;
            for (const [[dx1, dy1], [dx2, dy2]] of transitions) {
                if (!elementArea.isValidPosition(x + dx1, y + dy1) || !this.#checkIsSpace(x + dx2, y + dy2, elementArea)) {
                    allowed = false;
                    break;
                }
            }

            if (allowed) {
                for (const [[dx1, dy1], [dx2, dy2]] of transitions) {
                    elementArea.swap(x + dx1, y + dy1, x + dx2, y + dy2);
                }

                this.#state++;
                if (this.#state === this.#stateDefinition.getStates().length) {
                    this.#state = 0;
                }
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

        // check further obstacles

        const EXTRA = 2;

        // test right | right
        if (xChange > 0 || xChange < 0) {
            for (let yy = this.#stateDefinition.getMinY() - EXTRA; yy <= this.#stateDefinition.getMaxY() + EXTRA; yy++) {
                if (!this.#checkIsSpace(x + (xChange * 5), y + yChange + yy, elementArea)) {
                    xChange = 0;
                    break;
                }
            }
        }

        // test above | below
        if (yChange > 0 || yChange < 0) {
            for (let xx = this.#stateDefinition.getMinX() - EXTRA; xx <= this.#stateDefinition.getMaxX() + EXTRA; xx++) {
                if (!this.#checkIsSpace(x + xChange + xx, y + (yChange * 5), elementArea)) {
                    yChange = 0;
                    break;
                }
            }
        }

        // check close obstacles

        for (const [dx, dy] of this.#stateDefinition.getStates()[this.#state]) {
            if (!this.#checkIsSpace(x + xChange + dx, y + yChange + dy, elementArea)) {
                xChange = 0;
                yChange = 0;
                break;
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

    #checkIsSpace(tx, ty, elementArea) {
        const targetElementHead = elementArea.getElementHeadOrNull(tx, ty);
        if (targetElementHead === null) {
            return false;
        }
        if (ElementHead.getTypeClass(targetElementHead) > ElementHead.TYPE_GAS) {
            return false;
        }
        if (ElementHead.getBehaviour(targetElementHead) === ElementHead.BEHAVIOUR_FIRE) {
            return false;
        }
        return true;
    }

    #kill(elementArea) {
        const x = this.#x;
        const y = this.#y;

        for (const [dx, dy] of this.#stateDefinition.getStates()[this.#state]) {
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
        for (const [dx, dy] of this.#stateDefinition.getStates()[this.#state]) {
            const ex = x + dx;
            const ey = y + dy;

            if (!elementArea.isValidPosition(ex, ey)) {
                continue;  // out of bounds
            }

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

    asElementArea(bounds = 0) {
        const w = Math.abs(this.#stateDefinition.getMinX() - this.#stateDefinition.getMaxX()) + 1 + (2 * bounds);
        const h = Math.abs(this.#stateDefinition.getMinY() - this.#stateDefinition.getMaxY()) + 1 + (2 * bounds);
        const elementArea = ElementArea.create(w, h, ElementArea.TRANSPARENT_ELEMENT);
        this.#paintAt(Math.trunc(w / 2), Math.trunc(h / 2), elementArea, DeterministicRandom.DEFAULT);
        return elementArea;
    }
}