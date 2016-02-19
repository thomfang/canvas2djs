declare namespace canvas2d.util {
    function uuid(target: any): any;
    function addArrayItem(array: any[], item: any): void;
    function removeArrayItem(array: any[], item: any): void;
}
declare namespace canvas2d {
    interface IRect {
        x: number;
        y: number;
        width: number;
        height: number;
    }
    /**
     * Sprite texture
     */
    class Texture {
        private _readyCallbacks;
        /**
         * Texture resource loading state
         */
        ready: boolean;
        width: number;
        height: number;
        /**
         * Texture drawable source
         */
        source: HTMLCanvasElement;
        /**
         * Create a texture by source and clipping rectangle
         * @param  source  Drawable source
         * @param  rect    Clipping rect
         */
        static create(source: string | HTMLCanvasElement | HTMLImageElement, rect?: IRect): Texture;
        /**
         * @param  source  Drawable source
         * @param  rect    Clipping rect
         */
        constructor(source: string | HTMLCanvasElement | HTMLImageElement, rect?: IRect);
        onReady(callback: (size: {
            width: number;
            height: number;
        }) => any): void;
        private _createByPath(path, rect?);
        private _createByImage(image, rect?);
    }
}
declare namespace canvas2d {
    interface IEventListener {
        (...args: any[]): any;
    }
    /**
     * EventEmitter
     */
    class EventEmitter {
        protected _eventCache: {
            [type: string]: IEventListener[];
        };
        protected _onceMarkKey: string;
        constructor();
        addListener(type: string, listener: IEventListener): this;
        on(type: string, listener: IEventListener): this;
        once(type: string, listener: IEventListener): this;
        removeListener(type: string, listener: IEventListener): this;
        removeAllListeners(type?: string): this;
        emit(type: string, ...args: any[]): this;
    }
}
declare namespace canvas2d {
    enum AlignType {
        TOP = 0,
        RIGHT = 1,
        BOTTOM = 2,
        LEFT = 3,
        CENTER = 4,
    }
    /**
     * Sprite attributes
     */
    interface ISprite {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        scaleX?: number;
        scaleY?: number;
        originX?: number;
        originY?: number;
        bgColor?: string;
        radius?: number;
        border?: {
            width: number;
            color: string;
        };
        texture?: Texture;
        rotation?: number;
        opacity?: number;
        visible?: boolean;
        alignX?: AlignType;
        alignY?: AlignType;
        flippedX?: boolean;
        flippedY?: boolean;
        clipOverflow?: boolean;
        /**
         * Position X of the clipping rect on texture
         */
        sourceX?: number;
        /**
         * Position Y of the clipping rect on texture
         */
        sourceY?: number;
        /**
         * Width of the clipping rect on texture
         */
        sourceWidth?: number;
        /**
         * Height of the clipping rect on texture
         */
        sourceHeight?: number;
        /**
         * Use lighter mode
         */
        lighterMode?: boolean;
        /**
         * Auto resize by the texture
         */
        autoResize?: boolean;
        touchEnabled?: boolean;
        mouseEnabled?: boolean;
        keyboardEnabled?: boolean;
        /**
         * Sprite initialize method
         */
        init?(): any;
        /**
         * Sprite would call this method each frame
         * @param  deltaTime  Duration between now and last frame
         */
        update?(deltaTime: number): any;
        /**
         * Click event handler
         */
        onclick?(e: UIEvent.IEventHelper): any;
        /**
         * Mouse begin event handler
         */
        onmousebegin?(e: UIEvent.IEventHelper, event: MouseEvent): any;
        /**
         * Mouse moved event handler
         */
        onmousemoved?(e: UIEvent.IEventHelper, event: MouseEvent): any;
        /**
         * Mouse ended event handler
         */
        onmouseended?(e: UIEvent.IEventHelper, event: MouseEvent): any;
        /**
         * Touch begin event handler
         */
        ontouchbegin?(touches: UIEvent.IEventHelper[], event: TouchEvent): any;
        /**
         * Touch moved event handler
         */
        ontouchmoved?(touches: UIEvent.IEventHelper[], event: TouchEvent): any;
        /**
         * Touch ended event hadndler
         */
        ontouchended?(touches: UIEvent.IEventHelper[], event: TouchEvent): any;
    }
    const RAD_PER_DEG: number;
    /**
     * Sprite as the base element
     */
    class Sprite extends EventEmitter implements ISprite {
        protected _width: number;
        protected _height: number;
        protected _originX: number;
        protected _originY: number;
        protected _rotation: number;
        protected _rotationRad: number;
        protected _texture: Texture;
        protected _alignX: AlignType;
        protected _alignY: AlignType;
        protected _parent: Sprite;
        _originPixelX: number;
        _originPixelY: number;
        id: number;
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        radius: number;
        opacity: number;
        sourceX: number;
        sourceY: number;
        sourceWidth: number;
        sourceHeight: number;
        lighterMode: boolean;
        autoResize: boolean;
        flippedX: boolean;
        flippedY: boolean;
        visible: boolean;
        clipOverflow: boolean;
        bgColor: string;
        border: {
            width: number;
            color: string;
        };
        children: Sprite[];
        touchEnabled: boolean;
        mouseEnabled: boolean;
        keyboardEnabled: boolean;
        constructor(attrs?: ISprite);
        protected _init(attrs?: ISprite): void;
        width: number;
        height: number;
        originX: number;
        originY: number;
        rotation: number;
        texture: Texture;
        parent: Sprite;
        alignX: AlignType;
        alignY: AlignType;
        _update(deltaTime: number): void;
        _visit(context: CanvasRenderingContext2D): void;
        adjustAlignX(): void;
        adjustAlignY(): void;
        protected _visitAllChildren(context: CanvasRenderingContext2D): void;
        protected _clip(context: CanvasRenderingContext2D): void;
        protected _drawBgColor(context: CanvasRenderingContext2D): void;
        protected _drawBorder(context: CanvasRenderingContext2D): void;
        protected draw(context: CanvasRenderingContext2D): void;
        addChild(target: Sprite, position?: number): void;
        removeChild(target: Sprite): void;
        removeAllChildren(recusive?: boolean): void;
        release(recusive?: boolean): void;
        init(): any;
        update(deltaTime: number): any;
    }
}
declare namespace canvas2d {
    interface IEasingFunction {
        (percent: number, ...args: any[]): number;
    }
    var Tween: {
        easeInQuad: (pos: any) => number;
        easeOutQuad: (pos: any) => number;
        easeInOutQuad: (pos: any) => number;
        easeInCubic: (pos: any) => number;
        easeOutCubic: (pos: any) => number;
        easeInOutCubic: (pos: any) => number;
        easeInQuart: (pos: any) => number;
        easeOutQuart: (pos: any) => number;
        easeInOutQuart: (pos: any) => number;
        easeInQuint: (pos: any) => number;
        easeOutQuint: (pos: any) => number;
        easeInOutQuint: (pos: any) => number;
        easeInSine: (pos: any) => number;
        easeOutSine: (pos: any) => number;
        easeInOutSine: (pos: any) => number;
        easeInExpo: (pos: any) => number;
        easeOutExpo: (pos: any) => number;
        easeInOutExpo: (pos: any) => number;
        easeInCirc: (pos: any) => number;
        easeOutCirc: (pos: any) => number;
        easeInOutCirc: (pos: any) => number;
        easeOutBounce: (pos: any) => number;
        easeInBack: (pos: any) => number;
        easeOutBack: (pos: any) => number;
        easeInOutBack: (pos: any) => number;
        elastic: (pos: any) => number;
        swingFromTo: (pos: any) => number;
        swingFrom: (pos: any) => number;
        swingTo: (pos: any) => number;
        bounce: (pos: any) => number;
        bouncePast: (pos: any) => number;
        easeFromTo: (pos: any) => number;
        easeFrom: (pos: any) => number;
        easeTo: (pos: any) => number;
        linear: (pos: any) => any;
        sinusoidal: (pos: any) => number;
        reverse: (pos: any) => number;
        mirror: (pos: any, transition: any) => any;
        flicker: (pos: any) => any;
        wobble: (pos: any) => number;
        pulse: (pos: any, pulses: any) => number;
        blink: (pos: any, blinks: any) => number;
        spring: (pos: any) => number;
        none: (pos: any) => number;
        full: (pos: any) => number;
    };
}
declare namespace canvas2d {
    class Listener {
        private _actions;
        private _resolved;
        private _callbacks;
        constructor(_actions: Array<Action>);
        allDone(callback: Function): Listener;
        anyDone(callback: Function): Listener;
        _step(): void;
    }
    /**
     * Action manager
     */
    class Action {
        sprite: Sprite;
        static _actionList: Array<Action>;
        static _listenerList: Array<Listener>;
        private _queue;
        _done: boolean;
        /**
         * Action running state
         */
        running: boolean;
        constructor(sprite: Sprite);
        /**
         * Stop action by sprite
         */
        static stop(sprite: Sprite): void;
        /**
         * Listen a action list, when all actions are done then publish to listener
         */
        static listen(actions: Array<Action>): Listener;
        static step(deltaTime: number): void;
        private _step(deltaTime);
        /**
         * Add a callback, it will exec after previous action is done.
         */
        then(func: Function): Action;
        /**
         * Add a delay action.
         */
        wait(time: number): Action;
        /**
         * Add a animation action
         */
        animate(frameList: Array<Texture>, frameRate: number, repetitions?: number): Action;
        /**
         * TransitionTo action
         * @param  attrs     Transition attributes map
         * @param  duration  Transition duration
         */
        to(attrs: {
            [name: string]: number | {
                dest: number;
                easing: IEasingFunction;
            };
        }, duration: number): Action;
        /**
         * TransitionBy action
         */
        by(attrs: {
            [name: string]: number | {
                value: number;
                easing: IEasingFunction;
            };
        }, duration: number): Action;
        /**
         * Start the action
         */
        start(): Action;
        /**
         * Stop the action
         */
        stop(): void;
    }
}
/**
 * Simple sound manager
 */
