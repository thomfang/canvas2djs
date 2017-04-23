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
export class Texture {

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
    static create(source: string | HTMLCanvasElement | HTMLImageElement, sourceRect?: Rect, textureRect?: Rect): Texture {
        var name = generateTextureName(source, sourceRect, textureRect);

        if (name && cache[name]) {
            return cache[name];
        }

        return new Texture(source, sourceRect, textureRect);
    }

    /**
     * @param  source  Drawable source
     * @param  rect    Clipping rect
     */
    constructor(source: string | HTMLCanvasElement | HTMLImageElement, sourceRect?: Rect, textureRect?: Rect) {
        var name: any = generateTextureName(source, sourceRect, textureRect);

        if (cache[name]) {
            return cache[name];
        }

        if (typeof source === 'string') {
            this._createByPath(source, sourceRect, textureRect);
        }
        else if ((source instanceof HTMLImageElement) || (source instanceof HTMLCanvasElement)) {
            this._createByImage(<HTMLImageElement>source, sourceRect, textureRect);
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

    private _createByPath(path: string, sourceRect?: Rect, textureRect?: Rect): void {
        var img: HTMLImageElement = new Image();

        img.onload = () => {
            this._createByImage(img, sourceRect, textureRect);

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

    private _createByImage(image: HTMLImageElement, sourceRect?: Rect, textureRect?: Rect): void {
        if (!sourceRect) {
            sourceRect = {
                x: 0,
                y: 0,
                width: image.width,
                height: image.height
            };
        }
        if (!textureRect) {
            textureRect = {
                x: 0,
                y: 0,
                width: sourceRect.width,
                height: sourceRect.height,
            };
        }

        var source: HTMLCanvasElement = createCanvas(image, sourceRect, textureRect);

        this.width = source.width;
        this.height = source.height;
        this.source = source;
        this.ready = true;
    }
}

function generateTextureName(source: any, sourceRect?: Rect, textureRect?: Rect): any {
    var isStr = typeof source === 'string';

    if (!isStr && !source.src) {
        return null;
    }

    var src = isStr ? source : source.src;
    var sourceRectStr = sourceRect ? [sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height].join(',') : '';
    var textureRectStr = textureRect ? [textureRect.x, textureRect.y, textureRect.width, textureRect.height].join(',') : '';

    return src + sourceRectStr + textureRectStr;
}

function createCanvas(image: HTMLImageElement, sourceRect: Rect, textureRect: Rect): HTMLCanvasElement {
    var canvas: HTMLCanvasElement = document.createElement("canvas");
    var context: CanvasRenderingContext2D = canvas.getContext('2d');

    canvas.width = textureRect.width;
    canvas.height = textureRect.height;

    context.drawImage(
        image, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height,
        textureRect.x, textureRect.y, textureRect.width, textureRect.height);

    return canvas;
}
