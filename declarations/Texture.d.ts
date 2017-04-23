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
    private _readyCallbacks;
    /**
     * Texture resource loading state
     */
    ready: boolean;
    width: number;
    height: number;
    /**
     * Texture drawable source
     */
    source: HTMLCanvasElement;
    /**
     * Create a texture by source and clipping rectangle
     * @param  source  Drawable source
     * @param  rect    Clipping rect
     */
    static create(source: string | HTMLCanvasElement | HTMLImageElement, sourceRect?: Rect, textureRect?: Rect): Texture;
    /**
     * @param  source  Drawable source
     * @param  rect    Clipping rect
     */
    constructor(source: string | HTMLCanvasElement | HTMLImageElement, sourceRect?: Rect, textureRect?: Rect);
    onReady(callback: (size: {
        width: number;
        height: number;
    }) => any): void;
    private _createByPath(path, sourceRect?, textureRect?);
    private _createByImage(image, sourceRect?, textureRect?);
}
