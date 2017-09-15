import { Sprite } from '../sprite/Sprite';
import { Texture } from '../Texture';
import { TextFragment } from '../measureText';
export declare class CanvasRenderTarget {
    protected options: CanvasFrameBufferOptions;
    protected context: CanvasRenderingContext2D;
    protected isIdle: boolean;
    id: number;
    source: HTMLCanvasElement;
    hasSomethingToDraw: boolean;
    constructor();
    protected init(): void;
    update(sprite: Sprite<{}>): boolean;
    updateSource(): boolean;
    drawBgColor(): void;
    drawBorder(): void;
    drawTexture(): void;
    drawText(): void;
    drawBMFont(): void;
    protected createCanvas(): void;
    protected static instanceMap: {
        [id: number]: CanvasRenderTarget;
    };
    protected static instanceList: CanvasRenderTarget[];
    static create(id: number): CanvasRenderTarget;
    static remove(id: number): void;
}
export declare type CanvasFrameBufferOptions = {
    grid: number[];
    radius: number;
    width: number;
    height: number;
    bgColor: string;
    borderColor: string;
    borderWidth: number;
    texture: Texture;
    sourceX: number;
    sourceY: number;
    sourceWidth: number;
    sourceHeight: number;
    fontSize: number;
    fontColor: string;
    strokeColor: string;
    strokeWidth: number;
    fragmentsPos: {
        x: number;
        y: number;
        height?: number;
    }[];
    textLines: {
        fragments: TextFragment[];
        width: number;
    }[];
    bmfontLines: {
        width: number;
        fragments: Texture[];
    }[];
};
