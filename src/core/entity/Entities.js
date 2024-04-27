// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import ElementHead from "../ElementHead";
import ElementTail from "../ElementTail";
import Element from "../Element";
import Brushes from "../brush/Brushes";
import CyclicStateDefinition from "./CyclicStateProvider";
import StateBasedBirdLikeEntity from "./StateBasedBirdLikeEntity";
import StateBasedFishLikeEntity from "./StateBasedFishLikeEntity";

/**
 *
 * @author Patrik Harag
 * @version 2024-04-27
 */
export default class Entities {

    // bird

    static bird(x = undefined, y = undefined) {
        return { entity: 'bird', x: x, y: y };
    }

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

    static #BIRD_BRUSH = Brushes.color(0, 0, 0, Brushes.custom((x, y) => {
        // motion blur - ends of wings only
        const blurType = Math.abs(x) < 2 ? ElementTail.BLUR_TYPE_NONE : ElementTail.BLUR_TYPE_1;
        return new Element(
            ElementHead.of(
                ElementHead.type8(ElementHead.TYPE_STATIC),
                ElementHead.behaviour8(ElementHead.BEHAVIOUR_ENTITY, 0),
                ElementHead.modifiers8(ElementHead.HMI_CONDUCTIVE_1)),
            ElementTail.of(0, 0, 0, blurType))
    }));

    static birdFactory(serialized, gameState) {
        return new StateBasedBirdLikeEntity('bird', serialized, Entities.#BIRD_STATE_DEFINITION, Entities.#BIRD_BRUSH, gameState);
    }

    // fish

    static fish(x = undefined, y = undefined) {
        return { entity: 'fish', x: x, y: y };
    }

    static #FISH_STATE_DEFINITION = CyclicStateDefinition.create([
        [[0, 0], [1, 0]],
    ]);

    static #FISH_BRUSH = Brushes.color(0, 0, 0, Brushes.custom((x, y) => {
        return new Element(
            ElementHead.of(
                ElementHead.type8(ElementHead.TYPE_STATIC),
                ElementHead.behaviour8(ElementHead.BEHAVIOUR_ENTITY, 0),
                ElementHead.modifiers8(ElementHead.HMI_CONDUCTIVE_1)),
            ElementTail.of(0, 0, 0, ElementTail.BLUR_TYPE_NONE))
    }));

    static fishFactory(serialized, gameState) {
        return new StateBasedFishLikeEntity('fish', serialized, Entities.#FISH_STATE_DEFINITION, Entities.#FISH_BRUSH, gameState);
    }

    // ---

    static findFactoryByEntityType(type) {
        switch (type) {
            case 'bird':
                return Entities.birdFactory;
            case 'fish':
                return Entities.fishFactory;
        }
        return null;
    }
}