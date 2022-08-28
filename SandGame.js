
/**
 *
 * @author Patrik Harag
 * @version 2022-08-28
 */
export class SandGame {

    /** @type ElementArea */
    #elementArea;

    /** @type FastRandom */
    #random;

    /** @type FPSCounter */
    #fpsCounter;

    /** @type ElementProcessor */
    #processor;

    /** @type DoubleBufferedRenderer */
    #renderer;

    /** @type number */
    #width;

    /** @type number */
    #height;

    /** @type function[] */
    #onRendered = [];

    /**
     *
     * @param context {CanvasRenderingContext2D}
     * @param width {number}
     * @param height {number}
     */
    constructor(context, width, height) {
        this.#elementArea = new ElementArea(width, height);
        this.#random = new FastRandom(0);
        this.#fpsCounter = new FPSCounter();
        this.#processor = new ElementProcessor(width, height, this.#random);
        this.#renderer = new DoubleBufferedRenderer(width, height, context);
        this.#width = width;
        this.#height = height;
    }

    start() {
        let interval = Math.trunc(1000 / 100);  // ms
        setInterval(() => this.next(), interval);
    }

    next() {
        this.#processor.next(this.#elementArea);
        this.#renderer.render(this.#elementArea);

        let t2 = Date.now();
        this.#fpsCounter.tick(t2)

        for (let func of this.#onRendered) {
            func();
        }
    }

    /**
     *
     * @param x {number}
     * @param y {number}
     * @param brush {Brush}
     */
    draw(x, y, brush) {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                let xx = x+5-j;
                let yy = y+5-i;
                if (this.#elementArea.isValidPosition(xx, yy)) {
                    let element = brush.apply(xx, yy);
                    this.#elementArea.setElement(xx, yy, element);
                }
            }
        }
    }

    addOnRendered(onRenderedFunc) {
        this.#onRendered.push(onRenderedFunc);
    }

    getFPS() {
        return this.#fpsCounter.getFPS();
    }
}

class Brush {
    apply(x, y) {
        throw 'Not implemented'
    }
}

class RandomBrush extends Brush {
    #elements;

    constructor(elements) {
        super();
        this.#elements = elements;
    }

    apply(x, y) {
        return this.#elements[Math.trunc(Math.random() * this.#elements.length)];
    }
}

class FPSCounter {

    #currentFPS = 0;
    #FPS = 0;
    #start = 0;

    tick(currentTimeMillis) {
        this.#currentFPS++;
        if (currentTimeMillis - this.#start >= 1000) {
            this.#FPS = this.#currentFPS;
            this.#currentFPS = 0;
            this.#start = currentTimeMillis;
        }
    }

    getFPS() {
        return this.#FPS;
    }
}

/**
 *
 * @author Patrik Harag
 * @version 2022-08-28
 */
class FastRandom {
    /** @type number */
    #last;

    constructor(seed) {
        this.#last = seed;
    }

    // TODO: Deterministic fast random.

    nextInt(max) {
        return Math.trunc(Math.random() * max);
    }
}

/**
 *
 * @author Patrik Harag
 * @version 2022-08-28
 */
class ElementArea {
    static LITTLE_ENDIAN = true;

    /** @type number */
    #width;

    /** @type number */
    #height;

    /** @type DataView */
    #buffer;

    constructor(width, height) {
        this.#width = width;
        this.#height = height;
        this.#buffer = new DataView(new ArrayBuffer(width * height * 4));

        // set default elements
        let air = Elements.of(Elements.ELEMENT_TYPE_AIR, 255, 255, 255);
        for (let y = 0; y < this.#height; y++) {
            for (let x = 0; x < this.#width; x++) {
                this.setElement(x, y, air);
            }
        }
    }

    isValidPosition(x, y) {
        if (x < 0 || y < 0) {
            return false;
        }
        if (x >= this.#width || y >= this.#height) {
            return false;
        }
        return true;
    }

