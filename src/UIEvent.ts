import { Rect } from './Texture';
import { Stage, Orientation } from './Stage';
import { Sprite } from './sprite/Sprite';
import { addArrayItem } from './Util';

export type EventHelper = {
    identifier?: number;
    beginX: number;
    beginY: number;
    localX?: number;
    localY?: number;
    stageX?: number;
    stageY?: number;
    _moved?: boolean;
    beginTarget?: Sprite<{}>;
    target?: Sprite<{}>;
    cancelBubble: boolean;
    stopPropagation();
}

const onClick = "onClick";

const onTouchBegin = "onTouchBegin";
const onTouchMoved = "onTouchMoved";
const onTouchEnded = "onTouchEnded";

const onMouseBegin = "onMouseBegin";
const onMouseMoved = "onMouseMoved";
const onMouseEnded = "onMouseEnded";

export class UIEvent {

    public static supportTouch: boolean = "ontouchend" in window;

    public static TOUCH_BEGIN = "touchbegin";
    public static TOUCH_MOVED = "touchmoved";
    public static TOUCH_ENDED = "touchended";

    public static MOUSE_BEGIN = "mousebegin";
    public static MOUSE_MOVED = "mousemoved";
    public static MOUSE_ENDED = "mouseended";

    public static CLICK = "click";

    public static ADD_TO_STAGE = "addtostage";
    public static REMOVED_FROM_STAGE = "removedfromstage";
    public static FRAME = "frame";

    private _registered: boolean;
    private _touchHelperMap: { [index: number]: EventHelper } = {};
    private _mouseBeginHelper: EventHelper;
    private _mouseMovedHelper: EventHelper;

    stage: Stage;
    element: HTMLElement;

    constructor(stage: Stage) {
        this.stage = stage;
        this.element = stage.canvas;
    }

    register() {
        if (this._registered) {
            return;
        }

        var { stage, element } = this;

        if (UIEvent.supportTouch) {
            element.addEventListener("touchstart", this._touchBeginHandler, false);
            element.addEventListener("touchmove", this._touchMovedHandler, false);
            element.addEventListener("touchend", this._touchEndedHandler, false);
        }

        element.addEventListener("mousedown", this._mouseBeginHandler, false);
        element.addEventListener("mousemove", this._mouseMovedHandler, false);
        element.addEventListener("mouseup", this._mouseEndedHandler, false);

        this._touchHelperMap = {};
        this._registered = true;
    }

    unregister(): void {
        if (!this._registered) {
            return;
        }
        var element = this.element;

        element.removeEventListener("touchstart", this._touchBeginHandler, false);
        element.removeEventListener("touchmove", this._touchMovedHandler, false);
        element.removeEventListener("touchend", this._touchEndedHandler, false);


        element.removeEventListener("mousedown", this._mouseBeginHandler, false);
        element.removeEventListener("mousemove", this._mouseMovedHandler, false);
        element.removeEventListener("mouseup", this._mouseEndedHandler, false);

        this._mouseBeginHelper = this._mouseMovedHelper = null;
        this._registered = false;
    }

    release(): void {
        this.unregister();
        this._mouseBeginHandler = this._mouseMovedHandler = this._mouseEndedHandler = null;
        this._touchBeginHandler = this._touchMovedHandler = this._touchEndedHandler = null;
        this._touchHelperMap = null;
        this.element = this.stage = null;
    }

    private _transformLocation(event) {
        var clientRect = this.element.getBoundingClientRect();
        var scaleX = this.stage.scaleX;
        var scaleY = this.stage.scaleY;
        var isRotated = this.stage.isPortrait && this.stage.orientation !== Orientation.PORTRAIT;
        var x: number;
        var y: number;

        if (isRotated) {
            if (this.stage.orientation === Orientation.LANDSCAPE2) {
                x = this.stage.width - (event.clientY - clientRect.top) / scaleX;
                y = (event.clientX - clientRect.left) / scaleY;
            }
            else {
                x = (event.clientY - clientRect.top) / scaleX;
                y = this.stage.height - (event.clientX - clientRect.left) / scaleY;
            }
        }
        else {
            x = (event.clientX - clientRect.left) / scaleX;
            y = (event.clientY - clientRect.top) / scaleY;
        }
        return { x, y };
    }