declare namespace canvas2d.Sound {
    /**
     * Could play sound
     */
    var enabled: boolean;
    /**
     * Extension for media type
     */
    var extension: string;
    /**
     *  Supported types of the browser
     */
    var supportedType: {
        [index: string]: boolean;
    };
    interface ISoundResource {
        name: string;
        channels?: number;
    }
    /**
     * Load a sound resource
     */
    function load(basePath: string, name: string, onComplete: () => any, channels?: number): void;
    /**
     * Load multiple sound resources
     */
    function loadList(basePath: string, resList: Array<ISoundResource>, onAllCompleted?: () => any, onProgress?: (percent: number) => any): void;
    /**
     * Get paused audio instance by resource name.
     */
    function getPausedAudio(name: string): HTMLAudioElement;
    function getPausedAudio(name: string, isGetAll: boolean): HTMLAudioElement[];
    /**
     * Get playing audio instance by resource name.
     */
    function getPlayingAudio(name: string): HTMLAudioElement;
    function getPlayingAudio(name: string, isGetAll: boolean): HTMLAudioElement[];
    /**
     * Get audio list
     */
    function getAudioListByName(name: string): HTMLAudioElement[];
    /**
     * Play sound by name
     */
    function play(name: string, loop?: boolean): any;
    /**
     * Pause sound by name
     */
    function pause(name: string, reset?: boolean): void;
    /**
     * Resume audio by name
     */
    function resume(name: string, reset?: boolean): void;
    /**
     * Pause all audios
     */
    function pauseAll(reset?: boolean): void;
    /**
     * Resume all played audio
     */
    function resumeAll(reset?: boolean): void;
    /**
     * Stop the looping sound by name
     */
    function stopLoop(name: string): void;
}
declare namespace canvas2d.Stage {
    /**
     * FPS value
     */
    var fps: number;
    var width: number;
    var height: number;
    /**
     * Game running state
     */
    var isRunning: boolean;
    /**
     * Set the stage could recieve touch event
     */
    var touchEnabled: boolean;
    /**
     * Set the stage could recieve mouse event
     */
    var mouseEnabled: boolean;
    /**
     * Set the stage could recieve keyboard event
     */
    var keyboardEnabled: boolean;
    /**
     * Canvas element of this stage
     */
    var canvas: HTMLCanvasElement;
    /**
     * Canvas rendering context2d object
     */
    var context: CanvasRenderingContext2D;
    /**
     * Root sprite container of the stage
     */
    var sprite: Sprite;
    /**
     * Visible rectangle after adjusting for resolution design
     */
    var visibleRect: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    };
    /**
     *  Scale mode for adjusting resolution design
     */
    enum ScaleMode {
        SHOW_ALL = 0,
        NO_BORDER = 1,
        FIX_WIDTH = 2,
        FIX_HEIGHT = 3,
    }
    /**
     * Scale value for adjusting the resolution design
     */
    var _scale: number;
    var autoAdjustCanvasSize: boolean;
    function adjustCanvasSize(): void;
    /**
     * Initialize the stage
     * @param  canvas     Canvas element
     * @param  width      Resolution design width
     * @param  height     Resolution design height
     * @param  scaleMode  Adjust resolution design scale mode
     */
    function init(canvas: HTMLCanvasElement, width: number, height: number, scaleMode: ScaleMode, autoAdjustCanvasSize?: boolean): void;
    function setAutoAdjustCanvasSize(value: boolean): void;
    /**
     * Start the stage event loop
     */
    function start(useOuterTimer?: boolean): void;
    function step(deltaTime: number): void;
    /**
     * Stop the stage event loop
     */
    function stop(unregisterUIEvent?: boolean): void;
    function render(): void;
    /**
     * Add sprite to the stage
     */
    function addChild(child: Sprite, position?: number): void;
    /**
     * Remove sprite from the stage
     */
    function removeChild(child: Sprite): void;
    /**
     * Remove all sprites from the stage
     * @param  recusive  Recusize remove all the children
     */
    function removeAllChild(recusive?: boolean): void;
}
/**
 * Virtual UI event manager
 */
