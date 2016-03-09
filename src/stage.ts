/// <reference path="action.ts" />
/// <reference path="uievent.ts" />
/// <reference path="sprite.ts" />

namespace canvas2d {

    var eventloopTimerId: number;
    var lastUpdateTime: number;
    var bufferCanvas: HTMLCanvasElement;
    var bufferContext: CanvasRenderingContext2D;
    var currentScaleMode: ScaleMode;
    var autoAdjustCanvasSize = false;
    var isUseInnerTimer = true;
    
    var fps: number = 30;
    var frameRate: number = 1000 / 30;
    var stageWidth: number = 0;
    var stageHeight: number = 0;
    
    var isRunning: boolean = false;
    
    var touchEnabled: boolean = false;
    var mouseEnabled: boolean = false;
    var keyboardEnabled: boolean = false;
    
    var canvasElement: HTMLCanvasElement;
    var renderingContext: CanvasRenderingContext2D;
    
    var rootSprite: Sprite;
    var visibleRect: { left: number; right: number; top: number; bottom: number };

    export enum ScaleMode {
        SHOW_ALL,
        NO_BORDER,
        FIX_WIDTH,
        FIX_HEIGHT
    }
    
    var canvasScale: number = 1;

    function setAutoAdjustCanvasSize(value: boolean) {
        if (value && !autoAdjustCanvasSize) {
            autoAdjustCanvasSize = true;
            Stage.adjustCanvasSize();
            window.addEventListener("resize", Stage.adjustCanvasSize);
        }
        else if (!value && autoAdjustCanvasSize) {
            autoAdjustCanvasSize = false;
            window.removeEventListener("resize", Stage.adjustCanvasSize);
        }
    }

    function startTimer() {
        eventloopTimerId = setTimeout(() => {
            if (!isUseInnerTimer) {
                return;
            }

            var deltaTime: number = getDeltaTime();
            Action.step(deltaTime);
            Stage.step(deltaTime);
            Stage.render();
            startTimer();
        }, frameRate);
    }

    function getDeltaTime(): number {
        var now = Date.now();
        var delta = now - lastUpdateTime;

        lastUpdateTime = now;
        return delta / 1000;
    }

    export const Stage = {

        get fps() {
            return fps;
        },
        
        set fps(value: number) {
            frameRate = 1000 / value;
            fps = value;
        },

        get isRunning() {
            return isRunning;
        },
        
        set isRunning(value: boolean) {
            isRunning = value;
        },

        get width() {
            return stageWidth;
        },

        get height() {
            return stageHeight;
        },

        get canvas() {
            return canvasElement;
        },

        get context() {
            return renderingContext;
        },

        get sprite() {
            return rootSprite;
        },

        get visibleRect() {
            return visibleRect;
        },

        get _scale() {
            return canvasScale;
        },
        
        get touchEnabled() {
            return touchEnabled;
        },
        
        set touchEnabled(value: boolean) {
            touchEnabled = value;
        },
        
        get mouseEnabled() {
            return mouseEnabled;
        },
        
        set mouseEnabled(value: boolean) {
            mouseEnabled = value;
        },
        
        get keyboardEnabled() {
            return keyboardEnabled;
        },
        
        set keyboardEnabled(value: boolean) {
            keyboardEnabled = value;
        },
        
        get scaleMode() {
            return currentScaleMode;
        },
        
        set scaleMode(value: ScaleMode) {
            if (value === currentScaleMode) {
                return;
            }
            
            currentScaleMode = value;
            Stage.adjustCanvasSize();
        },

        get autoAdjustCanvasSize() {
            return autoAdjustCanvasSize;
        },

        set autoAdjustCanvasSize(value: boolean) {
            setAutoAdjustCanvasSize(value);
        },

        /**
         * Initialize the stage
         * @param  canvas     Canvas element
         * @param  width      Resolution design width
         * @param  height     Resolution design height
         * @param  scaleMode  Adjust resolution design scale mode 
         */
        init(canvas: HTMLCanvasElement, width: number, height: number, scaleMode: ScaleMode, autoAdjustCanvasSize?: boolean): void {
            rootSprite = new Sprite({
                x: width * 0.5,
                y: height * 0.5,
                width: width,
                height: height
            });

            currentScaleMode = scaleMode;

            canvasElement = canvas;
            renderingContext = canvas.getContext('2d');

            bufferCanvas = document.createElement("canvas");
            bufferContext = bufferCanvas.getContext("2d");

            stageWidth = canvas.width = bufferCanvas.width = width;
            stageHeight = canvas.height = bufferCanvas.height = height;

            visibleRect = { left: 0, right: width, top: 0, bottom: height };

            setAutoAdjustCanvasSize(autoAdjustCanvasSize);
        },

        adjustCanvasSize() {
            if (!canvasElement || !canvasElement.parentNode) {
                return;
            }

            var style = canvasElement.style;
            var container = {
                width: canvasElement.parentElement.offsetWidth,
                height: canvasElement.parentElement.offsetHeight
            };
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
                    if (scaleX > scaleY) {
                        scale = scaleX;
                    }
                    else {
                        scale = scaleY;
                    }
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
            style.top = ((container.height - height) * 0.5) + 'px';
            style.left = ((container.width - width) * 0.5) + 'px';
            style.position = 'absolute';

            visibleRect.left = deltaWidth;
            visibleRect.right = stageWidth - deltaWidth;
            visibleRect.top = deltaHeight;
            visibleRect.bottom = stageHeight - deltaHeight;

            canvasScale = scale;
        },

        start(useOuterTimer?: boolean): void {
            if (!isRunning) {
                isUseInnerTimer = !useOuterTimer;

                if (isUseInnerTimer) {
                    lastUpdateTime = Date.now();
                    startTimer();
                }

                UIEvent.register();
                isRunning = true;
            }
        },

        step(deltaTime: number): void {
            rootSprite._update(deltaTime);
        },

        stop(unregisterUIEvent?: boolean): void {
            if (!isRunning) {
                return;
            }

            if (unregisterUIEvent) {
                UIEvent.unregister();
            }

            isRunning = false;
            clearTimeout(eventloopTimerId);
        },

        render() {
            if (!isRunning) {
                return;
            }

            var width: number = canvasElement.width;
            var height: number = canvasElement.height;

            bufferContext.clearRect(0, 0, width, height);

            rootSprite._visit(bufferContext);

            renderingContext.clearRect(0, 0, width, height);
            renderingContext.drawImage(bufferCanvas, 0, 0, width, height);
        },

        /**
         * Add sprite to the stage
         */
        addChild(child: Sprite, position?: number): void {
            rootSprite.addChild(child, position);
        },

        /**
         * Remove sprite from the stage
         */
        removeChild(child: Sprite): void {
            rootSprite.removeChild(child);
        },

        /**
         * Remove all sprites from the stage
         * @param  recusive  Recusize remove all the children
         */
        removeAllChildren(recusive?: boolean): void {
            rootSprite.removeAllChildren(recusive);
        }
    };
}