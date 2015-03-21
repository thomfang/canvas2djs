/// <reference path="action.ts" />
/// <reference path="uievent.ts" />

module canvas2d.Stage {

    var timerID: number;
    var lastUpdate: number;
    var bufferCanvas: HTMLCanvasElement;
    var bufferContext: CanvasRenderingContext2D;
    var stageScaleMode: ScaleMode;

    export var fps: number = 30;
    export var width: number;
    export var height: number;
    export var isRunning: boolean = false;

    export var touchEnabled: boolean = false;
    export var mouseEnabled: boolean = false;
    export var keyboardEnabled: boolean = false;

    export var canvas: HTMLCanvasElement;
    export var context: CanvasRenderingContext2D;

    export var sprite: Sprite;
    export var _scale: number;

    export enum ScaleMode {
        SHOW_ALL,
        NO_BORDER,
        FIX_WIDTH,
        FIX_HEIGHT
    }

    function adjustStageSize(): void {
        var style = canvas.style;
        var device = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        var scaleX: number = device.width / Stage.width;
        var scaleY: number = device.height / Stage.height;
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
                break;
            case ScaleMode.FIX_WIDTH:
                scale = scaleX;
                width = device.width;
                height = device.height * scale;
                break;
            case ScaleMode.FIX_HEIGHT:
                scale = scaleY;
                width = scale * device.width;
                height = device.height;
                break;
            default:
                throw new Error('Unknow stage scale mode "' + stageScaleMode + '"');
        }

        style.width = width + 'px';
        style.height = height + 'px';
        style.top = ((device.height - height) * 0.5) + 'px';
        style.left = ((device.width - width) * 0.5) + 'px';
        style.position = 'absolute';

        _scale = scale;
    }

    function initScreenEvent(): void {
        window.addEventListener("resize", adjustStageSize);
    }

    function getDeltaTime(): number {
        var now = Date.now();
        var delta = now - lastUpdate;

        lastUpdate = now;
        return delta / 1000;
    }

    function step(): void {
        var width: number = canvas.width;
        var height: number = canvas.height;
        var deltaTime: number = getDeltaTime();

        Action._step(deltaTime);
        sprite._update(deltaTime);

        bufferContext.clearRect(0, 0, width, height);

        sprite._visit(bufferContext);

        context.clearRect(0, 0, width, height);
        context.drawImage(bufferCanvas, 0, 0, width, height);

        timerID = setTimeout(step, 1000 / fps);
    }

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

        adjustStageSize();
        initScreenEvent();
    }

    export function start(): void {
        if (!isRunning) {
            lastUpdate = Date.now();
            step();

            UIEvent.register();
            isRunning = true;
        }
    }

    export function stop(): void {
        if (!isRunning) {
            return;
        }

        clearTimeout(timerID);
        UIEvent.unregister();
        isRunning = false;
    }

    export function addChild(child: Sprite): void {
        sprite.addChild(child);
    }

    export function removeChild(child: Sprite): void {
        sprite.removeChild(child);
    }

    export function removeAllChild(recusive?: boolean): void {
        sprite.removeAllChild(recusive);
    }
}