declare namespace canvas2d.UIEvent {
    interface IEventHelper {
        identifier?: number;
        beginX: number;
        beginY: number;
        localX?: number;
        localY?: number;
        stageX?: number;
        stageY?: number;
        _moved?: boolean;
        beginTarget?: Sprite;
        target?: Sprite;
    }
    var supportTouch: boolean;
    /**
     * Register UI event, internal method
     */
    function register(): void;
    /**
     * Unregister UI event, internal method
     */
    function unregister(): void;
}
declare namespace canvas2d.UIEvent.Key {
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
declare namespace canvas2d {
    interface ITextLabel extends ISprite {
        text?: string;
        fontName?: string;
        textAlign?: string;
        fontColor?: string;
        fontSize?: number;
        lineSpace?: number;
        fontStyle?: string;
        fontWeight?: string;
        stroke?: {
            color: string;
            width: number;
        };
    }
    class TextLabel extends Sprite {
        fontName: string;
        textAlign: string;
        fontColor: string;
        fontSize: number;
        fontWeight: string;
        fontStyle: string;
        lineSpace: number;
        stroke: {
            color: string;
            width: number;
        };
        private _lines;
        private _text;
        constructor(attrs?: ITextLabel);
        protected _init(attrs?: ISprite): void;
        text: string;
        private _resize();
        addChild(): void;
        removeChild(): void;
        protected draw(context: CanvasRenderingContext2D): void;
    }
}
