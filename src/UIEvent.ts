import { Rect } from './Texture';
import { Stage } from './Stage';
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
    beginTarget?: Sprite<any>;
    target?: Sprite<any>;
    cancelBubble: boolean;
}

const keyDown = "keydown";
const keyUp = "keyup";

const touchBegin = "touchstart";
const touchMoved = "touchmove";
const touchEnded = "touchend";

const mouseBegin = "mousedown";
const mouseMoved = "mousemove";
const mouseEnded = "mouseup";

const onClick = "onClick";
const onKeyUp = "onKeyUp";
const onKeyDown = "onKeyDown";

const onTouchBegin = "onTouchBegin";
const onTouchMoved = "onTouchMoved";
const onTouchEnded = "onTouchEnded";

const onMouseBegin = "onMouseBegin";
const onMouseMoved = "onMouseMoved";
const onMouseEnded = "onMouseEnded";

export class UIEvent {

    public static supportTouch: boolean = "ontouchend" in window;

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

        if (stage.touchEnabled && UIEvent.supportTouch) {
            element.addEventListener(touchBegin, this._touchBeginHandler, false);
            element.addEventListener(touchMoved, this._touchMovedHandler, false);
            element.addEventListener(touchEnded, this._touchEndedHandler, false);
        }
        if (stage.mouseEnabled) {
            element.addEventListener(mouseBegin, this._mouseBeginHandler, false);
            element.addEventListener(mouseMoved, this._mouseMovedHandler, false);
            element.addEventListener(mouseEnded, this._mouseEndedHandler, false);
        }
        if (stage.keyboardEnabled) {
            document.addEventListener(keyDown, this._keyDownHandler, false);
            document.addEventListener(keyUp, this._keyUpHandler, false);
        }

