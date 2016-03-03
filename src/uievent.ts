/// <reference path="stage.ts" />
/// <reference path="util.ts" />

/**
 * Virtual UI event manager
 */
namespace canvas2d.UIEvent {

    export interface IEventHelper {
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

    var keyDown = "keydown";
    var keyUp = "keyup";

    var touchBegin = "touchstart";
    var touchMoved = "touchmove";
    var touchEnded = "touchend";

    var mouseBegin = "mousedown";
    var mouseMoved = "mousemove";
    var mouseEnded = "mouseup";

    const onclick = "onclick";
    const onkeyup = "onkeyup";
    const onkeydown = "onkeydown";

    const ontouchbegin = "ontouchbegin";
    const ontouchmoved = "ontouchmoved";
    const ontouchended = "ontouchended";

    const onmousebegin = "onmousebegin";
    const onmousemoved = "onmousemoved";
    const onmouseended = "onmouseended";

    var touchHelperMap: { [index: number]: IEventHelper } = {};
    var mouseBeginHelper: IEventHelper;
    var mouseMovedHelper: IEventHelper;

    var registered: boolean;

    export var supportTouch: boolean = "ontouchend" in window;

    /**
     * Register UI event
     */
    export function register(): void {
        if (registered) {
            return;
        }

        var canvas = Stage.canvas;

        if (Stage.touchEnabled && supportTouch) {
            canvas.addEventListener(touchBegin, touchBeginHandler, false);
            canvas.addEventListener(touchMoved, touchMovedHandler, false);
            canvas.addEventListener(touchEnded, touchEndedHandler, false);
        }
        if (Stage.mouseEnabled) {
            canvas.addEventListener(mouseBegin, mouseBeginHandler, false);
            canvas.addEventListener(mouseMoved, mouseMovedHandler, false);
            canvas.addEventListener(mouseEnded, mouseEndedHandler, false);
        }
        if (Stage.keyboardEnabled) {
            document.addEventListener(keyDown, keyDownHandler, false);
            document.addEventListener(keyUp, keyUpHandler, false);
        }

        registered = true;
    }

    /**
     * Unregister UI event
     */
    export function unregister(): void {
        var canvas = Stage.canvas;
        canvas.removeEventListener(touchBegin, touchBeginHandler, false);
        canvas.removeEventListener(touchMoved, touchMovedHandler, false);
        canvas.removeEventListener(touchEnded, touchEndedHandler, false);
        
        canvas.removeEventListener(mouseBegin, mouseBeginHandler, false);
        canvas.removeEventListener(mouseMoved, mouseMovedHandler, false);
        canvas.removeEventListener(mouseEnded, mouseEndedHandler, false);

        document.removeEventListener(keyDown, keyDownHandler, false);
        document.removeEventListener(keyUp, keyUpHandler, false);

        registered = false;
    }

    /**
     * Transform event location to stage location
     */    
    export function transformLocation(event) {
        var pos = Stage.canvas.getBoundingClientRect();
        var x = (event.clientX - pos.left) / Stage._scale;
        var y = (event.clientY - pos.top) / Stage._scale;
        return { x, y };
    }