    private _transformTouches(touches, justGet?: boolean): EventHelper[] {
        var helpers: EventHelper[] = [];
        var clientRect = this.element.getBoundingClientRect();
        var scaleX = this.stage.scaleX;
        var scaleY = this.stage.scaleY;
        var isRotated = this.stage.isPortrait && this.stage.orientation !== Orientation.PORTRAIT;
        var touchHelperMap = this._touchHelperMap;

        for (var i: number = 0, x: number, y: number, id: number, helper, touch; touch = touches[i]; i++) {
            id = touch.identifier;
            var x: number;
            var y: number;

            if (isRotated) {
                if (this.stage.orientation === Orientation.LANDSCAPE2) {
                    x = this.stage.width - (touch.clientY - clientRect.top) / scaleX;
                    y = (touch.clientX - clientRect.left) / scaleY;
                }
                else {
                    x = (touch.clientY - clientRect.top) / scaleX;
                    y = this.stage.height - (touch.clientX - clientRect.left) / scaleY;
                }
            }
            else {
                x = (touch.clientX - clientRect.left) / scaleX;
                y = (touch.clientY - clientRect.top) / scaleY;
            }

            helper = touchHelperMap[id];

            if (!helper) {
                helper = touchHelperMap[id] = {
                    identifier: id,
                    beginX: x,
                    beginY: y,
                    cancelBubble: false,
                    stopPropagation() {
                        this.cancelBubble = true;
                    }
                };
            }
            else if (!justGet) {
                helper._moved = x - helper.beginX !== 0 || y - helper.beginY !== 0;
            }

            helper.stageX = x;
            helper.stageY = y;

            helpers.push(helper);
        }

        return helpers;
    }

    private _touchBeginHandler = (event: TouchEvent) => {
        var stage = this.stage;

        if (!stage.isRunning || !stage.touchEnabled) {
            return;
        }

        var helpers = this._transformTouches(event.changedTouches);

        this._dispatchTouch(stage.sprite, 0, 0, helpers.slice(), event, onTouchBegin, UIEvent.TOUCH_BEGIN);

        helpers.forEach((touch) => {
            touch.beginTarget = touch.target;
        });

        stage.emit(UIEvent.TOUCH_BEGIN, helpers, event);
        event.preventDefault();
    }

    private _touchMovedHandler = (event: TouchEvent) => {
        var stage = this.stage;

        if (!stage.isRunning || !stage.touchEnabled) {
            return;
        }

        var helpers = this._transformTouches(event.changedTouches);

        this._dispatchTouch(stage.sprite, 0, 0, helpers, event, onTouchMoved, UIEvent.TOUCH_MOVED);

        stage.emit(UIEvent.TOUCH_MOVED, helpers, event);
        event.preventDefault();
    }

    private _touchEndedHandler = (event: TouchEvent) => {
        var stage = this.stage;

        if (stage.isRunning && stage.touchEnabled) {
            var helpers = this._transformTouches(event.changedTouches, true);

            this._dispatchTouch(stage.sprite, 0, 0, helpers.slice(), event, onTouchEnded, UIEvent.TOUCH_ENDED, true);

            helpers.forEach(helper => {
                if (!helper._moved || isMovedSmallRange(helper)) {
                    stage.emit(UIEvent.CLICK, helper, event);
                }
                helper.target = null;
                helper.beginTarget = null;
                this._touchHelperMap[helper.identifier] = null;
            });

            stage.emit(UIEvent.TOUCH_ENDED, helpers, event);
            helpers = null;
        }
    }

    private _mouseBeginHandler = (event: MouseEvent) => {
        var stage = this.stage;
        if (!stage.isRunning || !stage.mouseEnabled) {
            return;
        }

        var location = this._transformLocation(event);
        var helper: EventHelper = {
            beginX: location.x,
            beginY: location.y,
            stageX: location.x,
            stageY: location.y,
            cancelBubble: false,
            stopPropagation() {
                this.cancelBubble = true;
            }
        };

        this._dispatchMouse(stage.sprite, 0, 0, helper, event, UIEvent.MOUSE_BEGIN, onMouseBegin);

        if (helper.target) {
            helper.beginTarget = helper.target;
            this._mouseBeginHelper = helper;
        }

        stage.emit(UIEvent.MOUSE_BEGIN, helper, event);
        event.preventDefault();
    }

