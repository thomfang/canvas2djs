/// <reference path="action.ts" />
/// <reference path="uievent.ts" />
/// <reference path="sprite.ts" />

namespace canvas2d.Stage {

    var eventloopTimerID: number;
    var lastUpdate: number;
    var bufferCanvas: HTMLCanvasElement;
    var bufferContext: CanvasRenderingContext2D;
    var stageScaleMode: ScaleMode;

    var isUseInnerTimer = true;

    /**
     * FPS value
     */
    export var fps: number = 30;
    export var width: number;
    export var height: number;
    
    /**
     * Game running state
     */
    export var isRunning: boolean = false;

    /**
     * Set the stage could recieve touch event
     */
    export var touchEnabled: boolean = false;
    
    /**
     * Set the stage could recieve mouse event
     */
    export var mouseEnabled: boolean = false;
    
    /**
     * Set the stage could recieve keyboard event
     */
    export var keyboardEnabled: boolean = false;

    /**
     * Canvas element of this stage
     */
    export var canvas: HTMLCanvasElement;
    
    /**
     * Canvas rendering context2d object
     */
    export var context: CanvasRenderingContext2D;

    /**
     * Root sprite container of the stage
     */
    export var sprite: Sprite;
    
    /**
     * Visible rectangle after adjusting for resolution design
     */
    export var visibleRect: { left: number; right: number; top: number; bottom: number };

    /**
     *  Scale mode for adjusting resolution design
     */
    export enum ScaleMode {
        SHOW_ALL,
        NO_BORDER,
        FIX_WIDTH,
        FIX_HEIGHT
    }
    
    /**
     * Scale value for adjusting the resolution design
     */
    export var _scale: number;

    export function adjustCanvasSize(): void {
        if (!canvas || !canvas.parentNode) {
            return;
        }
        
        var style = canvas.style;
        var device = {
            width: canvas.parentElement.offsetWidth,
            height: canvas.parentElement.offsetHeight
        };
        var scaleX: number = device.width / Stage.width;
        var scaleY: number = device.height / Stage.height;
        var deltaWidth: number = 0;
        var deltaHeight: number = 0;
        var scale: number;
        var width: number;
        var height: number;

        switch (stageScaleMode) {
            case ScaleMode.SHOW_ALL:
                if (scaleX < scaleY) {
                    scale = scaleX;
                    width = device.width;
                    height = scale * Stage.height;
                }
                else {
                    scale = scaleY;
                    width = scale * Stage.width;
                    height = device.height;
                }
                break;
            case ScaleMode.NO_BORDER:
                if (scaleX > scaleY) {
                    scale = scaleX;
                }
                else {
                    scale = scaleY;
                }
                width = Stage.width * scale;
                height = Stage.height * scale;
                deltaWidth = (Stage.width - device.width / scale) * 0.5 | 0;
                deltaHeight = (Stage.height - device.height / scale) * 0.5 | 0;
                break;
            case ScaleMode.FIX_WIDTH:
                scale = scaleX;
                width = device.width;
                height = device.height * scale;
                deltaHeight = (Stage.height - device.height / scale) * 0.5 | 0;
                break;
            case ScaleMode.FIX_HEIGHT:
                scale = scaleY;
                width = scale * device.width;
                height = device.height;
                deltaWidth = (Stage.width - device.width / scale) * 0.5 | 0;
                break;
            default:
                throw new Error('Unknow stage scale mode "' + stageScaleMode + '"');
        }

        style.width = width + 'px';
        style.height = height + 'px';
        style.top = ((device.height - height) * 0.5) + 'px';
        style.left = ((device.width - width) * 0.5) + 'px';
        style.position = 'absolute';

        visibleRect.left += deltaWidth;
        visibleRect.right -= deltaWidth;
        visibleRect.top += deltaHeight;
        visibleRect.bottom -= deltaHeight;

        _scale = scale;
    }

    function initScreenEvent(): void {
        window.addEventListener("resize", adjustCanvasSize);
    }

    /**
     * Initialize the stage
     * @param  canvas     Canvas element
     * @param  width      Resolution design width
     * @param  height     Resolution design height
     * @param  scaleMode  Adjust resolution design scale mode 
     */
    export function init(canvas: HTMLCanvasElement, width: number, height: number, scaleMode: ScaleMode): void {
        sprite = new Sprite({
            x: width * 0.5,
            y: height * 0.5,
            width: width,
            height: height
        });


        stageScaleMode = scaleMode;

        this.canvas = canvas;
        this.context = canvas.getContext('2d');

        bufferCanvas = document.createElement("canvas");
        bufferContext = bufferCanvas.getContext("2d");

        this.width = canvas.width = bufferCanvas.width = width;
        this.height = canvas.height = bufferCanvas.height = height;

        visibleRect = { left: 0, right: width, top: 0, bottom: height };

        adjustCanvasSize();
        initScreenEvent();
    }

    function startTimer() {
        eventloopTimerID = setTimeout(() => {
            if (!isUseInnerTimer) {
                return;
            }

            var deltaTime: number = getDeltaTime();
            Action.step(deltaTime);
            step(deltaTime);
            render();
            startTimer();
        }, 1000 / fps);
    }

    /**
     * Start the stage event loop
     */
    export function start(useOuterTimer?: boolean): void {
        if (!isRunning) {
            isUseInnerTimer = !useOuterTimer;

            if (isUseInnerTimer) {
                lastUpdate = Date.now();
                startTimer();
            }

            UIEvent.register();
            isRunning = true;
        }
    }

    export function step(deltaTime: number): void {
        sprite._update(deltaTime);
    }

    /**
     * Stop the stage event loop
     */
    export function stop(unregisterUIEvent?: boolean): void {
        if (!isRunning) {
            return;
        }

        if (unregisterUIEvent) {
            UIEvent.unregister();
        }

        isRunning = false;
        clearTimeout(eventloopTimerID);
    }

    function getDeltaTime(): number {
        var now = Date.now();
        var delta = now - lastUpdate;

        lastUpdate = now;
        return delta / 1000;
    }

    export function render() {
        if (!isRunning) {
            return;
        }

        var width: number = canvas.width;
        var height: number = canvas.height;

        bufferContext.clearRect(0, 0, width, height);

        sprite._visit(bufferContext);

        context.clearRect(0, 0, width, height);
        context.drawImage(bufferCanvas, 0, 0, width, height);
    }

    /**
     * Add sprite to the stage
     */
    export function addChild(child: Sprite, position?: number): void {
        sprite.addChild(child, position);
    }

    /**
     * Remove sprite from the stage
     */
    export function removeChild(child: Sprite): void {
        sprite.removeChild(child);
    }

    /**
     * Remove all sprites from the stage
     * @param  recusive  Recusize remove all the children
     */
    export function removeAllChild(recusive?: boolean): void {
        sprite.removeAllChild(recusive);
    }
}