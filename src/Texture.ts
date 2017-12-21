import { CanvasSource } from "./CanvasSource";

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

    private static textureCache: { [index: string]: Texture } = {};
    private static loadingImages: { [index: string]: HTMLImageElement } = {};
    private static loadedImages: { [path: string]: HTMLImageElement } = {};

    private _readyCallbacks: any[] = [];
    private _gridSourceCache: { [key: string]: CanvasSource } = {};
    private _gridSourceCount = 0;

    public static retryTimes: number = 2;
    public static version: string;

    public static create(source: string | HTMLCanvasElement | HTMLImageElement, sourceRect?: Rect, textureRect?: Rect): Texture {
        var name = getCacheKey(source, sourceRect, textureRect);

        if (name && this.textureCache[name]) {
            return this.textureCache[name];
        }

        return new Texture(source, sourceRect, textureRect);
    }

    public static getByName(name: string) {
        return this.textureCache[name];
    }

    /**
     * 缓存Texture实例
     */
    public static cacheAs(name: string, texture: Texture) {
        this.textureCache[name] = texture;
    }

    /**
     * 清除缓存
     */
    public static clearCache(name?: string) {
        if (name != null) {
            let texture = this.textureCache[name];
            if (texture) {
                texture.clearCacheGridSources();
            }
            delete this.textureCache[name];
        }
        else {
            this.textureCache = {};
        }
    }

    /**
     * Texture resource loading state
     */
    ready: boolean = false;

    width: number = 0;
    height: number = 0;
    name: string;

    source: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement;

    private canvasSource: CanvasSource;

    constructor(source: string | HTMLCanvasElement | HTMLImageElement, sourceRect?: Rect, textureRect?: Rect) {
        var name: any = getCacheKey(source, sourceRect, textureRect);

        if (Texture.textureCache[name]) {
            return Texture.textureCache[name];
        }

        if (typeof source === 'string') {
            this._createByPath(source, sourceRect, textureRect, Texture.retryTimes);
        }
        else if ((source instanceof HTMLImageElement) || (source instanceof HTMLCanvasElement)) {
            this._createByImage(<HTMLImageElement>source, sourceRect, textureRect);
        }
        else {
            throw new Error("Invalid texture source");
        }

        if (name) {
            this.name = name;
            Texture.textureCache[name] = this;
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
        w = Math.ceil(w);
        h = Math.ceil(h);

        let cacheKey = [w, h, sx, sy, sw, sh, grid].join(':');

        if (this._gridSourceCache[cacheKey]) {
            return this._gridSourceCache[cacheKey].canvas;
        }

        const [top, right, bottom, left, repeat] = grid;
        let grids = [
            { x: 0, y: 0, w: left, h: top, sx: sx, sy: sy, sw: left, sh: top }, // left top
            { x: w - right, y: 0, w: right, h: top, sx: sx + sw - right, sy: sy, sw: right, sh: top }, // right top
            { x: 0, y: h - bottom, w: left, h: bottom, sx: sx, sy: sy + sh - bottom, sw: left, sh: bottom }, // left bottom
            { x: w - right, y: h - bottom, w: right, h: bottom, sx: sx + sw - right, sy: sh - bottom + sy, sw: right, sh: bottom }, // right bottom
            { x: left, y: 0, w: w - left - right, h: top, sx: sx + left, sy: sy, sw: sw - left - right, sh: top }, // top
            { x: left, y: h - bottom, w: w - left - right, h: bottom, sx: sx + left, sy: sh - bottom + sy, sw: sw - left - right, sh: bottom }, // bottom
            { x: 0, y: top, w: left, h: h - top - bottom, sx: sx, sy: top, sw: left, sh: sh - top - bottom }, // left
            { x: w - right, y: top, w: right, h: h - top - bottom, sx: sx + sw - right, sy: top, sw: right, sh: sh - top - bottom }, // right
        ];
        let centerGrid = { x: left, y: top, w: w - left - right, h: h - top - bottom, sx: sx + left, sy: top, sw: sw - left - right, sh: sh - top - bottom };
        let source = CanvasSource.create();
        let canvas = source.canvas;
        let context = source.context;
        source.setSize(w, h);

        for (let i = 0, l = grids.length; i < l; i++) {
            let g = grids[i];
            if (g.w && g.h) {
                context.drawImage(this.source, g.sx, g.sy, g.sw, g.sh,
                    Math.ceil(g.x),
                    Math.ceil(g.y),
                    Math.ceil(g.w),
                    Math.ceil(g.h));
            }
        }

        if (repeat) {
            let cvs = getRepeatPatternSource(this.source, {
                x: centerGrid.sx,
                y: centerGrid.sy,
                width: centerGrid.sw,
                height: centerGrid.sh,
            },
                centerGrid.sw,
                centerGrid.sh
            );
            let pattern = context.createPattern(cvs, "repeat");
            context.fillStyle = pattern;
            context.fillRect(Math.ceil(centerGrid.x), Math.ceil(centerGrid.y), Math.ceil(centerGrid.w), Math.ceil(centerGrid.h));
        }
        else if (centerGrid.w && centerGrid.h) {
            context.drawImage(this.source, centerGrid.sx, centerGrid.sy, centerGrid.sw, centerGrid.sh,
                Math.ceil(centerGrid.x),
                Math.ceil(centerGrid.y),
                Math.ceil(centerGrid.w),
                Math.ceil(centerGrid.h));
        }

        this._gridSourceCache[cacheKey] = source;
        this._gridSourceCount += 1;
        return canvas;
    }

    public clearCacheGridSources() {
        for (let k in this._gridSourceCache) {
            this._gridSourceCache[k].recycle();
        }
        this._gridSourceCache = {};
        this._gridSourceCount = 0;
    }

    public destroy() {
        if (this.canvasSource) {
            this.canvasSource.recycle();
        }
        this.clearCacheGridSources();
        this._readyCallbacks.length = 0;
        this.source = this.canvasSource = null;
    }

    private _createByPath(path: string, sourceRect: Rect, textureRect: Rect, retryTimes: number): void {
        if (Texture.loadedImages[path]) {
            return this._onImageLoaded(img, path, sourceRect, textureRect);
        }
        var img: HTMLImageElement = Texture.loadingImages[path] || new Image();
        var onLoad = () => {
            this._onImageLoaded(img, path, sourceRect, textureRect);
            img.removeEventListener("load", onLoad);
            img.removeEventListener("error", onError);
        };
        var onError = () => {
            img.removeEventListener("load", onLoad);
            img.removeEventListener("error", onError);
            delete Texture.loadingImages[path];
            img = null;
            if (retryTimes) {
                this._createByPath(path, sourceRect, textureRect, --retryTimes);
            }
            else {
                this._readyCallbacks.length = 0;
                if (this.name != null) {
                    delete Texture.textureCache[this.name];
                }
            }
            console.warn(`canvas2d: Texture creating fail, error loading source "${path}".`);
        };

        img.addEventListener('load', onLoad);
        img.addEventListener('error', onError);

        let src = Texture.version != null ? path + '?v=' + Texture.version : path;

        if (!Texture.loadingImages[path]) {
            img.crossOrigin = 'anonymous';
            Texture.loadingImages[path] = img;
            img.src = src;
        }
    }

    private _onImageLoaded(img: HTMLImageElement, path: string, sourceRect: Rect, textureRect: Rect) {
        this._createByImage(img, sourceRect, textureRect);

        Texture.loadedImages[path] = img;
        delete Texture.loadingImages[path];

        if (this._readyCallbacks.length) {
            let size = { width: this.width, height: this.height };
            for (let i = 0, callback: Function; callback = this._readyCallbacks[i]; i++) {
                callback(size);
            }
            this._readyCallbacks.length = 0;
        }
        img = null;
    }

    private _createByImage(image: HTMLImageElement, sourceRect: Rect, textureRect: Rect): void {
        var source;

        if (!sourceRect && !textureRect) {
            source = image;
        }
        else {
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

            // source = createCanvas(image, sourceRect, textureRect);

            let canvasSource = this.canvasSource = CanvasSource.create();
            canvasSource.setSize(textureRect.width, textureRect.height);
            canvasSource.context.drawImage(
                image, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height,
                textureRect.x, textureRect.y, sourceRect.width, sourceRect.height);

            source = canvasSource.canvas;
        }

        this.width = source.width;
        this.height = source.height;
        this.source = source;
        this.ready = true;
    }
}

