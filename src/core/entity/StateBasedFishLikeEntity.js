// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import ElementHead from "../ElementHead";
import EntityUtils from "./EntityUtils";
import StateBasedAbstractEntity from "./StateBasedAbstractEntity";

/**
 *
 * @author Patrik Harag
 * @version 2024-05-05
 */
export default class StateBasedFishLikeEntity extends StateBasedAbstractEntity {

    static #MAX_AVG_TEMPERATURE = 10;

    static #MAX_STUCK_COUNT = 1000;

    constructor(type, serialized, stateDefinition, brush, gameState) {
        super(type, serialized, stateDefinition, brush, gameState);
    }

    _checkIsSpace(elementHead) {
        if (ElementHead.getTypeClass(elementHead) !== ElementHead.TYPE_FLUID) {
            return false;
        }
        return true;
    }

    performAfterProcessing() {
        this._iteration++;

        let isActive = (this._state !== -1);
        let isFalling = false;

        if (isActive) {
            const [retIsActive, retIsFalling] = this.#doCheckState();
            isActive = retIsActive;
            isFalling = retIsFalling;
        }

        if (isActive) {
            if (isFalling) {
                this._moveForced(0, 1);
            } else if (this._iteration % 14 === 0) {
                if (this._waypoint !== null) {
                    if (this._waypoint.stuck === 3) {
                        this._waypoint.stuck = -10;  // try random walk now...
                    }
                    if (this._waypoint.stuck >= 0) {
                        this._moveInWaypointDirection(1);
                    } else {
                        this._waypoint.stuck++;
                        this._moveRandom(1);
                    }
                } else {
                    this._moveRandom(1);
                }
            }
        }

        if (isActive && this._stateDefinition.getStatesCount() > 1 && this._iteration % 10 === 0) {
            this._incrementState();
        }

        return isActive;
    }

    #doCheckState() {
        const x = this._x;
        const y = this._y;
        const points = this._stateDefinition.getStates()[this._state];

        let heavyElementAbove = false;  // at least one
        let lightElementsAbove = true;  // all
        let waterElementsAbove = true;  // all

        let lightElementsBelow = true;  // all
        let waterElementsBelow = true;  // all

        let totalTemperature = 0;

        for (const [dx, dy] of points) {
            const ex = x + dx;
            const ey = y + dy;

            const elementHead = this._elementArea.getElementHeadOrNull(ex, ey);
            if (elementHead === null) {
                // lost body part / out of bounds
                return [this._kill(), false];
            }

            if (ElementHead.getBehaviour(elementHead) !== ElementHead.BEHAVIOUR_ENTITY) {
                // lost body part
                return [this._kill(), false];
            }

            totalTemperature += ElementHead.getTemperature(elementHead);

            // update
            this._elementArea.setElementHead(ex, ey, ElementHead.setSpecial(elementHead, 0));

            // check element above
            if (!heavyElementAbove || lightElementsAbove || waterElementsAbove) {
                const elementHeadOrNull = this._elementArea.getElementHeadOrNull(ex, ey - 1);
                if (!heavyElementAbove) {
                    heavyElementAbove = EntityUtils.isElementFallingHeavy(elementHeadOrNull);
                }
                if (lightElementsAbove) {
                    lightElementsAbove = EntityUtils.isElementLight(elementHeadOrNull);
                }
                if (waterElementsAbove) {
                    waterElementsAbove = EntityUtils.isElementWater(elementHeadOrNull)
                            || EntityUtils.isElementEntity(elementHeadOrNull);
                }
            }

            // check element below
            if (lightElementsBelow || waterElementsBelow) {
                const elementHeadOrNull = this._elementArea.getElementHeadOrNull(ex, ey + 1);
                if (lightElementsBelow) {
                    lightElementsBelow = EntityUtils.isElementLight(elementHeadOrNull);
                }
                if (waterElementsBelow) {
                    waterElementsBelow = EntityUtils.isElementWater(elementHeadOrNull)
                            || EntityUtils.isElementEntity(elementHeadOrNull);
                }
            }
        }

        if (totalTemperature / points.length > StateBasedFishLikeEntity.#MAX_AVG_TEMPERATURE) {
            // killed by temperature
            return [this._kill(), false];
        }

        if (!waterElementsAbove || !waterElementsBelow) {
            // not enough water
            this._stuck++;
        }

        if (this._stuck > StateBasedFishLikeEntity.#MAX_STUCK_COUNT) {
            // stuck to death
            return [this._kill(), false];
        }

        const falling = heavyElementAbove  // dragged
            || lightElementsBelow  // falling
            || (lightElementsAbove && waterElementsBelow);  // force submerge

        return [true, falling];
    }
}