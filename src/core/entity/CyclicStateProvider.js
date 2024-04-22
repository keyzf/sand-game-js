// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

/**
 *
 * @author Patrik Harag
 * @version 2024-04-21
 */
export default class CyclicStateDefinition {

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
            stateTransitions.push(CyclicStateDefinition.#createStateTransition(states[i], states[i + 1 < states.length ? i + 1 : 0]));
        }
        return stateTransitions;
    }

    static create(states) {
        const transitions = CyclicStateDefinition.#createStateTransitionTable(states);

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

        return new CyclicStateDefinition(states, transitions, minX, maxX, minY, maxY);
    }


    #states;
    #transitions;
    #minX;
    #maxX;
    #minY;
    #maxY;

    constructor(states, transitions, minX, maxX, minY, maxY) {
        this.#states = states;
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