        this._touchHelperMap = {};
        this._registered = true;
    }

    unregister(): void {
        if (!this._registered) {
            return;
        }
        var element = this.element;

        element.removeEventListener(touchBegin, this._touchBeginHandler, false);
        element.removeEventListener(touchMoved, this._touchMovedHandler, false);
        element.removeEventListener(touchEnded, this._touchEndedHandler, false);


        element.removeEventListener(mouseBegin, this._mouseBeginHandler, false);
        element.removeEventListener(mouseMoved, this._mouseMovedHandler, false);
        element.removeEventListener(mouseEnded, this._mouseEndedHandler, false);

        document.removeEventListener(keyDown, this._keyDownHandler, false);
        document.removeEventListener(keyUp, this._keyUpHandler, false);

        this._mouseBeginHelper = this._mouseMovedHelper = null;
        this._registered = false;
    }

    release(): void {
        this.unregister();
        this._mouseBeginHandler = this._mouseMovedHandler = this._mouseEndedHandler = null;
        this._touchBeginHandler = this._touchMovedHandler = this._touchEndedHandler = null;
        this._keyUpHandler = this._keyDownHandler = null;
        this._touchHelperMap = null;
        this.element = this.stage = null;
    }

    transformLocation(event) {
        var clientReact = this.element.getBoundingClientRect();
        var scale = this.stage.scale;
        var x = (event.clientX - clientReact.left) / scale;
        var y = (event.clientY - clientReact.top) / scale;
        return { x, y };
    }

    private _transformTouches(touches, justGet?: boolean): EventHelper[] {
        var helpers: EventHelper[] = [];
        var rect = this.element.getBoundingClientRect();
        var scale = this.stage.scale;
        var isPortrait = this.stage.isPortrait;
        var touchHelperMap = this._touchHelperMap;

        for (var i: number = 0, x: number, y: number, id: number, helper, touch; touch = touches[i]; i++) {
            id = touch.identifier;
            x = (touch.clientX - rect.left) / scale;
            y = (touch.clientY - rect.top) / scale;

            if (isPortrait) {
                let tx = x;
                x = y;
                y = tx;
            }

            helper = touchHelperMap[id];

            if (!helper) {
                helper = touchHelperMap[id] = {
                    identifier: id,
                    beginX: x,
                    beginY: y,
                    cancelBubble: false
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

        this._dispatchTouch(stage.sprite, 0, 0, helpers.slice(), event, onTouchBegin);

        helpers.forEach((touch) => {
            touch.beginTarget = touch.target;
        });

        event.preventDefault();
    }

    private _touchMovedHandler = (event: TouchEvent) => {
        var stage = this.stage;

        if (!stage.isRunning || !stage.touchEnabled) {
            return;
        }

        var helpers = this._transformTouches(event.changedTouches);

        this._dispatchTouch(stage.sprite, 0, 0, helpers, event, onTouchMoved);

        event.preventDefault();
    }

    private _touchEndedHandler = (event: TouchEvent) => {
        var stage = this.stage;

        if (stage.isRunning && stage.touchEnabled) {
            var helpers = this._transformTouches(event.changedTouches, true);

            this._dispatchTouch(stage.sprite, 0, 0, helpers.slice(), event, onTouchEnded, true);

            helpers.forEach(helper => {
                // target = helper.target;

                // if (hasImplements(target, ontouchended)) {
                //     target[ontouchended](helper, helpers, event);
                // }

                // if (hasImplements(target, onclick) && target === helper.beginTarget && (!helper._moved || isMovedSmallRange(helper))) {
                //     target[onclick](helper, event);
                // }

                helper.target = null;
                helper.beginTarget = null;
                this._touchHelperMap[helper.identifier] = null;
            });

            helpers = null;
        }
    }

    private _mouseBeginHandler = (event: MouseEvent) => {
        var stage = this.stage;
        if (!stage.isRunning || !stage.mouseEnabled) {
            return;
        }

        var location = this.transformLocation(event);
        var helper: EventHelper = {
            beginX: location.x,
            beginY: location.y,
            stageX: location.x,
            stageY: location.y,
            cancelBubble: false
        };

        this._dispatchMouse(stage.sprite, 0, 0, helper, event, onMouseBegin);

        if (helper.target) {
            helper.beginTarget = helper.target;
            this._mouseBeginHelper = helper;
        }

        event.preventDefault();
    }

    private _mouseMovedHandler = (event: MouseEvent) => {
        var stage = this.stage;
        if (!stage.isRunning || !stage.mouseEnabled) {
            return;
        }

        var location = this.transformLocation(event);
        var mouseBeginHelper = this._mouseBeginHelper;

        if (mouseBeginHelper) {
            mouseBeginHelper.stageX = location.x;
            mouseBeginHelper.stageY = location.y;
            mouseBeginHelper._moved = mouseBeginHelper.beginX - location.x !== 0 || mouseBeginHelper.beginY - location.y !== 0;
            this._dispatchMouse(stage.sprite, 0, 0, mouseBeginHelper, event, onMouseMoved);
        }
        else {
            let mouseMovedHelper = this._mouseMovedHelper = {
                beginX: null,
                beginY: null,
                stageX: location.x,
                stageY: location.y,
                cancelBubble: false
            };
            this._dispatchMouse(stage.sprite, 0, 0, mouseMovedHelper, event, onMouseMoved);
        }

        event.preventDefault();
    }

    private _mouseEndedHandler = (event: MouseEvent) => {
        var stage = this.stage;
        if (stage.isRunning && stage.mouseEnabled) {
            var location = this.transformLocation(event)
            var helper = this._mouseBeginHelper || this._mouseMovedHelper;
            var target;

            helper.stageX = location.x;
            helper.stageY = location.y;
            target = helper.target;

            // if (hasImplements(target, ON_MOUSE_ENDED)) {
            //     target[ON_MOUSE_ENDED](helper, event);
            // }

            var triggerClick = !helper._moved || isMovedSmallRange(helper);
            this._dispatchMouse(stage.sprite, 0, 0, helper, event, onMouseEnded, triggerClick);

            // if (hasImplements(target, ON_CLICK) && target === helper.beginTarget && (!helper._moved || isMovedSmallRange(helper))) {
            //     target[ON_CLICK](helper, event);
            // }
        }

        this._mouseBeginHelper = helper.target = helper.beginTarget = null;
    }

    private _keyDownHandler = (event: KeyboardEvent) => {
        var stage = this.stage;
        if (!stage.isRunning || !stage.keyboardEnabled) {
            return;
        }
        this._dispatchKeyboard(stage.sprite, event.keyCode, event, onKeyDown);
    }

    private _keyUpHandler = (event: KeyboardEvent) => {
        var stage = this.stage;
        if (!stage.isRunning || !stage.keyboardEnabled) {
            return;
        }
        this._dispatchKeyboard(stage.sprite, event.keyCode, event, onKeyUp);
    }

    private _dispatchTouch(
        sprite: Sprite<any>,
        offsetX: number,
        offsetY: number,
        helpers: EventHelper[],
        event: TouchEvent,
        methodName: string,
        needTriggerClick?: boolean
    ): any {
        if (sprite.touchEnabled === false || !sprite.visible) {
            return;
        }

        offsetX += sprite.x - sprite._originPixelX;
        offsetY += sprite.y - sprite._originPixelY;

        var children = sprite.children;
        var tmpHelpers: EventHelper[] = helpers.slice();
        var triggerreds: EventHelper[] = [];
        var result: EventHelper[];

        var callback = helper => result.indexOf(helper) === -1;

        if (children && children.length) {
            let index = children.length;

            while (--index >= 0) {
                result = this._dispatchTouch(children[index], offsetX, offsetY, tmpHelpers, event, methodName, needTriggerClick);
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
        var detect = rect.width === 0 && rect.height === 0 ? (helper: EventHelper) => {
            return isCircleContainPoint(circle, helper);
        } : (helper: EventHelper) => {
            return isRectContainPoint(rect, helper);
        };

        for (let i = 0, helper: EventHelper; helper = tmpHelpers[i]; i++) {
            if (detect(helper)) {
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
            var hasMethod: boolean = hasImplements(sprite, methodName);
            var hasClickHandler: boolean = hasImplements(sprite, onClick);

            if (hasMethod) {
                sprite[methodName](hits, event);
                triggerreds.push(...hits.slice(hits.length - count, count));
            }

            // Click event would just trigger by only a touch
            if (hasClickHandler && needTriggerClick && hits.length === 1 && (!hits[0]._moved || isMovedSmallRange(hits[0]))) {
                sprite[onClick](hits[0], event as any);
                addArrayItem(triggerreds, hits[0]);
            }
        }
        return triggerreds;
    }

    private _dispatchMouse(
        sprite: Sprite<any>,
        offsetX: number,
        offsetY: number,
        helper: EventHelper,
        event: MouseEvent,
        methodName: string,
        triggerClick?: boolean
    ): boolean {
        if (sprite.mouseEnabled === false || !sprite.visible) {
            return false;
        }

        offsetX += sprite.x - sprite._originPixelX;
        offsetY += sprite.y - sprite._originPixelY;

        var children = sprite.children;
        var triggerred = false;

        if (children && children.length) {
            var index = children.length;

            while (--index >= 0) {
                triggerred = this._dispatchMouse(children[index], offsetX, offsetY, helper, event, methodName, triggerClick);
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
        var detect = rect.width === 0 && rect.height === 0 ? (helper: EventHelper) => {
            return isCircleContainPoint(circle, helper);
        } : (helper: EventHelper) => {
            return isRectContainPoint(rect, helper);
        };

        if (triggerred || detect(helper)) {
            var hasMethod: boolean = hasImplements(sprite, methodName);
            var hasClickHandler: boolean = hasImplements(sprite, onClick);

            if (!helper.target) {
                helper.target = sprite;
            }
            helper.localX = helper.stageX - rect.x;
            helper.localY = helper.stageY - rect.y;

            if (hasMethod) {
                sprite[methodName](helper, event);
            }
            if (hasClickHandler && triggerClick) {
                sprite[onClick](helper, event);
            }

            return true;
        }
    }

    private _dispatchKeyboard(sprite: Sprite<any>, keyCode: number, event, methodName: string) {
        if (sprite.keyboardEnabled === false) {
            return;
        }

        if (hasImplements(sprite, methodName)) {
            sprite[methodName](keyCode, event);
        }

        var i = 0, children = sprite.children, child;

        if (children && children.length) {
            for (; child = children[i]; i++) {
                this._dispatchKeyboard(child, keyCode, event, methodName);
            }
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

function hasImplements(sprite: Sprite<any>, methodName: string) {
    return sprite[methodName] !== Sprite.prototype[methodName] && typeof sprite[methodName] === 'function';
}