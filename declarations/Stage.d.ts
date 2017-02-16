import { Sprite } from './sprite/Sprite';
export declare enum ScaleMode {
    SHOW_ALL = 0,
    NO_BORDER = 1,
    FIX_WIDTH = 2,
    FIX_HEIGHT = 3,
}
export declare type VisibleRect = {
    left: number;
    right: number;
    top: number;
    bottom: number;
};
export declare class Stage {
    private _fps;
    private _frameRate;
    private _isRunning;
    private _width;
    private _height;
    private _rootSprite;
    private _visibleRect;
    private _canvasScale;
    private _scaleMode;
    private _autoAdjustCanvasSize;
    private _canvasElement;
    private _renderContext;
    private _bufferCanvas;
    private _bufferContext;
    private _useExternalTimer;
    private _lastUpdateTime;
    private _eventLoopTimerId;
    private _uiEvent;
    touchEnabled: boolean;
    mouseEnabled: boolean;
    keyboardEnabled: boolean;
    fps: number;
    readonly isRunning: boolean;
    readonly width: number;
    readonly height: number;
    readonly canvas: HTMLCanvasElement;
    readonly context: CanvasRenderingContext2D;
    readonly sprite: Sprite<{}>;
    readonly visibleRect: VisibleRect;
    readonly scale: number;
    scaleMode: ScaleMode;
    autoAdjustCanvasSize: boolean;
    /**
     * @param  canvas     Canvas element
     * @param  width      Resolution design width
     * @param  height     Resolution design height
     * @param  scaleMode  Adjust resolution design scale mode
     */
    constructor(canvas: HTMLCanvasElement, width: number, height: number, scaleMode: ScaleMode, autoAdjustCanvasSize?: boolean);
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
