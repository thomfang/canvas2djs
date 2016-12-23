export as namespace canvas2d;
export = canvas2d;

declare namespace canvas2d {
    type Color = string | number;

    namespace Util {
        function uid(target: any): any;
        function addArrayItem(array: any[], item: any): void;
        function removeArrayItem(array: any[], item: any): void;
        function normalizeColor(color: string | number): string;
    }


    interface IActionListener {
        all(callback: Function): IActionListener;
        any(callback: Function): IActionListener;
    }

    /**
     * Action manager
     */
    class Action {
        static _actionList: Array<Action>;
        static _listenerList: Array<IActionListener>;
        private _queue;
        _done: boolean;
        /**
         * Action running state
         */
        isRunning: boolean;
        target: any;
        constructor(target: any);
        /**
         * Stop action by target
         */
        static stop(target: any): void;
        /**
         * Listen a action list, when all actions are done then publish to listener
         */
        static listen(actions: Array<Action>): IActionListener;
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


    const Sound: {
        enabled: boolean;
        readonly supportedType: {
            mp3: boolean;
            mp4: boolean;
            wav: boolean;
            ogg: boolean;
        };
        extension: string;
        readonly getAudio: {
            (name: string): WebAudio | HTMLAudio;
            (name: string, returnList: boolean): (WebAudio | HTMLAudio)[];
        };
        readonly _cache: {
            [index: string]: (WebAudio | HTMLAudio)[];
        };
        load(basePath: string, name: string, onComplete: () => any, channels?: number): void;
        loadList(basePath: string, resources: {
            name: string;
            channels?: number;
        }[], onAllCompleted?: () => any, onProgress?: (percent: number) => any): void;
        getAllAudioes(name: string): (WebAudio | HTMLAudio)[];
        play(name: string, loop?: boolean): WebAudio | HTMLAudio;
        pause(name: string): void;
        stop(name: string): void;
        resume(name: string): void;
    };

    interface IEasingFunction {
        (percent: number, ...args: any[]): number;
    }
    var Tween: {
        easeInQuad(pos: any): number;
        easeOutQuad(pos: any): number;
        easeInOutQuad(pos: any): number;
        easeInCubic(pos: any): number;
        easeOutCubic(pos: any): number;
        easeInOutCubic(pos: any): number;
        easeInQuart(pos: any): number;
        easeOutQuart(pos: any): number;
        easeInOutQuart(pos: any): number;
        easeInQuint(pos: any): number;
        easeOutQuint(pos: any): number;
        easeInOutQuint(pos: any): number;
        easeInSine(pos: any): number;
        easeOutSine(pos: any): number;
        easeInOutSine(pos: any): number;
        easeInExpo(pos: any): number;
        easeOutExpo(pos: any): number;
        easeInOutExpo(pos: any): number;
        easeInCirc(pos: any): number;
        easeOutCirc(pos: any): number;
        easeInOutCirc(pos: any): number;
        easeOutBounce(pos: any): number;
        easeInBack(pos: any): number;
        easeOutBack(pos: any): number;
        easeInOutBack(pos: any): number;
        elastic(pos: any): number;
        swingFromTo(pos: any): number;
        swingFrom(pos: any): number;
        swingTo(pos: any): number;
        bounce(pos: any): number;
        bouncePast(pos: any): number;
        easeFromTo(pos: any): number;
        easeFrom(pos: any): number;
        easeTo(pos: any): number;
        linear(pos: any): any;
        sinusoidal(pos: any): number;
        reverse(pos: any): number;
        mirror(pos: any, transition: any): any;
        flicker(pos: any): any;
        wobble(pos: any): number;
        pulse(pos: any, pulses: any): number;
        blink(pos: any, blinks: any): number;
        spring(pos: any): number;
        none(pos: any): number;
        full(pos: any): number;
    };

