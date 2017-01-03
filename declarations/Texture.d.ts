export declare type Rect = {
    x: number;
    y: number;
    width: number;
    height: number;
};
/**
 * Sprite texture
 */
export default class Texture {
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
    static create(source: string | HTMLCanvasElement | HTMLImageElement, rect?: Rect): Texture;
    /**
     * @param  source  Drawable source
     * @param  rect    Clipping rect
     */
    constructor(source: string | HTMLCanvasElement | HTMLImageElement, rect?: Rect);
    onReady(callback: (size: {
        width: number;
        height: number;
    }) => any): void;
    private _createByPath(path, rect?);
    private _createByImage(image, rect?);
}
