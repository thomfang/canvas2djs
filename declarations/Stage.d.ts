import { Sprite } from './sprite/Sprite';
import { EventEmitter } from './EventEmitter';
export declare enum ScaleMode {
    SHOW_ALL = 0,
    NO_BORDER = 1,
    FIX_WIDTH = 2,
    FIX_HEIGHT = 3,
    EXACTFIT = 4,
}
export declare enum Orientation {
    LANDSCAPE = 0,
    PORTRAIT = 1,
}
export declare type VisibleRect = {
    left: number;
    right: number;
    top: number;
    bottom: number;
};
export declare class Stage extends EventEmitter {
    private _fps;
    private _frameRate;
    private _isRunning;
    private _width;
    private _height;
    private _sprite;
    private _visibleRect;
    private _scaleX;
    private _scaleY;
    private _isPortrait;
    private _scaleMode;
    private _autoAdjustCanvasSize;
    private _orientation;
    private _canvas;
    private _renderContext;
    private _bufferCanvas;
    private _bufferContext;
    private _useExternalTimer;
    private _lastUpdateTime;
    private _timerId;
    private _uiEvent;
    touchEnabled: boolean;
    mouseEnabled: boolean;
    fps: number;
    readonly isRunning: boolean;
    readonly width: number;
    readonly height: number;
    readonly canvas: HTMLCanvasElement;
    readonly context: CanvasRenderingContext2D;
    readonly sprite: Sprite<{}>;
    readonly visibleRect: VisibleRect;
    readonly scaleX: number;
    readonly scaleY: number;
    readonly isPortrait: boolean;
    scaleMode: ScaleMode;
    autoAdjustCanvasSize: boolean;
    orientation: Orientation;
    /**
     * @param  canvas     Canvas element
     * @param  width      Resolution design width
     * @param  height     Resolution design height
     * @param  scaleMode  Adjust resolution design scale mode
     */
    constructor(canvas: HTMLCanvasElement, width: number, height: number, scaleMode: ScaleMode, autoAdjustCanvasSize?: boolean, orientation?: Orientation);
    setSize(width: number, height: number): void;
    adjustCanvasSize: () => void;
    start(useExternalTimer?: boolean): void;
    step(deltaTime: number): void;
    stop(unregisterUIEvent?: boolean): void;
    render(): void;
    /**
     * Add sprite to the stage
     */
    addChild(child: Sprite<any>, position?: number): void;
    /**
     * Remove sprite from the stage
     */
    removeChild(child: Sprite<any>): void;
    /**
     * Remove all sprites from the stage
     * @param  recusive  Recusize remove all the children
     */
    removeAllChildren(recusive?: boolean): void;
    release(): void;
    private _startTimer();
    private _getDeltaTime();
}