    function transformTouches(touches, justGet?: boolean): IEventHelper[] {
        var helpers: IEventHelper[] = [];
        var rect = Stage.canvas.getBoundingClientRect();

        for (var i: number = 0, x: number, y: number, id: number, helper, touch; touch = touches[i]; i++) {
            id = touch.identifier;
            x = (touch.clientX - rect.left) / Stage._scale;
            y = (touch.clientY - rect.top) / Stage._scale;

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

    function isRectContainPoint(rect: IRect, p: IEventHelper) {
        return rect.x <= p.stageX && rect.x + rect.width >= p.stageX &&
            rect.y <= p.stageY && rect.y + rect.height >= p.stageY;
    }

    function isMovedSmallRange(e: IEventHelper) {
        if (e.beginX == null && e.beginY == null) {
            return false;
        }
        let x = Math.abs(e.beginX - e.stageX);
        let y = Math.abs(e.beginY - e.stageY);

        return x <= 5 && y <= 5;
    }

    function touchBeginHandler(event: TouchEvent) {
        if (!Stage.isRunning || !Stage.touchEnabled) {
            return;
        }

        var helpers = transformTouches(event.changedTouches);

        dispatchTouch(Stage.sprite, 0, 0, helpers.slice(), event, ontouchbegin);

        helpers.forEach((touch) => {
            touch.beginTarget = touch.target;
        });

        event.preventDefault();
    }

    function touchMovedHandler(event: TouchEvent) {
        if (!Stage.isRunning || !Stage.touchEnabled) {
            return;
        }

        var helpers = transformTouches(event.changedTouches);

        dispatchTouch(Stage.sprite, 0, 0, helpers, event, ontouchmoved);

        event.preventDefault();
    }

    function touchEndedHandler(event: TouchEvent) {
        if (Stage.isRunning && Stage.touchEnabled) {
            var helpers = transformTouches(event.changedTouches, true);
            
            dispatchTouch(Stage.sprite, 0, 0, helpers.slice(), event, ontouchended, true);

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
                touchHelperMap[helper.identifier] = null;
            });

            helpers = null;
        }
    }

    function mouseBeginHandler(event: MouseEvent) {
        if (!Stage.isRunning || !Stage.mouseEnabled) {
            return;
        }

        var location = transformLocation(event);
        var helper: IEventHelper = {
            beginX: location.x,
            beginY: location.y,
            stageX: location.x,
            stageY: location.y,
            cancelBubble: false
        };

        dispatchMouse(Stage.sprite, 0, 0, helper, event, onmousebegin);

        if (helper.target) {
            helper.beginTarget = helper.target;
            mouseBeginHelper = helper;
        }

        event.preventDefault();
    }

    function mouseMovedHandler(event: MouseEvent) {
        if (!Stage.isRunning || !Stage.mouseEnabled) {
            return;
        }

        var location = transformLocation(event);

        if (mouseBeginHelper) {
            mouseBeginHelper.stageX = location.x;
            mouseBeginHelper.stageY = location.y;
            mouseBeginHelper._moved = mouseBeginHelper.beginX - location.x !== 0 || mouseBeginHelper.beginY - location.y !== 0;
            dispatchMouse(Stage.sprite, 0, 0, mouseBeginHelper, event, onmousemoved);
        }
        else {
            mouseMovedHelper = {
                beginX: null,
                beginY: null,
                stageX: location.x,
                stageY: location.y,
                cancelBubble: false
            };
            dispatchMouse(Stage.sprite, 0, 0, mouseMovedHelper, event, onmousemoved);
        }

        event.preventDefault();
    }

    function mouseEndedHandler(event: MouseEvent) {
        if (Stage.isRunning && Stage.mouseEnabled) {
            var location = transformLocation(event)
            var helper = mouseBeginHelper || mouseMovedHelper;
            var target;

            helper.stageX = location.x;
            helper.stageY = location.y;
            target = helper.target;

            // if (hasImplements(target, ON_MOUSE_ENDED)) {
            //     target[ON_MOUSE_ENDED](helper, event);
            // }
            
            var triggerClick = !helper._moved || isMovedSmallRange(helper);
            dispatchMouse(Stage.sprite, 0, 0, helper, event, onmouseended, triggerClick);

            // if (hasImplements(target, ON_CLICK) && target === helper.beginTarget && (!helper._moved || isMovedSmallRange(helper))) {
            //     target[ON_CLICK](helper, event);
            // }
        }

        mouseBeginHelper = helper.target = helper.beginTarget = null;
    }

    function keyDownHandler(event) {
        if (!Stage.isRunning || !Stage.keyboardEnabled) {
            return;
        }
        dispatchKeyboard(Stage.sprite, event.keyCode, event, onkeydown);
    }

    function keyUpHandler(event) {
        if (!Stage.isRunning || !Stage.keyboardEnabled) {
            return;
        }
        dispatchKeyboard(Stage.sprite, event.keyCode, event, onkeyup);
    }