    interface IEventHelper {
        identifier?: number;
        beginX: number;
        beginY: number;
        localX?: number;
        localY?: number;
        stageX?: number;
        stageY?: number;
        _moved?: boolean;
        beginTarget?: Sprite<any>;
        target?: Sprite<any>;
        cancelBubble: boolean;
    }
    class UIEvent {
        static supportTouch: boolean;
        private _registered;
        private _touchHelperMap;
        private _mouseBeginHelper;
        private _mouseMovedHelper;
        stage: Stage;
        element: HTMLElement;
        constructor(stage: Stage);
        register(): void;
        unregister(): void;
        transformLocation(event: any): {
            x: number;
            y: number;
        };
        private _transformTouches(touches, justGet?);
        private _touchBeginHandler;
        private _touchMovedHandler;
        private _touchEndedHandler;
        private _mouseBeginHandler;
        private _mouseMovedHandler;
        private _mouseEndedHandler;
        private _keyDownHandler;
        private _keyUpHandler;
        private _dispatchTouch(sprite, offsetX, offsetY, helpers, event, methodName, needTriggerClick?);
        private _dispatchMouse(sprite, offsetX, offsetY, helper, event, methodName, triggerClick?);
        private _dispatchKeyboard(sprite, keyCode, event, methodName);
    }

    const Keys: {
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

    type Rect = {
        x: number;
        y: number;
        width: number;
        height: number;
    };
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
        static create(source: string | HTMLCanvasElement | HTMLImageElement, rect?: Rect): Texture;
        /**
         * @param  source  Drawable source
         * @param  rect    Clipping rect
         */
        constructor(source: string | HTMLCanvasElement | HTMLImageElement, rect?: Rect);
        onReady(callback: (size: {
            width: number;
            height: number;
        }) => any): void;
        private _createByPath(path, rect?);
        private _createByImage(image, rect?);
    }


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
        bgColor?: Color;
        radius?: number;
        border?: {
            width: number;
            color: Color;
        };
        texture?: Texture | string;
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
         * Sprite would call this method each frame
         * @param  deltaTime  Duration between now and last frame
         */
        update?(deltaTime: number): any;
        /**
         * Click event handler
         */
        onClick?(e: IEventHelper, event: MouseEvent): any;
        /**
         * Mouse begin event handler
         */
        onMouseBegin?(e: IEventHelper, event: MouseEvent): any;
        /**
         * Mouse moved event handler
         */
        onMouseMoved?(e: IEventHelper, event: MouseEvent): any;
        /**
         * Mouse ended event handler
         */
        onMouseEnded?(e: IEventHelper, event: MouseEvent): any;
        /**
         * Touch begin event handler
         */
        onTouchBegin?(touches: IEventHelper[], event: TouchEvent): any;
        /**
         * Touch moved event handler
         */
        onTouchMoved?(touches: IEventHelper[], event: TouchEvent): any;
        /**
         * Touch ended event hadndler
         */
        onTouchEnded?(touches: IEventHelper[], event: TouchEvent): any;
        /**
         * KeyDown event handler
         */
        onKeyDown?(event: KeyboardEvent): any;
        /**
         * KeyUp event handler
         */
        onKeyUp?(event: KeyboardEvent): any;
    }
    const RAD_PER_DEG: number;
    /**
     * Sprite as the base element
     */
    class Sprite<T extends ISprite> extends EventEmitter {
        protected _width: number;
        protected _height: number;
        protected _originX: number;
        protected _originY: number;
        protected _rotation: number;
        protected _rotationRad: number;
        protected _texture: Texture;
        protected _alignX: AlignType;
        protected _alignY: AlignType;
        protected _parent: Sprite<any>;
        protected _props: T & ISprite;
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
        bgColor: Color;
        border: {
            width: number;
            color: Color;
        };
        children: Sprite<any>[];
        touchEnabled: boolean;
        mouseEnabled: boolean;
        keyboardEnabled: boolean;
        onClick: ISprite["onClick"];
        /**
         * Mouse begin event handler
         */
        onMouseBegin: ISprite["onMouseBegin"];
        /**
         * Mouse moved event handler
         */
        onMouseMoved: ISprite["onMouseMoved"];
        /**
         * Mouse ended event handler
         */
        onMouseEnded: ISprite["onMouseEnded"];
        /**
         * Touch begin event handler
         */
        onTouchBegin: ISprite["onTouchBegin"];
        /**
         * Touch moved event handler
         */
        onTouchMoved: ISprite["onTouchMoved"];
        /**
         * KeyDown event handler
         */
        onKeyDown: ISprite["onKeyDown"];
        /**
         * KeyUp event handler
         */
        onKeyUp: ISprite["onKeyUp"];
        /**
         * Touch ended event hadndler
         */
        onTouchEnded: ISprite["onTouchEnded"];
        constructor(attrs?: ISprite);
        protected _init(attrs?: ISprite): void;
        width: number;
        height: number;
        originX: number;
        originY: number;
        rotation: number;
        texture: Texture | string;
        parent: Sprite<any>;
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
        addChild(target: Sprite<any>, position?: number): void;
        removeChild(target: Sprite<any>): void;
        removeAllChildren(recusive?: boolean): void;
        release(recusive?: boolean): void;
        update(deltaTime: number): any;
    }