function getCacheKey(source: any, sourceRect: Rect, textureRect: Rect): any {
    var isStr = typeof source === 'string';

    if (!isStr && !source.src) {
        return null;
    }

    var src = isStr ? source : source.src;
    var sourceRectStr = sourceRect ? [sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height].join(',') : '';
    var textureRectStr = textureRect ? [textureRect.x, textureRect.y, textureRect.width, textureRect.height].join(',') : '';

    return src + sourceRectStr + textureRectStr;
}

// function createCanvas(image: any, sourceRect: Rect, textureRect: Rect): HTMLCanvasElement {
//     var canvas: HTMLCanvasElement = document.createElement("canvas");
//     var context: CanvasRenderingContext2D = canvas.getContext('2d');

//     canvas.width = textureRect.width;
//     canvas.height = textureRect.height;

//     context.drawImage(
//         image, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height,
//         textureRect.x, textureRect.y, sourceRect.width, sourceRect.height);

//     return canvas;
// }

let cvs: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

function getRepeatPatternSource(source: any, sourceRect: Rect, canvasWidth: number, canvasHeight: number) {
    if (!cvs) {
        cvs = document.createElement("canvas");
        ctx = cvs.getContext("2d");
    }
    cvs.width = canvasWidth;
    cvs.height = canvasHeight;
    ctx.drawImage(
        source, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height,
        0, 0, sourceRect.width, sourceRect.height
    );
    return cvs;
}
