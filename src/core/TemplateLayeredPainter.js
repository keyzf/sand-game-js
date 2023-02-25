import Spline from "cubic-spline";
import { Brushes } from "./Brushes.js";
import { ProcessorModuleGrass } from "./ProcessorModuleGrass.js";
import { ProcessorModuleTree } from "./ProcessorModuleTree.js";

/**
 *
 * @author Patrik Harag
 * @version 2023-02-25
 */
export class TemplateLayeredPainter {

    static #spline(points) {
        const xs = new Array(points.length);
        const ys = new Array(points.length);
        for (let i = 0; i < points.length; i++) {
            xs[i] = points[i][0];
            ys[i] = points[i][1];
        }
        const spline = new Spline(xs, ys);
        return function (x) {
            return Math.max(Math.trunc(spline.at(x)), 0);
        };
    }

    static #constant(height) {
        return function(x) {
            return Math.trunc(height);
        };
    }


    /** @type ElementArea */
    #elementArea;

    /** @type SandGameGraphics */
    #graphics;

    /** @type DeterministicRandom */
    #random;

    #lastLevel;

    /**
     *
     * @param elementArea {ElementArea}
     * @param graphics {SandGameGraphics}
     * @param random {DeterministicRandom}
     */
    constructor(elementArea, graphics, random) {
        this.#elementArea = elementArea;
        this.#graphics = graphics;
        this.#random = random;
        this.#lastLevel = new Array(elementArea.getWidth()).fill(0);
    }

    level(layer, relative, brush, shuffleWithLevelBelow = 0) {
        const f = (typeof layer === 'number')
                ? TemplateLayeredPainter.#constant(layer)
                : TemplateLayeredPainter.#spline(layer);

        for (let x = 0; x < this.#elementArea.getWidth(); x++) {
            const lastLevel = this.#lastLevel[x];

            const level = (relative)
                    ? lastLevel + f(x)
                    : f(x);

            if (lastLevel < level) {
                let count = 0;
                for (let i = lastLevel; i < level && i < this.#elementArea.getHeight(); i++) {
                    let y = this.#elementArea.getHeight() - 1 - i;
                    this.#graphics.draw(x, y, brush);
                    count++;
                }

                // shuffle
                if (shuffleWithLevelBelow > 0 && count > 0) {
                    for (let i = 0; i < shuffleWithLevelBelow; i++) {
                        const max = Math.min(Math.trunc(count / 2), 10);
                        if (max > 1) {
                            const r = this.#random.nextInt(Math.ceil(max)) - Math.trunc(max / 2);
                            const y1 = this.#elementArea.getHeight() - 1 - lastLevel + r;
                            const y2 = this.#elementArea.getHeight() - 1 - lastLevel + r + 1;
                            if (y1 < this.#elementArea.getHeight() && y2 < this.#elementArea.getHeight()) {
                                this.#elementArea.swap(x, y1, x, y2);
                            }
                        }
                    }
                }

                this.#lastLevel[x] = level;
            }
        }
        return this;
    }

    grass() {
        for (let x = 0; x < this.#elementArea.getWidth(); x++) {
            const lastLevel = this.#lastLevel[x];
            const y = this.#elementArea.getHeight() - 1 - lastLevel;

            if (ProcessorModuleGrass.canGrowUpHere(this.#elementArea, x, y)) {
                ProcessorModuleGrass.spawnHere(this.#elementArea, x, y, Brushes.GRASS, this.#random);
            }
        }
        return this;
    }

    tree(x, type = 0) {
        if (x >= this.#elementArea.getWidth()) {
            return;  // out of bounds
        }

        const lastLevel = this.#lastLevel[x];
        const y = this.#elementArea.getHeight() - 1 - lastLevel;

        ProcessorModuleTree.spawnHere(this.#elementArea, x, y, type, Brushes.TREE, this.#random);
        return this;
    }
}