    function dispatchTouch(sprite: Sprite, offsetX: number, offsetY: number, helpers: IEventHelper[], event: Event, methodName: string, needTriggerClick?: boolean): any {
        if (sprite.touchEnabled === false || !sprite.visible) {
            return;
        }

        offsetX += sprite.x - sprite._originPixelX;
        offsetY += sprite.y - sprite._originPixelY;

        var children = sprite.children;
        var tmpHelpers = helpers.slice();
        var callback = helper => result.indexOf(helper) === -1;
        var result: IEventHelper[];

        if (children && children.length) {
            let index = children.length;

            while (--index >= 0) {
                result = dispatchTouch(children[index], offsetX, offsetY, tmpHelpers, event, methodName, needTriggerClick);
                if (result) {
                    tmpHelpers = tmpHelpers.filter(callback);
                    if (!tmpHelpers.length) {
                        break;
                    }
                }
            }
            
            if (helpers.every(helper => helper.cancelBubble)) {
                
            }
        }

        var hasMethod: boolean = hasImplements(sprite, methodName);
        var hasClickHandler: boolean = hasImplements(sprite, onclick);

        if (!hasMethod && !hasClickHandler) {
            return;
        }

        var hits: IEventHelper[] = helpers.filter(helper => tmpHelpers.indexOf(helper) === -1);
        var rect: IRect = {
            x: offsetX,
            y: offsetY,
            width: sprite.width,
            height: sprite.height
        };

        for (let i = 0, helper: IEventHelper; helper = tmpHelpers[i]; i++) {
            if (isRectContainPoint(rect, helper)) {
                if (!helper.target) {
                    helper.target = sprite;
                }
                helper.localX = helper.stageX - rect.x;
                helper.localY = helper.stageY - rect.y;
                hits.push(helper);
            }
        }

        if (hits.length) {
            if (hasMethod) {
                sprite[methodName](hits, event);
            }
            if (hasClickHandler && needTriggerClick && hits.length === 1 && (!hits[0]._moved || isMovedSmallRange(hits[0]))) {
                sprite[onclick](hits[0], event);
            }
            
            return hits;
        }
    }

    function dispatchMouse(sprite: Sprite, offsetX: number, offsetY: number, helper: IEventHelper, event: Event, methodName: string, triggerClick?: boolean): boolean {
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
                triggerred = dispatchMouse(children[index], offsetX, offsetY, helper, event, methodName, triggerClick);
                if (triggerred) {
                    break;
                }
            }
            
            if (helper.cancelBubble) {
                return true;
            }
        }

        var hasMethod: boolean = hasImplements(sprite, methodName);
        var hasClickHandler: boolean = hasImplements(sprite, onclick);

        if (!hasMethod && !hasClickHandler) {
            return triggerred;
        }

        var rect: IRect = {
            x: offsetX,
            y: offsetY,
            width: sprite.width,
            height: sprite.height
        };

        if (triggerred || isRectContainPoint(rect, helper)) {
            if (!helper.target) {
                helper.target = sprite;
            }
            helper.localX = helper.stageX - rect.x;
            helper.localY = helper.stageY - rect.y;

            if (hasMethod) {
                sprite[methodName](helper, event);
            }
            if (hasClickHandler && triggerClick) {
                sprite[onclick](helper, event);
            }
            
            return true;
        }
    }

    function dispatchKeyboard(sprite: Sprite, keyCode: number, event, methodName: string) {
        if (sprite.keyboardEnabled === false) {
            return;
        }

        if (hasImplements(sprite, methodName)) {
            sprite[methodName](keyCode, event);
        }

        var i = 0, children = sprite.children, child;

        if (children && children.length) {
            for (; child = children[i]; i++) {
                dispatchKeyboard(child, keyCode, event, methodName);
            }
        }
    }

    function hasImplements(sprite: Sprite, methodName: string) {
        return sprite[methodName] !== Sprite.prototype[methodName] && typeof sprite[methodName] === 'function';
    }
}