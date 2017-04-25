import { UIEvent } from './UIEvent';
import { Sprite } from './sprite/Sprite';
import { Action } from './action/Action';
import { EventEmitter } from './EventEmitter';

export enum ScaleMode {
    SHOW_ALL,
    NO_BORDER,
    FIX_WIDTH,
    FIX_HEIGHT,
    EXACTFIT,
}

export enum Orientation {
    LANDSCAPE,
    PORTRAIT,
}

export type VisibleRect = {
    left: number;
    right: number;
    top: number;
    bottom: number;
};

export class Stage extends EventEmitter {

    private _fps: number = 30;
    private _frameRate: number = 1000 / this._fps;
    private _isRunning: boolean;
    private _width: number = 0;
    private _height: number = 0;
    private _sprite: Sprite<{}>;
    private _visibleRect: VisibleRect;
    private _scaleX: number;
    private _scaleY: number;
    private _isPortrait: boolean;
    private _scaleMode: ScaleMode;
    private _autoAdjustCanvasSize: boolean;
    private _orientation: Orientation;
    private _canvas: HTMLCanvasElement;
    private _renderContext: CanvasRenderingContext2D;
    private _bufferCanvas: HTMLCanvasElement;
    private _bufferContext: CanvasRenderingContext2D;
    private _useExternalTimer: boolean;
    private _lastUpdateTime: number;
    private _timerId: number;
    private _uiEvent: UIEvent;
    private _touchEnabled: boolean;
    private _mouseEnabled: boolean;
    private _keyboardEnabled: boolean;

    get touchEnabled(): boolean {
        return this._touchEnabled;
    }

    set touchEnabled(enabled: boolean) {
        this._touchEnabled = enabled;
    }

    get mouseEnabled(): boolean {
        return this._mouseEnabled;
    }

    set mouseEnabled(enabled: boolean) {
        this._mouseEnabled = enabled;
    }

    get keyboardEnabled(): boolean {
        return this._keyboardEnabled;
    }

    set keyboardEnabled(enabled: boolean) {
        this._keyboardEnabled = enabled;
    }

    get fps(): number {
        return this._fps;
    }

    set fps(value: number) {
        this._frameRate = 1000 / value;
        this._fps = value;
    }

