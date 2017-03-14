import { UIEvent } from './UIEvent';
import { Sprite } from './sprite/Sprite';
import { Action } from './action/Action';

export enum ScaleMode {
    SHOW_ALL,
    NO_BORDER,
    FIX_WIDTH,
    FIX_HEIGHT
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

export class Stage {

    private _fps: number = 30;
    private _frameRate: number = 1000 / this._fps;
    private _isRunning: boolean;
    private _width: number = 0;
    private _height: number = 0;
    private _rootSprite: Sprite<{}>;
    private _visibleRect: VisibleRect;
    private _canvasScale: number;
    private _isPortrait: boolean;
    private _scaleMode: ScaleMode;
    private _autoAdjustCanvasSize: boolean;
    private _orientation: Orientation;
    private _canvasElement: HTMLCanvasElement;
    private _renderContext: CanvasRenderingContext2D;
    private _bufferCanvas: HTMLCanvasElement;
    private _bufferContext: CanvasRenderingContext2D;
    private _useExternalTimer: boolean;
    private _lastUpdateTime: number;
    private _eventLoopTimerId: number;
    private _uiEvent: UIEvent;

    touchEnabled: boolean;
    mouseEnabled: boolean;
    keyboardEnabled: boolean;

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
        return this._canvasElement;
    }

    get context(): CanvasRenderingContext2D {
        return this._renderContext;
    }

    get sprite(): Sprite<{}> {
        return this._rootSprite;
    }

    get visibleRect(): VisibleRect {
        return this._visibleRect;
    }

    get scale(): number {
        return this._canvasScale;
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
        this._rootSprite = new Sprite({
            x: width * 0.5,
            y: height * 0.5,
            width: width,
            height: height
        });

        this._scaleMode = scaleMode;

        this._canvasElement = canvas;
        this._renderContext = canvas.getContext('2d');

        this._bufferCanvas = document.createElement("canvas");
        this._bufferContext = this._bufferCanvas.getContext("2d");

        this._width = canvas.width = this._bufferCanvas.width = width;
        this._height = canvas.height = this._bufferCanvas.height = height;

        this._canvasScale = 1;
        this._isPortrait = false;
        this._visibleRect = { left: 0, right: width, top: 0, bottom: height };
        this.orientation = orientation;
        this.autoAdjustCanvasSize = autoAdjustCanvasSize;

        this._uiEvent = new UIEvent(this);
    }

    setSize(width: number, height: number) {
        this._width = this._canvasElement.width = this._bufferCanvas.width = width;
        this._height = this._canvasElement.height = this._bufferCanvas.height = height;

        if (this._autoAdjustCanvasSize) {
            this.adjustCanvasSize();
        }

        this._rootSprite.x = width * 0.5;
        this._rootSprite.y = height * 0.5;
        this._rootSprite.width = width;
        this._rootSprite.height = height;
    }

    adjustCanvasSize = () => {
        var canvasElement = this._canvasElement;
        var stageWidth = this._width;
        var stageHeight = this._height;
        var currentScaleMode = this._scaleMode;
        var visibleRect = this._visibleRect;
        var orientation = this._orientation;

        if (!canvasElement || !canvasElement.parentNode) {
            return;
        }

        var style = canvasElement.style;
        var container = {
            width: canvasElement.parentElement.offsetWidth,
            height: canvasElement.parentElement.offsetHeight
        };
        var isPortrait = container.width < container.height;

        if (orientation === Orientation.LANDSCAPE && isPortrait) {
            let tmpHeight = container.height;
            container.height = container.width;
            container.width = tmpHeight;
        }

        var scaleX: number = container.width / stageWidth;
        var scaleY: number = container.height / stageHeight;
        var deltaWidth: number = 0;
        var deltaHeight: number = 0;
        var scale: number;
        var width: number;
        var height: number;

        switch (currentScaleMode) {
            case ScaleMode.SHOW_ALL:
                if (scaleX < scaleY) {
                    scale = scaleX;
                    width = container.width;
                    height = scale * stageHeight;
                }
                else {
                    scale = scaleY;
                    width = scale * stageWidth;
                    height = container.height;
                }
                break;
            case ScaleMode.NO_BORDER:
                scale = scaleX > scaleY ? scaleX : scaleY;
                width = stageWidth * scale;
                height = stageHeight * scale;
                deltaWidth = (stageWidth - container.width / scale) * 0.5 | 0;
                deltaHeight = (stageHeight - container.height / scale) * 0.5 | 0;
                break;
            case ScaleMode.FIX_WIDTH:
                scale = scaleX;
                width = container.width;
                height = container.height * scale;
                deltaHeight = (stageHeight - container.height / scale) * 0.5 | 0;
                break;
            case ScaleMode.FIX_HEIGHT:
                scale = scaleY;
                width = scale * container.width;
                height = container.height;
                deltaWidth = (stageWidth - container.width / scale) * 0.5 | 0;
                break;
            default:
                throw new Error(`Unknow stage scale mode "${currentScaleMode}"`);
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

        this._canvasScale = scale;
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
        this._rootSprite._update(deltaTime);
    }

    stop(unregisterUIEvent?: boolean): void {
        if (!this._isRunning) {
            return;
        }

        if (unregisterUIEvent) {
            this._uiEvent.unregister();
        }

        this._isRunning = false;
        clearTimeout(this._eventLoopTimerId);
    }

    render() {
        if (!this._isRunning) {
            return;
        }

        var { width, height } = this._canvasElement;

        this._bufferContext.clearRect(0, 0, width, height);
        this._rootSprite._visit(this._bufferContext);

        this._renderContext.clearRect(0, 0, width, height);
        this._renderContext.drawImage(this._bufferCanvas, 0, 0, width, height);
    }

    /**
     * Add sprite to the stage
     */
    addChild(child: Sprite<any>, position?: number): void {
        this._rootSprite.addChild(child, position);
    }

    /**
     * Remove sprite from the stage
     */
    removeChild(child: Sprite<any>): void {
        this._rootSprite.removeChild(child);
    }

    /**
     * Remove all sprites from the stage
     * @param  recusive  Recusize remove all the children
     */
    removeAllChildren(recusive?: boolean): void {
        this._rootSprite.removeAllChildren(recusive);
    }

    release() {
        this.stop(true);
        this._uiEvent.release();
        this._rootSprite.release(true);
        this._rootSprite = this._uiEvent = this._canvasElement = this._renderContext = this._bufferCanvas = this._bufferContext = null;
    }

    private _startTimer() {
        this._eventLoopTimerId = setTimeout(() => {
            if (this._useExternalTimer) {
                return;
            }

            var deltaTime: number = this._getDeltaTime();
            Action.schedule(deltaTime);
            this._rootSprite._update(deltaTime);
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