    private _mouseMovedHandler = (event: MouseEvent) => {
        var stage = this.stage;
        if (!stage.isRunning || !stage.mouseEnabled) {
            return;
        }

        var location = this._transformLocation(event);
        var mouseBeginHelper = this._mouseBeginHelper;

        if (mouseBeginHelper) {
            mouseBeginHelper.stageX = location.x;
            mouseBeginHelper.stageY = location.y;
            mouseBeginHelper._moved = mouseBeginHelper.beginX - location.x !== 0 || mouseBeginHelper.beginY - location.y !== 0;
            mouseBeginHelper.cancelBubble = false;
            this._dispatchMouse(stage.sprite, 0, 0, mouseBeginHelper, event, UIEvent.MOUSE_MOVED, onMouseMoved);
            stage.emit(UIEvent.MOUSE_MOVED, mouseBeginHelper, event);
        }
        else {
            let mouseMovedHelper = this._mouseMovedHelper = {
                beginX: null,
                beginY: null,
                stageX: location.x,
                stageY: location.y,
                cancelBubble: false,
                stopPropagation() {
                    this.cancelBubble = true;
                }
            };
            this._dispatchMouse(stage.sprite, 0, 0, mouseMovedHelper, event, UIEvent.MOUSE_MOVED, onMouseMoved);
            stage.emit(UIEvent.MOUSE_MOVED, mouseMovedHelper, event);
        }

        event.preventDefault();
    }

    private _mouseEndedHandler = (event: MouseEvent) => {
        var stage = this.stage;
        if (stage.isRunning && stage.mouseEnabled) {
            var location = this._transformLocation(event)
            var helper = this._mouseBeginHelper || this._mouseMovedHelper;
            var target;

            helper.stageX = location.x;
            helper.stageY = location.y;
            target = helper.target;

            var triggerClick = !helper._moved || isMovedSmallRange(helper);
            this._dispatchMouse(stage.sprite, 0, 0, helper, event, onMouseEnded, UIEvent.MOUSE_ENDED, triggerClick);
            if (!helper._moved || isMovedSmallRange(helper)) {
                stage.emit(UIEvent.CLICK, helper, event);
            }
            stage.emit(UIEvent.MOUSE_ENDED, helper, event);
            helper.target = helper.beginTarget = null;
        }

        this._mouseBeginHelper = this._mouseMovedHelper = null;
    }

