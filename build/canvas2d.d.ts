declare namespace canvas2d.util {
    function uuid(target: any): any;
    function addArrayItem(array: any[], item: any): void;
    function removeArrayItem(array: any[], item: any): void;
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
        all(callback: Function): Listener;
        any(callback: Function): Listener;
        _step(): void;
    }
    /**
     * Action manager
     */
    class Action {
        target: any;
        static _actionList: Array<Action>;
        static _listenerList: Array<Listener>;
        private _queue;
        _done: boolean;
        /**
         * Action running state
         */
        running: boolean;
        constructor(target: any);
        /**
         * Stop action by target
         */
        static stop(target: any): void;
        /**
         * Listen a action list, when all actions are done then publish to listener
         */
        static listen(actions: Array<Action>): Listener;
        static step(deltaTime: number): void;
        private _step(deltaTime);
        /**
         * Add a callback, it will exec after previous action is done.
         */
        then(callback: Function): Action;
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
declare namespace canvas2d {
    interface IEventListener {
        (...args: any[]): any;
    }
    /**
     * EventEmitter
     */
    class EventEmitter {
        private static _cache;
        addListener(type: string, listener: IEventListener): this;
        on(type: string, listener: IEventListener): this;
        once(type: string, listener: IEventListener): this;
        removeListener(type: string, listener: IEventListener): this;
        removeAllListeners(type?: string): this;
        emit(type: string, ...args: any[]): this;
    }
}
declare namespace canvas2d {
    /**
     * WebAudio
     */
    class WebAudio extends EventEmitter {
        static isSupported: boolean;
        private static _initialized;
        private static _enabled;
        static enabled: boolean;
        private _gainNode;
        private _audioNode;
        private _buffer;
        private _startTime;
        private _isLoading;
        src: string;
        loop: boolean;
        muted: boolean;
        loaded: boolean;
        volume: number;
        playing: boolean;
        autoplay: boolean;
        duration: number;
        currentTime: number;
        constructor(src: string);
        load(): void;
        play(): void;
        pause(): void;
        resume(): void;
        stop(): void;
        setMute(muted: boolean): void;
        setVolume(volume: number): void;
        clone(): WebAudio;
        private _handleEvent(e);
        private _onDecodeCompleted(buffer);
        private _play();
        private _clearAudioNode();
    }
    /**
     * HTMLAudio
     */
    class HTMLAudio extends EventEmitter {
        static enabled: boolean;
        private _audioNode;
        private _isLoading;
        src: string;
        loop: boolean;
        muted: boolean;
        loaded: boolean;
        volume: number;
        playing: boolean;
        autoplay: boolean;
        duration: number;
        currentTime: number;
        constructor(src: string);
        load(): void;
        play(): void;
        pause(): void;
        resume(): void;
        stop(): void;
        setMute(muted: boolean): void;
        setVolume(volume: number): void;
        clone(): HTMLAudio;
        private _handleEvent(e);
        private _play();
    }
}
declare namespace canvas2d {
    interface ISoundResource {
        name: string;
        channels?: number;
    }
    const Sound: {
        enabled: boolean;
        supportedType: {
            mp3: boolean;
            mp4: boolean;
            wav: boolean;
            ogg: boolean;
        };
        extension: string;
        getAudio: {
            (name: string): WebAudio | HTMLAudio;
            (name: string, returnList: boolean): (WebAudio | HTMLAudio)[];
        };
        _cache: {
            [index: string]: (WebAudio | HTMLAudio)[];
        };
        load(basePath: string, name: string, onComplete: () => any, channels?: number): void;
        loadList(basePath: string, resources: ISoundResource[], onAllCompleted?: () => any, onProgress?: (percent: number) => any): void;
        getAllAudioes(name: string): (WebAudio | HTMLAudio)[];
        play(name: string, loop?: boolean): WebAudio | HTMLAudio;
        pause(name: string): void;
        stop(name: string): void;
        resume(name: string): void;
    };
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
        onclick?(e: UIEvent.IEventHelper, event: MouseEvent): any;
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
        onclick: (e: UIEvent.IEventHelper, event: MouseEvent) => any;
        /**
         * Mouse begin event handler
         */
        onmousebegin: (e: UIEvent.IEventHelper, event: MouseEvent) => any;
        /**
         * Mouse moved event handler
         */
        onmousemoved: (e: UIEvent.IEventHelper, event: MouseEvent) => any;
        /**
         * Mouse ended event handler
         */
        onmouseended: (e: UIEvent.IEventHelper, event: MouseEvent) => any;
        /**
         * Touch begin event handler
         */
        ontouchbegin: (touches: UIEvent.IEventHelper[], event: TouchEvent) => any;
        /**
         * Touch moved event handler
         */
        ontouchmoved: (touches: UIEvent.IEventHelper[], event: TouchEvent) => any;
        /**
         * Touch ended event hadndler
         */
        ontouchended: (touches: UIEvent.IEventHelper[], event: TouchEvent) => any;
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
    enum ScaleMode {
        SHOW_ALL = 0,
        NO_BORDER = 1,
        FIX_WIDTH = 2,
        FIX_HEIGHT = 3,
    }
    const Stage: {
        fps: number;
        isRunning: boolean;
        width: number;
        height: number;
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
        sprite: Sprite;
        visibleRect: {
            left: number;
            right: number;
            top: number;
            bottom: number;
        };
        _scale: number;
        touchEnabled: boolean;
        mouseEnabled: boolean;
        keyboardEnabled: boolean;
        scaleMode: ScaleMode;
        autoAdjustCanvasSize: boolean;
        init(canvas: HTMLCanvasElement, width: number, height: number, scaleMode: ScaleMode, autoAdjustCanvasSize?: boolean): void;
        adjustCanvasSize(): void;
        start(useOuterTimer?: boolean): void;
        step(deltaTime: number): void;
        stop(unregisterUIEvent?: boolean): void;
        render(): void;
        addChild(child: Sprite, position?: number): void;
        removeChild(child: Sprite): void;
        removeAllChildren(recusive?: boolean): void;
    };
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
        cancelBubble: boolean;
    }
    var supportTouch: boolean;
    /**
     * Register UI event
     */
    function register(): void;
    /**
     * Unregister UI event
     */
    function unregister(): void;
    /**
     * Transform event location to stage location
     */
    function transformLocation(event: any): {
        x: number;
        y: number;
    };
}
declare namespace canvas2d.UIEvent {
    const Key: {
        MOUSE_LEFT: number;
        MOUSE_MID: number;
        MOUSE_RIGHT: number;
        BACKSPACE: number;
        TAB: number;
        NUM_CENTER: number;
        ENTER: number;
        RETURN: number;
        SHIFT: number;
        CTRL: number;
        ALT: number;
        PAUSE: number;
        CAPS_LOCK: number;
        ESC: number;
        ESCAPE: number;
        SPACE: number;
        PAGE_UP: number;
        PAGE_DOWN: number;
        END: number;
        HOME: number;
        LEFT: number;
        UP: number;
        RIGHT: number;
        DOWN: number;
        PRINT_SCREEN: number;
        INSERT: number;
        DELETE: number;
        ZERO: number;
        ONE: number;
        TWO: number;
        THREE: number;
        FOUR: number;
        FIVE: number;
        SIX: number;
        SEVEN: number;
        EIGHT: number;
        NINE: number;
        A: number;
        B: number;
        C: number;
        D: number;
        E: number;
        F: number;
        G: number;
        H: number;
        I: number;
        J: number;
        K: number;
        L: number;
        M: number;
        N: number;
        O: number;
        P: number;
        Q: number;
        R: number;
        S: number;
        T: number;
        U: number;
        V: number;
        W: number;
        X: number;
        Y: number;
        Z: number;
        CONTEXT_MENU: number;
        NUM0: number;
        NUM1: number;
        NUM2: number;
        NUM3: number;
        NUM4: number;
        NUM5: number;
        NUM6: number;
        NUM7: number;
        NUM8: number;
        NUM9: number;
        NUM_MULTIPLY: number;
        NUM_PLUS: number;
        NUM_MINUS: number;
        NUM_PERIOD: number;
        NUM_DIVISION: number;
        F1: number;
        F2: number;
        F3: number;
        F4: number;
        F5: number;
        F6: number;
        F7: number;
        F8: number;
        F9: number;
        F10: number;
        F11: number;
        F12: number;
    };
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
        maxWidth?: number;
        stroke?: {
            color: string;
            width: number;
        };
    }
    class TextLabel extends Sprite {
        maxWidth: number;
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