    enum ScaleMode {
        SHOW_ALL = 0,
        NO_BORDER = 1,
        FIX_WIDTH = 2,
        FIX_HEIGHT = 3,
    }
    type VisibleRect = {
        left: number;
        right: number;
        top: number;
        bottom: number;
    };
    class Stage {
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


    type FontWeight = "lighter" | "normal" | "bold" | "bolder";
    type FontStyle = "oblique" | "normal" | "italic";
    type TextAlign = "left" | "right" | "center" | "start" | "end";

    interface ITextLabel extends ISprite {
        text?: string;
        fontName?: string;
        textAlign?: TextAlign;
        fontColor?: Color;
        fontSize?: number;
        lineSpace?: number;
        fontStyle?: FontStyle;
        fontWeight?: FontWeight;
        maxWidth?: number;
        stroke?: {
            color: Color;
            width: number;
        };
    }
    class TextLabel extends Sprite<ITextLabel> {
        maxWidth: number;
        fontName: string;
        textAlign: TextAlign;
        fontColor: Color;
        fontSize: number;
        fontWeight: FontWeight;
        fontStyle: FontStyle;
        lineSpace: number;
        stroke: {
            color: Color;
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

    interface IBMFontLabel extends ISprite {
        textureMap: {
            [word: string]: Texture;
        };
        text?: string;
    }

    class BMFontLabel extends Sprite<IBMFontLabel> {
        private _text;
        private _words;
        private _textureMap;
        constructor(attrs?: IBMFontLabel);
        text: string;
        textureMap: {
            [word: string]: Texture;
        };
        setText(text: string): void;
        addChild(): void;
    }


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

    interface Ref<T> {
        ref?(instance: T): any;
    }
    type SpriteProps = ISprite & Ref<Sprite<{}>>;
    type TextProps = ITextLabel & Ref<TextLabel>;
    type BMFontProps = IBMFontLabel & Ref<BMFontLabel>;
    type SpriteClass<T, U> = new (attrs?: T & ISprite) => U;
    type StageProps = {
        width: number;
        height: number;
        canvas: HTMLCanvasElement;
        scaleMode: ScaleMode;
        autoAdjustCanvasSize?: boolean;
        touchEnabled?: boolean;
        mouseEnabled?: boolean;
        keyboardEnabled?: boolean;
        useExternalTimer?: boolean;
    } & Ref<Stage>;
    function createSprite<T, U>(type: "sprite", props: SpriteProps, ...children: any[]): Sprite<{}>;
    function createSprite<T, U>(type: "text", props: TextProps, ...children: any[]): TextLabel;
    function createSprite<T, U>(type: "bmfont", props: BMFontProps, ...children: any[]): BMFontLabel;
    function createSprite<T, U>(type: "stage", props: StageProps, ...children: any[]): Stage;
    function createSprite<T, U>(type: SpriteClass<T, U>, props: T & SpriteProps, ...children: any[]): U;

}

declare global {
    namespace JSX {
        interface Element extends canvas2d.Sprite<any> { }
        interface ElementAttributesProperty { _props: {}; }
        interface IntrinsicClassAttributes<T> extends canvas2d.Ref<T> { }
        interface IntrinsicElements {
            sprite: canvas2d.SpriteProps;
            text: canvas2d.TextProps;
            bmfont: canvas2d.BMFontProps;
            stage: canvas2d.StageProps;
        }
    }
}