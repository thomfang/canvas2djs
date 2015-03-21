declare module canvas2d {
    interface Rect {
        x: number;
        y: number;
        width: number;
        height: number;
    }
    class Texture {
        ready: boolean;
        width: number;
        height: number;
        source: HTMLCanvasElement;
        static create(source: any, rect?: Rect): Texture;
        constructor(source?: any, rect?: Rect);
        private _createByPath(path, rect?);
        private _createByImage(image, rect?);
    }
}
declare module canvas2d {
    interface SpriteAttrs {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        scaleX?: number;
        scaleY?: number;
        originX?: number;
        originY?: number;
        bgColor?: string;
        texture?: Texture;
        rotation?: number;
        opacity?: number;
        visible?: boolean;
        flippedX?: boolean;
        flippedY?: boolean;
        sourceX?: number;
        sourceY?: number;
        sourceWidth?: number;
        sourceHeight?: number;
        lighterMode?: boolean;
        touchEnabled?: boolean;
        mouseEnabled?: boolean;
        keyboardEnabled?: boolean;
    }
    class Sprite {
        private _width;
        private _height;
        private _originX;
        private _originY;
        private _rotation;
        private _rotationRad;
        private _texture;
        _originPixelX: number;
        _originPixelY: number;
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        sourceX: number;
        sourceY: number;
        opacity: number;
        lighterMode: boolean;
        autoResize: boolean;
        flippedX: boolean;
        flippedY: boolean;
        visible: boolean;
        sourceWidth: number;
        sourceHeight: number;
        bgColor: string;
        parent: Sprite;
        children: Sprite[];
        touchEnabled: boolean;
        mouseEnabled: boolean;
        keyboardEnabled: boolean;
        constructor(attrs?: SpriteAttrs);
        width: number;
        height: number;
        originX: number;
        originY: number;
        rotation: number;
        texture: Texture;
        _update(deltaTime: number): void;
        _visit(context: CanvasRenderingContext2D): void;
        protected _visitAllChild(context: CanvasRenderingContext2D): void;
        protected _drawBgColor(context: CanvasRenderingContext2D): void;
        protected draw(context: CanvasRenderingContext2D): void;
        init(): void;
        update(deltaTime: number): void;
        addChild(target: Sprite, position?: number): void;
        removeChild(target: Sprite): void;
        removeAllChild(recusive?: boolean): void;
    }
}
declare module canvas2d {
    interface EasingFunc {
        (percent: number, other?: any): number;
    }
    var tween: {
        [index: string]: EasingFunc;
    };
}
declare module canvas2d {
    interface ActionArg {
        [index: string]: any;
    }
    class Listener {
        private _actions;
        private _resolved;
        private _callback;
        constructor(_actions: Array<Action>);
        allDone(callback: Function): Listener;
        anyDone(callback: Function): Listener;
        _step(): void;
    }
    class Action {
        sprite: Sprite;
        static _actionList: Array<Action>;
        static _listenerList: Array<Listener>;
        private _queue;
        _done: boolean;
        running: boolean;
        constructor(sprite: Sprite);
        static stop(sprite: Sprite): void;
        static listen(actions: Array<Action>): Listener;
        static _step(deltaTime: number): void;
        private _step(deltaTime);
        then(func: Function): Action;
        wait(time: number): Action;
        animate(frameList: Array<Texture>, frameRate: number, repetitions?: number): Action;
        to(attrs: ActionArg, duration: number): Action;
        start(): Action;
        stop(): void;
    }
}
declare module canvas2d.Sound {
    var enabled: boolean;
    var extention: string;
    var supportedType: {
        [index: string]: boolean;
    };
    interface Resource {
        name: string;
        channels?: number;
    }
    function load(basePath: string, name: string, onComplete: Function, channels?: number): void;
    function loadList(basePath: string, resList: Array<Resource>, callback?: Function): void;
    function getAudio(name: string, isGetList?: boolean): any;
    function play(name: string, loop?: boolean): any;
    function pause(name: string, reset?: boolean): void;
    function stopLoop(name: string): void;
}
declare module canvas2d.UIEvent {
    var supportTouch: boolean;
    function register(): void;
    function unregister(): void;
}
declare module canvas2d.Stage {
    var fps: number;
    var width: number;
    var height: number;
    var isRunning: boolean;
    var touchEnabled: boolean;
    var mouseEnabled: boolean;
    var keyboardEnabled: boolean;
    var canvas: HTMLCanvasElement;
    var context: CanvasRenderingContext2D;
    var sprite: Sprite;
    var _scale: number;
    enum ScaleMode {
        SHOW_ALL = 0,
        NO_BORDER = 1,
        FIX_WIDTH = 2,
        FIX_HEIGHT = 3,
    }
    function init(canvas: HTMLCanvasElement, width: number, height: number, scaleMode: ScaleMode): void;
    function start(): void;
    function stop(): void;
    function addChild(child: Sprite): void;
    function removeChild(child: Sprite): void;
    function removeAllChild(recusive?: boolean): void;
}
declare module canvas2d {
    interface TextLabelAttrs extends Sprite {
        fontName: string;
        textAlign: string;
        fontColor: string;
        fontSize: number;
        lineSpace: number;
    }
    class TextLabel extends Sprite {
        fontName: string;
        textAlign: string;
        fontColor: string;
        fontSize: number;
        lineSpace: number;
        private _lines;
        private _text;
        constructor(attrs?: TextLabelAttrs);
        text: string;
        private _resize();
        addChild(): void;
        removeChild(): void;
        draw(context: CanvasRenderingContext2D): void;
    }
}
declare module canvas2d.UIEvent {
    var key: {
        [index: string]: number;
    };
}