    private _dispatchTouch(
        sprite: Sprite<{}>,
        offsetX: number,
        offsetY: number,
        helpers: EventHelper[],
        event: TouchEvent,
        methodName: string,
        eventName: string,
        needTriggerClick?: boolean
    ): any {
        if (!sprite.touchEnabled || !sprite.visible) {
            return;
        }

        offsetX += sprite.x - (sprite as any)._originPixelX;
        offsetY += sprite.y - (sprite as any)._originPixelY;

        if (sprite.clipOverflow) {
            return this._detectTouchOnClipArea(sprite, offsetX, offsetY, helpers, event, methodName, eventName, needTriggerClick);
        }

        var children = sprite.children;
        var tmpHelpers: EventHelper[] = helpers.slice();
        var triggerreds: EventHelper[] = [];
        var result: EventHelper[];

        var callback = helper => result.indexOf(helper) === -1;

        if (children && children.length) {
            let index = children.length;

            while (--index >= 0) {
                result = this._dispatchTouch(children[index], offsetX, offsetY, tmpHelpers, event, methodName, eventName, needTriggerClick);
                if (result && result.length) {
                    triggerreds.push(...result);

                    // Remove triggerred touch helper, it won't pass to other child sprites
                    tmpHelpers = tmpHelpers.filter(callback);

                    // All triggerred then exit the loop
                    if (!tmpHelpers.length) {
                        break;
                    }
                }
            }
        }

        var hits: EventHelper[] = triggerreds.filter(helper => !helper.cancelBubble);
        var rect: Rect = {
            x: offsetX,
            y: offsetY,
            width: sprite.width,
            height: sprite.height
        };
        var circle = {
            x: offsetX,
            y: offsetY,
            radius: sprite.radius
        };
        var count = 0;

        for (let i = 0, helper: EventHelper; helper = tmpHelpers[i]; i++) {
            if (isRectContainPoint(rect, helper) || isCircleContainPoint(circle, helper)) {
                if (!helper.target) {
                    helper.target = sprite;
                }
                helper.localX = helper.stageX - rect.x;
                helper.localY = helper.stageY - rect.y;

                // Add for current sprite hit list
                hits.push(helper);
                count++;
            }
        }

        if (hits.length) {
            // var hasMethod: boolean = hasImplements(sprite, methodName);
            // var hasClickHandler: boolean = hasImplements(sprite, onClick);

            triggerreds.push(...hits.slice(hits.length - count, count));

            sprite.emit(eventName, hits, event);
            sprite[methodName] && sprite[methodName](hits, event);

            // Click event would just trigger by only a touch
            if (needTriggerClick && hits.length === 1 && (!hits[0]._moved || isMovedSmallRange(hits[0]))) {
                sprite.emit(UIEvent.CLICK, hits[0], event);
                sprite[onClick] && sprite[onClick](hits[0], event as any);
                addArrayItem(triggerreds, hits[0]);
            }
        }
        return triggerreds;
    }

    private _detectTouchOnClipArea(
        sprite: Sprite<{}>,
        offsetX: number,
        offsetY: number,
        helpers: EventHelper[],
        event: TouchEvent,
        methodName: string,
        eventName: string,
        needTriggerClick?: boolean
    ) {
        var hits: EventHelper[] = [];
        var rect: Rect = {
            x: offsetX,
            y: offsetY,
            width: sprite.width,
            height: sprite.height
        };
        var circle = {
            x: offsetX,
            y: offsetY,
            radius: sprite.radius
        };
        var count = 0;

        for (let i = 0, helper: EventHelper; helper = helpers[i]; i++) {
            if (isRectContainPoint(rect, helper) || isCircleContainPoint(circle, helper)) {
                helper.localX = helper.stageX - offsetX;
                helper.localY = helper.stageY - offsetY;

                // Add for current sprite hit list
                hits.push(helper);
                count++;
            }
        }

        if (hits.length) {
            let children = sprite.children;
            let triggerreds = [];
            if (children && children.length) {
                let index = children.length;
                let result;
                let filterUnTriggerred = helper => result.indexOf(helper) === -1;
                let tmpHelpers = hits.slice();

                while (--index >= 0) {
                    result = this._dispatchTouch(children[index], offsetX, offsetY, tmpHelpers, event, methodName, eventName, needTriggerClick);
                    if (result && result.length) {
                        triggerreds.push(...result);

                        // Remove triggerred touch helper, it won't pass to other child sprites
                        tmpHelpers = tmpHelpers.filter(filterUnTriggerred);

                        // All triggerred then exit the loop
                        if (!tmpHelpers.length) {
                            break;
                        }
                    }
                }
            }

            // hits = triggerreds.filter(helper => !helper.cancelBubble);
            hits = hits.filter(helper => triggerreds.indexOf(helper) < 0 || !helper.cancelBubble);

            if (hits.length) {
                hits.forEach(e => {
                    if (!e.target) {
                        e.target = sprite;
                    }
                });
                sprite.emit(eventName, hits, event);
                sprite[methodName] && sprite[methodName](hits, event);

                // Click event would just trigger by only a touch
                if (needTriggerClick && hits.length === 1 && (!hits[0]._moved || isMovedSmallRange(hits[0]))) {
                    sprite.emit(UIEvent.CLICK, hits[0], event);
                    sprite[onClick] && sprite[onClick](hits[0], event as any);
                }
            }

            return triggerreds;
        }
    }