    setElement(x, y, element) {
        let byteOffset = (this.#width * y + x) * 4;
        this.#buffer.setUint32(byteOffset, element, ElementArea.LITTLE_ENDIAN);
    }

    getElement(x, y) {
        let byteOffset = (this.#width * y + x) * 4;
        return this.#buffer.getUint32(byteOffset, ElementArea.LITTLE_ENDIAN);
    }

    getWidth() {
        return this.#width;
    }

    getHeight() {
        return this.#height;
    }
}

/**
 *
 * @author Patrik Harag
 * @version 2022-08-28
 */
class Elements {

    static ELEMENT_TYPE_AIR = 0;
    static ELEMENT_TYPE_WALL = 1;
    static ELEMENT_TYPE_SAND_1 = 2;
    static ELEMENT_TYPE_SAND_2 = 3;

    static of(type, r, g, b) {
        return (((((type << 8) | r) << 8) | g) << 8) | b
    }

    static getType(element) {
        return (element >> 24) & 0x000000FF;
    }

    static getColorRed(element) {
        return (element >> 16) & 0x000000FF;
    }

    static getColorGreen(element) {
        return (element >> 8) & 0x000000FF;
    }

    static getColorBlue(element) {
        return element & 0x000000FF;
    }
}

class ElementProcessor {

    /** @type number */
    #width;

    /** @type number */
    #height;

    /** @type FastRandom */
    #random;

    static RANDOM_DATA_COUNT = 100;

    /** @type Uint32Array[] */
    #randData = [];

    constructor(width, height, random) {
        this.#width = width;
        this.#height = height;
        this.#random = random;

        // init random data
        this.#randData = [];
        for (let i = 0; i < ElementProcessor.RANDOM_DATA_COUNT; i++) {
            let array = new Uint32Array(width);
            for (let j = 0; j < width; j++) {
                array[j] = this.#random.nextInt(width);
            }
            this.#randData.push(array);
        }
    }

    /**
     *
     * @param elementArea {ElementArea}
     */
    next(elementArea) {
        for (let y = this.#height - 1; y >= 0; y--) {
            let dataIndex = Math.trunc(this.#random.nextInt(ElementProcessor.RANDOM_DATA_COUNT));
            let data = this.#randData[dataIndex];

            for (let i = 0; i < this.#width; i++) {
                let x = data[i];
                this.#nextPoint(elementArea, x, y);
            }
        }
    }

    #nextPoint(elementArea, x, y) {
        let element = elementArea.getElement(x, y);
        let type = Elements.getType(element);

        if (type === Elements.ELEMENT_TYPE_SAND_1) {
            //   #
            //  ###
            // #####

            if (!this.#move(elementArea, element, x, y, x, y + 1)) {
                let rnd = this.#random.nextInt(2);
                if (rnd === 0) {
                    this.#move(elementArea, element, x, y, x + 1, y + 1)
                } else {
                    this.#move(elementArea, element, x, y, x - 1, y + 1)
                }
            }
        } else if (type === Elements.ELEMENT_TYPE_SAND_2) {
            //     #
            //   #####
            // #########

            if (!this.#move(elementArea, element, x, y, x, y + 1)) {
                let rnd = this.#random.nextInt(2);
                if (rnd === 0) {
                    if (!this.#move(elementArea, element, x, y, x + 1, y + 1)) {
                        this.#move(elementArea, element, x, y, x + 2, y + 1)
                    }
                } else {
                    if (!this.#move(elementArea, element, x, y, x - 1, y + 1)) {
                        this.#move(elementArea, element, x, y, x - 2, y + 1)
                    }
                }
            }
        }
    }

    #move(elementArea, element, x, y, x2, y2) {
        if (!elementArea.isValidPosition(x2, y2)) {
            return false;
        }

        let element2 = elementArea.getElement(x2, y2);
        let type2 = Elements.getType(element2);

        if (type2 === 0) {
            elementArea.setElement(x2, y2, element);
            elementArea.setElement(x, y, element2);
            return true;
        }
        return false;
    }
}

/**
 *
 * @author Patrik Harag
 * @version 2022-08-27
 */
class DoubleBufferedRenderer {

    /** @type CanvasRenderingContext2D */
    #context;

    /** @type number */
    #width;

    /** @type number */
    #height;

    /** @type ImageData */
    #buffer;

