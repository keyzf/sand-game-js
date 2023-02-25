import Spline from "cubic-spline";

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
        this.#lastLevel = new Array(graphics.getWidth()).fill(0);
    }

    level(layer, relative, brush, shuffleWithLevelBelow = 0) {
        const f = (typeof layer === 'number')
                ? TemplateLayeredPainter.#constant(layer)
                : TemplateLayeredPainter.#spline(layer);

        for (let x = 0; x < this.#graphics.getWidth(); x++) {
            const lastLevel = this.#lastLevel[x];

            const level = (relative)
                    ? lastLevel + f(x)
                    : f(x);

            if (lastLevel < level) {
                let count = 0;
                for (let i = lastLevel; i < level && i < this.#graphics.getHeight(); i++) {
                    let y = this.#graphics.getHeight() - 1 - i;
                    this.#graphics.draw(x, y, brush);
                    count++;
                }

                // shuffle
                if (shuffleWithLevelBelow > 0 && count > 0) {
                    for (let i = 0; i < shuffleWithLevelBelow; i++) {
                        let max = Math.max(count / 2, 10);
                        const r = this.#random.nextInt(Math.ceil(max)) - Math.trunc(max / 2);
                        const y1 = this.#graphics.getHeight() - 1 - lastLevel + r;
                        const y2 = this.#graphics.getHeight() - 1 - lastLevel + r + 1;
                        if (y1 < this.#graphics.getHeight() && y2 < this.#graphics.getHeight()) {
                            this.#elementArea.swap(x, y1, x, y2);
                        }
                    }
                }

                this.#lastLevel[x] = level;
            }
        }
        return this;
    }
}