// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

/**
 *
 * @author Patrik Harag
 * @version 2024-05-05
 */
export default class StateDefinition {

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
            stateTransitions.push(StateDefinition.#createStateTransition(states[i], states[i + 1 < states.length ? i + 1 : 0]));
        }
        return stateTransitions;
    }

    static createCyclic(states) {
        const transitions = StateDefinition.#createStateTransitionTable(states);

        let minX = Number.MAX_VALUE;
        let minY = Number.MAX_VALUE;
        let maxX = Number.MIN_VALUE;
        let maxY = Number.MIN_VALUE;
        for (let state of states) {
            for (let [dx, dy] of state) {
                minX = Math.min(minX, dx);
                minY = Math.min(minY, dy);
                maxX = Math.max(maxX, dx);
                maxY = Math.max(maxY, dy);
            }
        }

        const masks = [];
        for (let state of states) {
            masks.push(new StateMask(state, minX, maxX, minY, maxY));
        }

        return new StateDefinition(states, masks, transitions, minX, maxX, minY, maxY);
    }


    #states;
    #masks;
    #transitions;
    #minX;
    #maxX;
    #minY;
    #maxY;

    constructor(states, masks, transitions, minX, maxX, minY, maxY) {
        this.#states = states;
        this.#masks = masks;
        this.#transitions = transitions;
        this.#minX = minX;
        this.#maxX = maxX;
        this.#minY = minY;
        this.#maxY = maxY;
    }

    getStates() {
        return this.#states;
    }

    getStatesCount() {
        return this.#states.length;
    }

    getMasks() {
        return this.#masks;
    }

    getTransitions() {
        return this.#transitions;
    }

    getMinX() {
        return this.#minX;
    }

    getMaxX() {
        return this.#maxX;
    }

    getMinY() {
        return this.#minY;
    }

    getMaxY() {
        return this.#maxY;
    }
}

/**
 *
 * @author Patrik Harag
 * @version 2024-05-05
 */
class StateMask {

    #minX;
    #maxX;
    #minY;
    #maxY;
    #array

    constructor(state, minX, maxX, minY, maxY) {
        this.#minX = minX;
        this.#maxX = maxX;
        this.#minY = minY;
        this.#maxY = maxY;

        const w = Math.abs(minX) + 1 + maxX;
        const h = Math.abs(minY) + 1 + maxY;
        const array = new Uint8Array(w * h);
        for (const [dx, dy] of state) {
            const x = dx - this.#minX;
            const y = dy - this.#minY;
            const i = x + (w * y);
            array[i] = 1;
        }
        this.#array = array;
    }

    matches(dx, dy) {
        if (dx < this.#minX || dy < this.#minY || dx > this.#maxX || dy > this.#maxY) {
            // out of bounds
            return false;
        }
        const w = Math.abs(this.#minX) + 1 + this.#maxX;
        const x = dx - this.#minX;
        const y = dy - this.#minY;
        const i = x + (w * y);
        return this.#array[i] === 1;
    }
}
