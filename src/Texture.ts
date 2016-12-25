var cache: { [index: string]: Texture } = {};
var loaded: { [index: string]: boolean } = {};
var loading: { [index: string]: boolean } = {};

export type Rect = {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * Sprite texture
 */
export default class Texture {

    private _readyCallbacks: any[] = [];

    /**
     * Texture resource loading state
     */
    ready: boolean = false;

    width: number = 0;
    height: number = 0;

    /**
     * Texture drawable source
     */
    source: HTMLCanvasElement;

    /**
     * Create a texture by source and clipping rectangle
     * @param  source  Drawable source
     * @param  rect    Clipping rect
     */
    static create(source: string | HTMLCanvasElement | HTMLImageElement, rect?: Rect): Texture {
        var name = getName(source, rect);

        if (name && cache[name]) {
            return cache[name];
        }

        return new Texture(source, rect);
    }

    /**
     * @param  source  Drawable source
     * @param  rect    Clipping rect
     */
    constructor(source: string | HTMLCanvasElement | HTMLImageElement, rect?: Rect) {
        var name: any = getName(source, rect);
        
        if (cache[name]) {
            return cache[name];
        }

        if (typeof source === 'string') {
            this._createByPath(source, rect);
        }
        else if ((source instanceof HTMLImageElement) || (source instanceof HTMLCanvasElement)) {
            this._createByImage(<HTMLImageElement>source, rect);
        }
        else {
            throw new Error("Invalid texture source");
        }

        if (name) {
            cache[name] = this;
        }
    }

    public onReady(callback: (size: { width: number, height: number }) => any) {
        if (this.ready) {
            callback({ width: this.width, height: this.height });
        }
        else {
            this._readyCallbacks.push(callback);
        }
    }

    private _createByPath(path: string, rect?: Rect): void {
        var img: HTMLImageElement = new Image();

        img.onload = () => {
            this._createByImage(img, rect);

            // if (!loaded[path]) {
            //     console.log(`canvas2d: "${path}" loaded.`);
            // }
            loaded[path] = true;

            if (this._readyCallbacks.length) {
                let size = { width: this.width, height: this.height };
                this._readyCallbacks.forEach((callback) => {
                    callback(size);
                });
                this._readyCallbacks.length = 0;
            }
            img = null;
        };

        img.onerror = () => {
            img = null;
            console.warn(`canvas2d: Texture creating fail, error loading source "${path}".`);
        };

        // if (!loading[path]) {
        //     console.log(`canvas2d: Start to load: "${path}".`);
        // }

        img.src = path;
        loading[path] = true;
    }

    private _createByImage(image: HTMLImageElement, rect?: Rect): void {
        if (!rect) {
            rect = {
                x: 0,
                y: 0,
                width: image.width,
                height: image.height
            };
        }

        var source: HTMLCanvasElement = createCanvas(image, rect);

        this.width = source.width;
        this.height = source.height;
        this.source = source;
        this.ready = true;
    }
}

function getName(source: any, rect?: Rect): any {
    var isStr = typeof source === 'string';

    if (!isStr && !source.src) {
        return null;
    }

    var src = isStr ? source : source.src;
    var str = rect ? [rect.x, rect.y, rect.width, rect.height].join(',') : '';

    return src + str;
}

function createCanvas(image: HTMLImageElement, rect: Rect): HTMLCanvasElement {
    var canvas: HTMLCanvasElement = document.createElement("canvas");
    var context: CanvasRenderingContext2D = canvas.getContext('2d');

    canvas.width = rect.width;
    canvas.height = rect.height;

    context.drawImage(image, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);

    return canvas;
}