    get isRunning(): boolean {
        return this._isRunning;
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    get context(): CanvasRenderingContext2D {
        return this._renderContext;
    }

    get sprite(): Sprite<{}> {
        return this._sprite;
    }

    get visibleRect(): VisibleRect {
        return this._visibleRect;
    }

    get scaleX(): number {
        return this._scaleX;
    }

    get scaleY(): number {
        return this._scaleY;
    }

    get isPortrait() {
        return this._isPortrait;
    }

    get scaleMode(): ScaleMode {
        return this._scaleMode;
    }

    set scaleMode(value: ScaleMode) {
        if (value === this._scaleMode) {
            return;
        }

        this._scaleMode = value;
        this.adjustCanvasSize();
    }

    get autoAdjustCanvasSize() {
        return this._autoAdjustCanvasSize;
    }

    set autoAdjustCanvasSize(value: boolean) {
        if (value && !this._autoAdjustCanvasSize) {
            this._autoAdjustCanvasSize = true;
            this.adjustCanvasSize();
            window.addEventListener("resize", this.adjustCanvasSize);
        }
        else if (!value && this._autoAdjustCanvasSize) {
            this._autoAdjustCanvasSize = false;
            window.removeEventListener("resize", this.adjustCanvasSize);
        }
    }

    get orientation() {
        return this._orientation;
    }

    set orientation(orientation: Orientation) {
        if (this._orientation != orientation) {
            this._orientation = orientation;
        }
    }

    /**
     * @param  canvas     Canvas element
     * @param  width      Resolution design width
     * @param  height     Resolution design height
     * @param  scaleMode  Adjust resolution design scale mode 
     */
    constructor(
        canvas: HTMLCanvasElement,
        width: number,
        height: number,
        scaleMode: ScaleMode,
        autoAdjustCanvasSize?: boolean,
        orientation = Orientation.PORTRAIT
    ) {
        super();

        this._sprite = new Sprite({
            x: width * 0.5,
            y: height * 0.5,
            width: width,
            height: height
        });
        this._sprite.stage = this;
        this._scaleMode = scaleMode;

        this._canvas = canvas;
        this._renderContext = canvas.getContext('2d');

        this._bufferCanvas = document.createElement("canvas");
        this._bufferContext = this._bufferCanvas.getContext("2d");

        this._width = canvas.width = this._bufferCanvas.width = width;
        this._height = canvas.height = this._bufferCanvas.height = height;

        this._scaleX = this._scaleY = 1;
        this._isPortrait = false;
        this._visibleRect = { left: 0, right: width, top: 0, bottom: height };
        this.orientation = orientation;
        this.autoAdjustCanvasSize = autoAdjustCanvasSize;

        this._uiEvent = new UIEvent(this);
    }

    setSize(width: number, height: number) {
        this._width = this._canvas.width = this._bufferCanvas.width = width;
        this._height = this._canvas.height = this._bufferCanvas.height = height;

        if (this._autoAdjustCanvasSize) {
            this.adjustCanvasSize();
        }

        this._sprite.x = width * 0.5;
        this._sprite.y = height * 0.5;
        this._sprite.width = width;
        this._sprite.height = height;
    }

    adjustCanvasSize = () => {
        var canvas = this._canvas;
        var stageWidth = this._width;
        var stageHeight = this._height;
        var scaleMode = this._scaleMode;
        var visibleRect = this._visibleRect;
        var orientation = this._orientation;

        if (!canvas || !canvas.parentNode) {
            return;
        }

        var style = canvas.style;
        var container = {
            width: canvas.parentElement.offsetWidth,
            height: canvas.parentElement.offsetHeight
        };
        var isPortrait = container.width < container.height;

        if (orientation === Orientation.LANDSCAPE && isPortrait) {
            let tmpHeight = container.height;
            container.height = container.width;
            container.width = tmpHeight;
        }

        var sx: number = container.width / stageWidth;
        var sy: number = container.height / stageHeight;
        var deltaWidth: number = 0;
        var deltaHeight: number = 0;
        var scaleX: number;
        var scaleY: number;
        var width: number;
        var height: number;

        switch (scaleMode) {
            case ScaleMode.SHOW_ALL:
                if (sx < sy) {
                    scaleX = scaleY = sx;
                    width = container.width;
                    height = scaleX * stageHeight;
                }
                else {
                    scaleX = scaleY = sy;
                    width = scaleX * stageWidth;
                    height = container.height;
                }
                break;
            case ScaleMode.NO_BORDER:
                scaleX = scaleY = sx > sy ? sx : sy;
                width = stageWidth * scaleX;
                height = stageHeight * scaleX;
                deltaWidth = (stageWidth - container.width / scaleX) * 0.5 | 0;
                deltaHeight = (stageHeight - container.height / scaleX) * 0.5 | 0;
                break;
            case ScaleMode.FIX_WIDTH:
                scaleX = scaleY = sx;
                width = container.width;
                height = container.height * scaleX;
                deltaHeight = (stageHeight - container.height / scaleX) * 0.5 | 0;
                break;
            case ScaleMode.FIX_HEIGHT:
                scaleX = scaleY = sy;
                width = scaleX * container.width;
                height = container.height;
                deltaWidth = (stageWidth - container.width / scaleX) * 0.5 | 0;
                break;
            case ScaleMode.EXACTFIT:
                scaleX = sx;
                scaleY = sy;
                width = container.width;
                height = container.height;
                break;
            default:
                throw new Error(`Unknow stage scale mode "${scaleMode}"`);
        }

        style.width = width + 'px';
        style.height = height + 'px';
        style.position = 'absolute';

        visibleRect.left = deltaWidth;
        visibleRect.right = stageWidth - deltaWidth;
        visibleRect.top = deltaHeight;
        visibleRect.bottom = stageHeight - deltaHeight;

        if (orientation === Orientation.LANDSCAPE && isPortrait) {
            style.top = ((container.width - width) * 0.5) + 'px';
            style.left = ((container.height - height) * 0.5) + 'px';
            style.transformOrigin = style['webkitTransformOrigin'] = '0 0 0';
            style.transform = style['webkitTransform'] = `translateX(${height}px) rotate(90deg)`;
        }
        else {
            style.transform = '';
            style.top = ((container.height - height) * 0.5) + 'px';
            style.left = ((container.width - width) * 0.5) + 'px';
        }

        this._scaleX = scaleX;
        this._scaleY = scaleY;
        this._isPortrait = isPortrait;
    }

    start(useExternalTimer?: boolean): void {
        if (this._isRunning) {
            return;
        }

        this._useExternalTimer = !!useExternalTimer;

        if (!useExternalTimer) {
            this._lastUpdateTime = Date.now();
            this._startTimer();
        }

        this._uiEvent.register();
        this._isRunning = true;
    }

    step(deltaTime: number): void {
        (this._sprite as any)._update(deltaTime);
    }

    stop(unregisterUIEvent?: boolean): void {
        if (!this._isRunning) {
            return;
        }

        if (unregisterUIEvent) {
            this._uiEvent.unregister();
        }

        this._isRunning = false;
        clearTimeout(this._timerId);
    }

    render() {
        if (!this._isRunning) {
            return;
        }

        var { width, height } = this._canvas;

        this._bufferContext.clearRect(0, 0, width, height);
        (this._sprite as any)._visit(this._bufferContext);

        this._renderContext.clearRect(0, 0, width, height);
        this._renderContext.drawImage(this._bufferCanvas, 0, 0, width, height);
    }

    /**
     * Add sprite to the stage
     */
    addChild(child: Sprite<any>, position?: number): void {
        this._sprite.addChild(child, position);
    }

    /**
     * Remove sprite from the stage
     */
    removeChild(child: Sprite<any>): void {
        this._sprite.removeChild(child);
    }

    /**
     * Remove all sprites from the stage
     * @param  recusive  Recusize remove all the children
     */
    removeAllChildren(recusive?: boolean): void {
        this._sprite.removeAllChildren(recusive);
    }

    release() {
        this.stop(true);
        this._uiEvent.release();
        this._sprite.release(true);
        this._sprite = this._uiEvent = this._canvas = this._renderContext = this._bufferCanvas = this._bufferContext = null;
    }

    private _startTimer() {
        this._timerId = setTimeout(() => {
            if (this._useExternalTimer) {
                return;
            }

            var deltaTime: number = this._getDeltaTime();
            Action.schedule(deltaTime);
            (this._sprite as any)._update(deltaTime);
            this.render();
            this._startTimer();
        }, this._frameRate);
    }

    private _getDeltaTime() {
        var now = Date.now();
        var delta = now - this._lastUpdateTime;

        this._lastUpdateTime = now;
        return delta / 1000;
    }
}