    private _dispatchMouse(
        sprite: Sprite<{}>,
        offsetX: number,
        offsetY: number,
        helper: EventHelper,
        event: MouseEvent,
        methodName: string,
        eventName: string,
        needTriggerClick?: boolean
    ): boolean {
        if (!sprite.mouseEnabled || !sprite.visible) {
            return false;
        }

        offsetX += sprite.x - (sprite as any)._originPixelX;
        offsetY += sprite.y - (sprite as any)._originPixelY;

        if (sprite.clipOverflow) {
            return this._detectMouseOnClipArea(sprite, offsetX, offsetY, helper, event, methodName, eventName, needTriggerClick);
        }

        var children = sprite.children;
        var triggerred = false;

        if (children && children.length) {
            var index = children.length;

            while (--index >= 0) {
                triggerred = this._dispatchMouse(children[index], offsetX, offsetY, helper, event, methodName, eventName, needTriggerClick);
                if (triggerred) {
                    break;
                }
            }

            if (helper.cancelBubble) {
                return true;
            }
        }

        var rect: Rect = {
            x: offsetX,
            y: offsetY,
            width: sprite.width,
            height: sprite.height
        };
        var circle = {
            x: offsetX,
            y: offsetY,
            radius: sprite.radius
        };

        if (triggerred || isRectContainPoint(rect, helper) || isCircleContainPoint(circle, helper)) {
            if (!helper.target) {
                helper.target = sprite;
            }
            helper.localX = helper.stageX - rect.x;
            helper.localY = helper.stageY - rect.y;

            sprite.emit(eventName, helper, event);
            sprite[methodName] && sprite[methodName](helper, event);
            if (needTriggerClick) {
                sprite.emit(UIEvent.CLICK, helper, event);
                sprite[onClick] && sprite[onClick](helper, event);
            }

            return true;
        }
    }

    private _detectMouseOnClipArea(
        sprite: Sprite<{}>,
        offsetX: number,
        offsetY: number,
        helper: EventHelper,
        event: MouseEvent,
        methodName: string,
        eventName: string,
        needTriggerClick?: boolean
    ): boolean {
        var rect: Rect = {
            x: offsetX,
            y: offsetY,
            width: sprite.width,
            height: sprite.height
        };
        var circle = {
            x: offsetX,
            y: offsetY,
            radius: sprite.radius
        };

        if (isRectContainPoint(rect, helper) || isCircleContainPoint(circle, helper)) {
            var children = sprite.children;
            var triggerred = false;

            if (children && children.length) {
                var index = children.length;

                while (--index >= 0) {
                    triggerred = this._dispatchMouse(children[index], offsetX, offsetY, helper, event, methodName, eventName, needTriggerClick);
                    if (triggerred) {
                        break;
                    }
                }

                if (helper.cancelBubble) {
                    return true;
                }
            }

            if (!helper.target) {
                helper.target = sprite;
            }
            helper.localX = helper.stageX - rect.x;
            helper.localY = helper.stageY - rect.y;

            sprite.emit(eventName, helper, event);
            sprite[methodName] && sprite[methodName](helper, event);
            if (needTriggerClick) {
                sprite.emit(UIEvent.CLICK, helper, event);
                sprite[onClick] && sprite[onClick](helper, event);
            }

            return true;
        }
    }
}

function isRectContainPoint(rect: Rect, p: EventHelper) {
    return rect.x <= p.stageX && rect.x + rect.width >= p.stageX &&
        rect.y <= p.stageY && rect.y + rect.height >= p.stageY;
}

function isCircleContainPoint(circle: { x: number; y: number; radius: number }, p: EventHelper) {
    var dx = p.stageX - circle.x;
    var dy = p.stageY - circle.y;
    return Math.sqrt(dx * dx + dy * dy) <= circle.radius;
}

function isMovedSmallRange(e: EventHelper) {
    if (e.beginX == null && e.beginY == null) {
        return false;
    }
    let x = Math.abs(e.beginX - e.stageX);
    let y = Math.abs(e.beginY - e.stageY);

    return x <= 5 && y <= 5;
}

function hasImplements(sprite: Sprite<{}>, methodName: string) {
    return sprite[methodName] !== Sprite.prototype[methodName] && typeof sprite[methodName] === 'function';
}