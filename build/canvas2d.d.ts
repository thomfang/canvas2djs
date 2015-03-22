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
        protected _init(attrs?: SpriteAttrs): void;
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
    interface TextLabelAttrs extends SpriteAttrs {
        fontName?: string;
        textAlign?: string;
        fontColor?: string;
        fontSize?: number;
        lineSpace?: number;
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
        protected _init(attrs?: SpriteAttrs): void;
        text: string;
        private _resize();
        addChild(): void;
        removeChild(): void;
        protected draw(context: CanvasRenderingContext2D): void;
    }
}
declare module canvas2d.UIEvent.key {
    var MOUSE_LEFT: number;
    var MOUSE_MID: number;
    var MOUSE_RIGHT: number;
    var BACKSPACE: number;
    var TAB: number;
    var NUM_CENTER: number;
    var ENTER: number;
    var RETURN: number;
    var SHIFT: number;
    var CTRL: number;
    var ALT: number;
    var PAUSE: number;
    var CAPS_LOCK: number;
    var ESC: number;
    var ESCAPE: number;
    var SPACE: number;
    var PAGE_UP: number;
    var PAGE_DOWN: number;
    var END: number;
    var HOME: number;
    var LEFT: number;
    var UP: number;
    var RIGHT: number;
    var DOWN: number;
    var PRINT_SCREEN: number;
    var INSERT: number;
    var DELETE: number;
    var ZERO: number;
    var ONE: number;
    var TWO: number;
    var THREE: number;
    var FOUR: number;
    var FIVE: number;
    var SIX: number;
    var SEVEN: number;
    var EIGHT: number;
    var NINE: number;
    var A: number;
    var B: number;
    var C: number;
    var D: number;
    var E: number;
    var F: number;
    var G: number;
    var H: number;
    var I: number;
    var J: number;
    var K: number;
    var L: number;
    var M: number;
    var N: number;
    var O: number;
    var P: number;
    var Q: number;
    var R: number;
    var S: number;
    var T: number;
    var U: number;
    var V: number;
    var W: number;
    var X: number;
    var Y: number;
    var Z: number;
    var CONTEXT_MENU: number;
    var NUM0: number;
    var NUM1: number;
    var NUM2: number;
    var NUM3: number;
    var NUM4: number;
    var NUM5: number;
    var NUM6: number;
    var NUM7: number;
    var NUM8: number;
    var NUM9: number;
    var NUM_MULTIPLY: number;
    var NUM_PLUS: number;
    var NUM_MINUS: number;
    var NUM_PERIOD: number;
    var NUM_DIVISION: number;
    var F1: number;
    var F2: number;
    var F3: number;
    var F4: number;
    var F5: number;
    var F6: number;
    var F7: number;
    var F8: number;
    var F9: number;
    var F10: number;
    var F11: number;
    var F12: number;
}