    constructor(width, height, context) {
        this.#context = context;
        this.#width = width;
        this.#height = height;
        this.#buffer = this.#context.createImageData(width, height);

        // set up alpha color component
        let data = this.#buffer.data;
        for (let y = 0; y < this.#height; y++) {
            for (let x = 0; x < this.#width; x++) {
                let index = 4 * (this.#width * y + x);
                data[index + 3] = 0xFF;
            }
        }
    }

    /**
     *
     * @param elementArea ElementArea
     */
    render(elementArea) {
        let data = this.#buffer.data;

        for (let y = 0; y < this.#height; y++) {
            for (let x = 0; x < this.#width; x++) {
                let element = elementArea.getElement(x, y);

                let index = (this.#width * y + x) * 4;
                data[index] = Elements.getColorRed(element);
                data[index + 1] = Elements.getColorGreen(element);
                data[index + 2] = Elements.getColorBlue(element);
                // data[index + 3] = 0xFF;
            }
        }

        this.#context.putImageData(this.#buffer, 0, 0, 0, 0, this.#width, this.#height);
    }
}

export class Brushes {
    static AIR = new RandomBrush([
        Elements.of(Elements.ELEMENT_TYPE_AIR, 255, 255, 255)
    ]);

    static WALL = new RandomBrush([
        Elements.of(Elements.ELEMENT_TYPE_WALL, 55, 55, 55),
        Elements.of(Elements.ELEMENT_TYPE_WALL, 57, 57, 57)
    ]);

    static SAND = new RandomBrush([
        Elements.of(Elements.ELEMENT_TYPE_SAND_2, 214, 212, 154),
        Elements.of(Elements.ELEMENT_TYPE_SAND_2, 214, 212, 154),
        Elements.of(Elements.ELEMENT_TYPE_SAND_2, 214, 212, 154),
        Elements.of(Elements.ELEMENT_TYPE_SAND_2, 214, 212, 154),
        Elements.of(Elements.ELEMENT_TYPE_SAND_2, 225, 217, 171),
        Elements.of(Elements.ELEMENT_TYPE_SAND_2, 225, 217, 171),
        Elements.of(Elements.ELEMENT_TYPE_SAND_2, 225, 217, 171),
        Elements.of(Elements.ELEMENT_TYPE_SAND_2, 225, 217, 171),
        Elements.of(Elements.ELEMENT_TYPE_SAND_2, 203, 201, 142),
        Elements.of(Elements.ELEMENT_TYPE_SAND_2, 203, 201, 142),
        Elements.of(Elements.ELEMENT_TYPE_SAND_2, 203, 201, 142),
        Elements.of(Elements.ELEMENT_TYPE_SAND_2, 203, 201, 142),
        Elements.of(Elements.ELEMENT_TYPE_SAND_2, 195, 194, 134),
        Elements.of(Elements.ELEMENT_TYPE_SAND_2, 195, 194, 134),
        Elements.of(Elements.ELEMENT_TYPE_SAND_2, 218, 211, 165),
        Elements.of(Elements.ELEMENT_TYPE_SAND_2, 218, 211, 165),
        Elements.of(Elements.ELEMENT_TYPE_SAND_2, 223, 232, 201),
        Elements.of(Elements.ELEMENT_TYPE_SAND_2, 186, 183, 128),
    ]);

    static SOIL = new RandomBrush([
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 142, 104,  72),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 142, 104,  72),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 142, 104,  72),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 142, 104,  72),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 142, 104,  72),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 142, 104,  72),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 114,  81,  58),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 114,  81,  58),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 114,  81,  58),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 114,  81,  58),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 114,  81,  58),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 114,  81,  58),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1,  82,  64,  30),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1,  82,  64,  30),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1,  82,  64,  30),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 177, 133,  87),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 177, 133,  87),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 177, 133,  87),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 102, 102, 102),
    ]);

    static STONE = new RandomBrush([
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 131, 131, 131),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 131, 131, 131),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 131, 131, 131),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 131, 131, 131),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 131, 131, 131),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 131, 131, 131),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 135, 135, 135),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 135, 135, 135),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 135, 135, 135),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 135, 135, 135),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 135, 135, 135),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 135, 135, 135),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 145, 145, 145),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 145, 145, 145),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 145, 145, 145),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 145, 145, 145),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 145, 145, 145),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 145, 145, 145),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 148, 148, 148),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 148, 148, 148),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 148, 148, 148),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 148, 148, 148),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 148, 148, 148),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 148, 148, 148),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 160, 160, 160),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 160, 160, 160),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 160, 160, 160),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 160, 160, 160),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 160, 160, 160),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 160, 160, 160),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 114, 114, 114),
        Elements.of(Elements.ELEMENT_TYPE_SAND_1, 193, 193, 193),
    ]);
}