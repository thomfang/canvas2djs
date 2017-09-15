export declare type Rect = {
    x: number;
    y: number;
    width: number;
    height: number;
};
/**
 * Sprite texture
 */
export declare class Texture {
    private static textureCache;
    private static loadingImages;
    private static loadedImages;
    private _readyCallbacks;
    private _gridSourceCache;
    private _gridSourceCount;
    static create(source: string | HTMLCanvasElement | HTMLImageElement, sourceRect?: Rect, textureRect?: Rect): Texture;
    static getByName(name: string): Texture;
    /**
     * 缓存Texture实例
     */
    static cacheAs(name: string, texture: Texture): void;
    /**
     * 清除缓存
     */
    static clearCache(name?: string): void;
    /**
     * Texture resource loading state
     */
    ready: boolean;
    width: number;
    height: number;
    source: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement;
    constructor(source: string | HTMLCanvasElement | HTMLImageElement, sourceRect?: Rect, textureRect?: Rect);
    onReady(callback: (size: {
        width: number;
        height: number;
    }) => any): void;
    createGridSource(w: number, h: number, sx: number, sy: number, sw: number, sh: number, grid: number[]): HTMLCanvasElement;
    clearCacheGridSources(): void;
    private _createByPath(path, sourceRect?, textureRect?);
    private _onImageLoaded(img, path, sourceRect, textureRect);
    private _createByImage(image, sourceRect?, textureRect?);
}
