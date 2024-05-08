// Sand Game JS; Patrik Harag, https://harag.cz; all rights reserved

import Extension from "./Extension";

/**
 *
 * @author Patrik Harag
 * @version 2024-05-08
 */
export default class ExtensionGenWaypoints extends Extension {

    /** @type GameState */
    #gameState;

    /**
     *
     * @param gameState {GameState}
     */
    constructor(gameState) {
        super();
        this.#gameState = gameState;
    }

    run() {
        if ((this.#gameState.processorContext.getIteration() + 700) % 1000 === 0) {
            this.#generateWaypoint('fish', 20, 5, 2);
        }
        if ((this.#gameState.processorContext.getIteration() + 800) % 1000 === 0) {
            this.#generateWaypoint('butterfly', 20, 5, 4);
        }
        if ((this.#gameState.processorContext.getIteration() + 900) % 1000 === 0) {
            this.#generateWaypoint('bird', 100, 50, 8);
        }
    }

    #generateWaypoint(entityType, maxHorDiff, maxVerDiff, maxVar) {
        const entities = this.#gameState.entityManager.getEntities().filter(e => e.getType() === entityType);
        if (entities.length > 0) {
            const random = this.#gameState.random;

            let groups;
            if (entities.length === 1) {
                groups = [[entities[0].getX(), entities[0].getY(), entities]];
            } else {
                let k = entities.length === 2 ? 1 : 2;
                if (random.next() < 0.2) {
                    // break groups sometimes...
                    k++;
                }
                groups = this.#kMeans(entities, k);
            }

            for (const [cx, cy, list] of groups) {
                let wx = cx + random.nextInt(2 * maxHorDiff) - maxHorDiff;
                let wy = cy + random.nextInt(2 * maxVerDiff) - maxVerDiff;

                const maxWidth = this.#gameState.elementArea.getWidth();
                wx = Math.abs(wx);
                if (wx >= maxWidth) {
                    wx = maxWidth - (wx - maxWidth);
                }

                const maxHeight = this.#gameState.elementArea.getHeight();
                wy = Math.abs(wy);
                if (wy >= maxHeight) {
                    wy = maxHeight - (wy - maxHeight);
                }

                for (let entity of list) {
                    if (typeof entity.assignWaypoint === 'function') {
                        const wyy = wy + random.nextInt(2 * maxVar) - maxVar;
                        const wxx = wx + random.nextInt(2 * maxVar) - maxVar;
                        entity.assignWaypoint(wxx, wyy);
                    }
                }
            }
        }
    }

    #kMeans(entities, k) {
        // Initialize centroids randomly
        let centroids = entities.slice(0, k);

        let assignment = new Array(entities.length);
        let clusters = new Array(k);

        while (true) {
            // Assign each entity to the closest centroid
            for (let i = 0; i < entities.length; i++) {
                let minDistance = Infinity;
                for (let j = 0; j < k; j++) {
                    let dx = entities[i].getX() - centroids[j].getX();
                    let dy = entities[i].getY() - centroids[j].getY();
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < minDistance) {
                        minDistance = distance;
                        assignment[i] = j;
                    }
                }
            }

            // Calculate new centroids
            let newCentroids = new Array(k);
            for (let i = 0; i < k; i++) {
                clusters[i] = [];
                let sumX = 0, sumY = 0, count = 0;
                for (let j = 0; j < entities.length; j++) {
                    if (assignment[j] === i) {
                        sumX += entities[j].getX();
                        sumY += entities[j].getY();
                        count++;
                        clusters[i].push(entities[j]);
                    }
                }
                const cx = Math.round(sumX / count);
                const cy = Math.round(sumY / count);
                newCentroids[i] = { getX: () => cx, getY: () => cy };
            }

            // Check for convergence
            let converged = true;
            for (let i = 0; i < k; i++) {
                if (centroids[i].getX() !== newCentroids[i].getX() || centroids[i].getY() !== newCentroids[i].getY()) {
                    converged = false;
                    break;
                }
            }

            if (converged) {
                break;
            }

            centroids = newCentroids;
        }

        // Return the result
        let result = [];
        for (let i = 0; i < k; i++) {
            result.push([centroids[i].getX(), centroids[i].getY(), clusters[i]]);
        }
        return result;
    }
}