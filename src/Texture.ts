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
    private _gridSourceCache: { [key: string]: HTMLCanvasElement } = {};
    private _gridSourceCount = 0;

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
    public static create(source: string | HTMLCanvasElement | HTMLImageElement, sourceRect?: Rect, textureRect?: Rect): Texture {
        var name = getCacheKey(source, sourceRect, textureRect);

        if (name && cache[name]) {
            return cache[name];
        }

        return new Texture(source, sourceRect, textureRect);
    }

    public static getByName(name: string) {
        return cache[name];
    }

    /**
     * 缓存Texture实例
     */
    public static cacheAs(name: string, texture: Texture) {
        cache[name] = texture;
    }

    /**
     * 清除缓存
     */
    public static clearCache(name?: string) {
        if (name != null) {
            let texture = cache[name];
            if (texture) {
                texture.clearCacheGridSources();
            }
            delete cache[name];
        }
        else {
            cache = {};
        }
    }

    /**
     * @param  source  Drawable source
     * @param  rect    Clipping rect
     */
    constructor(source: string | HTMLCanvasElement | HTMLImageElement, sourceRect?: Rect, textureRect?: Rect) {
        var name: any = getCacheKey(source, sourceRect, textureRect);

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

    public createGridSource(w: number, h: number, sx: number, sy: number, sw: number, sh: number, grid: number[]) {
        let cacheKey = getGridCacheKey(w, h, sx, sy, sw, sh, grid);

        if (this._gridSourceCache[cacheKey]) {
            return this._gridSourceCache[cacheKey];
        }

        const [top, right, bottom, left] = grid;
        let grids = [
            { x: 0, y: 0, w: left, h: top, sx: sx, sy: sy, sw: left, sh: top }, // left top
            { x: w - right, y: 0, w: right, h: top, sx: sx + sw - right, sy: sy, sw: right, sh: top }, // right top
            { x: 0, y: h - bottom, w: left, h: bottom, sx: sx, sy: sy + sh - bottom, sw: left, sh: bottom }, // left bottom
            { x: w - right, y: h - bottom, w: right, h: bottom, sx: sx + sw - right, sy: sh - bottom + sy, sw: right, sh: bottom }, // right bottom
            { x: left, y: 0, w: w - left - right, h: top, sx: sx + left, sy: sy, sw: sw - left - right, sh: top }, // top
            { x: left, y: h - bottom, w: w - left - right, h: bottom, sx: sx + left, sy: sh - bottom + sy, sw: sw - left - right, sh: bottom }, // bottom
            { x: 0, y: top, w: left, h: h - top - bottom, sx: sx, sy: top, sw: left, sh: sh - top - bottom }, // left
            { x: w - right, y: top, w: right, h: h - top - bottom, sx: sx + sw - right, sy: top, sw: right, sh: sh - top - bottom }, // right
            { x: left, y: top, w: w - left - right, h: h - top - bottom, sx: sx + left, sy: top, sw: sw - left - right, sh: sh - top - bottom }, // center
        ];
        let canvas = document.createElement("canvas");
        let context = canvas.getContext("2d");

        canvas.width = w;
        canvas.height = h;
        grids.forEach(g => {
            if (g.w && g.h) {
                context.drawImage(this.source, g.sx, g.sy, g.sw, g.sh,
                    Math.ceil(g.x),
                    Math.ceil(g.y),
                    Math.ceil(g.w),
                    Math.ceil(g.h));
            }
        });
        this._gridSourceCache[cacheKey] = canvas;
        this._gridSourceCount += 1;
        return canvas;
    }

    public clearCacheGridSources() {
        this._gridSourceCache = {};
        this._gridSourceCount = 0;
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

function getGridCacheKey(...args: any[]) {
    return args.join(':');
}

function getCacheKey(source: any, sourceRect?: Rect, textureRect?: Rect): any {
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
        textureRect.x, textureRect.y, sourceRect.width, sourceRect.height);

    return canvas;
}
