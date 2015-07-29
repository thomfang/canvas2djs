/// <reference path="stage.ts" />

module canvas2d.UIEvent {

    export interface EventHelper {
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

    var keyDown = "keydown";
    var keyUp = "keyup";

    var touchBegin = "touchstart";
    var touchMoved = "touchmove";
    var touchEnded = "touchend";

    var mouseBegin = "mousedown";
    var mouseMoved = "mousemove";
    var mouseEnded = "mouseup";

    var ON_CLICK = "onclick";
    var ON_KEY_UP = "onkeyup";
    var ON_KEY_DOWN = "onkeydown";

    var ON_TOUCH_BEGIN = "ontouchbegin";
    var ON_TOUCH_MOVED = "ontouchmoved";
    var ON_TOUCH_ENDED = "ontouchended";

    var ON_MOUSE_BEGIN = "onmousebegin";
    var ON_MOUSE_MOVED = "onmousemoved";
    var ON_MOUSE_ENDED = "onmouseended";

    var touchMap: { [index: number]: EventHelper } = {};
    var mouseLoc: EventHelper;

    export var supportTouch: boolean = "ontouchend" in window;

    export function register(): void {
        if (Stage.touchEnabled && supportTouch) {
            Stage.canvas.addEventListener(touchBegin, touchBeginHandler, false);
        }
        if (Stage.mouseEnabled && !supportTouch) {
            Stage.canvas.addEventListener(mouseBegin, mouseBeginHandler, false);
        }
        if (Stage.keyboardEnabled) {
            document.addEventListener(keyDown, keyDownHandler, false);
            document.addEventListener(keyUp, keyUpHandler, false);
        }
    }

    export function unregister(): void {
        Stage.canvas.removeEventListener(touchBegin, touchBeginHandler, false);
        Stage.canvas.removeEventListener(mouseBegin, mouseBeginHandler, false);

        document.removeEventListener(keyDown, keyDownHandler, false);
        document.removeEventListener(keyUp, keyUpHandler, false);
    }

    function transformTouches(touches, justGet?: boolean): EventHelper[] {
        var ret: EventHelper[] = [];
        var pos = Stage.canvas.getBoundingClientRect();

        for (var i: number = 0, x: number, y: number, id: number, transformed, touch; touch = touches[i]; i++) {
            id = touch.identifier;
            x = (touch.clientX - pos.left) / Stage._scale;
            y = (touch.clientY - pos.top) / Stage._scale;

            transformed = touchMap[id];

            if (!transformed) {
                transformed = touchMap[id] = {
                    identifier: id,
                    beginX: x,
                    beginY: y
                };
            }
            else if (!justGet) {
                transformed._moved = x - transformed.beginX !== 0 || y - transformed.beginY !== 0;
            }

            transformed.stageX = x;
            transformed.stageY = y;

            ret.push(transformed);
        }
        return ret;
    }

    function transformLocation(event): EventHelper {
        var pos = Stage.canvas.getBoundingClientRect();
        var x = (event.clientX - pos.left) / Stage._scale;
        var y = (event.clientY - pos.top) / Stage._scale;

        if (!mouseLoc) {
            mouseLoc = {
                beginX: x,
                beginY: y
            };
        }
        else {
            mouseLoc._moved = x - mouseLoc.beginX !== 0 || y - mouseLoc.beginY !== 0;
        }

        mouseLoc.stageX = x;
        mouseLoc.stageY = y;

        return mouseLoc;
    }

    function isRectContainPoint(rect: IRect, p: EventHelper) {
        return rect.x <= p.stageX && rect.x + rect.width >= p.stageX &&
            rect.y <= p.stageY && rect.y + rect.height >= p.stageY;
    }

    function touchBeginHandler(event) {
        if (!Stage.isRunning || !Stage.touchEnabled) {
            return;
        }

        var touches = transformTouches(event.changedTouches);

        if (dispatchTouch(Stage.sprite, 0, 0, touches.slice(), event, ON_TOUCH_BEGIN)) {
            touches.forEach((touch) => {
                touch.beginTarget = touch.target;
            });

            Stage.canvas.addEventListener(touchMoved, touchMovedHandler, false);
            Stage.canvas.addEventListener(touchEnded, touchEndedHandler, false);
        }

        event.preventDefault();
    }

    function touchMovedHandler(event) {
        if (!Stage.isRunning || !Stage.touchEnabled) {
            return;
        }

        var touches: EventHelper[] = transformTouches(event.changedTouches);

        dispatchTouch(Stage.sprite, 0, 0, touches, event, ON_TOUCH_MOVED);

        event.preventDefault();
    }

    function touchEndedHandler(event) {
        Stage.canvas.removeEventListener(touchEnded, touchEndedHandler, false);
        Stage.canvas.removeEventListener(touchMoved, touchMovedHandler, false);

        var touches = transformTouches(event.changedTouches, true);
        var target;

        touches.forEach((touch) => {
            target = touch.target;

            if (Stage.isRunning && Stage.touchEnabled) {
                if (hasImplements(target, ON_TOUCH_ENDED)) {
                    target[ON_TOUCH_ENDED](touch, touches, event);
                }

                if (hasImplements(target, ON_CLICK) && target === touch.beginTarget && !touch._moved) {
                    target[ON_CLICK](touch, event);
                }
            }

            touch.target = null;
            touch.beginTarget = null;
            touchMap[touch.identifier] = null;
        });

        touches = null;
    }

    function mouseBeginHandler(event) {
        if (!Stage.isRunning || !Stage.mouseEnabled) {
            return;
        }

        var location = transformLocation(event);

        if (dispatchMouse(Stage.sprite, 0, 0, location, event, ON_MOUSE_BEGIN)) {
            location.beginTarget = location.target;
            Stage.canvas.addEventListener(mouseMoved, mouseMovedHandler, false);
            Stage.canvas.addEventListener(mouseEnded, mouseEndedHandler, false);
        }

        event.preventDefault();
    }

    function mouseMovedHandler(event) {
        if (!Stage.isRunning || !Stage.mouseEnabled) {
            return;
        }

        var location = transformLocation(event);

        dispatchMouse(Stage.sprite, 0, 0, location, event, ON_MOUSE_MOVED);
        event.preventDefault();
    }

    function mouseEndedHandler(event) {
        Stage.canvas.removeEventListener(mouseEnded, mouseEndedHandler, false);
        Stage.canvas.removeEventListener(mouseMoved, mouseMovedHandler, false);

        var location = transformLocation(event);
        var target;

        if (Stage.mouseEnabled) {
            target = location.target;

            if (hasImplements(target, ON_MOUSE_ENDED)) {
                target[ON_MOUSE_ENDED](location, event);
            }

            if (hasImplements(target, ON_CLICK) && target === location.beginTarget && !location._moved) {
                target[ON_CLICK](location, event);
            }
        }

        mouseLoc = location.target = location.beginTarget = null;
    }

    function keyDownHandler(event) {
        if (!Stage.isRunning || !Stage.keyboardEnabled) {
            return;
        }
        dispatchKeyboard(Stage.sprite, event.keyCode, event, ON_KEY_DOWN);
    }

    function keyUpHandler(event) {
        if (!Stage.isRunning || !Stage.keyboardEnabled) {
            return;
        }
        dispatchKeyboard(Stage.sprite, event.keyCode, event, ON_KEY_UP);
    }

    function dispatchTouch(sprite: Sprite, offsetX: number, offsetY: number, touches: EventHelper[], event, method: string): boolean {
        if (sprite.touchEnabled === false || !sprite.visible) {
            return false;
        }

        offsetX += sprite.x - sprite._originPixelX;
        offsetY += sprite.y - sprite._originPixelY;

        var children = sprite.children;
        var dispatched: boolean;

        if (children && children.length) {
            var index = children.length;

            while (--index >= 0) {
                dispatched = dispatchTouch(children[index], offsetX, offsetY, touches, event, method);

                if (dispatched && !touches.length) {
                    return true;
                }
            }
        }

        var notImplementMethod: boolean = !hasImplements(sprite, method);
        var notImplementClick: boolean = !hasImplements(sprite, ON_CLICK);

        if (sprite.width === 0 || sprite.height === 0 || (notImplementMethod && notImplementClick)) {
            return false;
        }

        var hits: EventHelper[] = [];
        var rect: IRect = {
            x: offsetX,
            y: offsetY,
            width: sprite.width,
            height: sprite.height
        };

        for (var i = 0, touch: EventHelper; touch = touches[i]; i++) {
            if (isRectContainPoint(rect, touch)) {
                touch.target = sprite;
                touch.localX = touch.stageX - rect.x;
                touch.localY = touch.stageY - rect.y;

                hits.push(touch);
                touches.splice(i--, 1);
            }
        }

        if (hits.length) {
            if (!notImplementMethod) {
                sprite[method](hits, event);
            }
            return true;
        }

        return false;
    }

    function dispatchMouse(sprite: Sprite, offsetX: number, offsetY: number, location: EventHelper, event, method: string): boolean {
        if (sprite.mouseEnabled === false || !sprite.visible) {
            return false;
        }

        offsetX += sprite.x - sprite._originPixelX;
        offsetY += sprite.y - sprite._originPixelY;

        var children = sprite.children;

        if (children && children.length) {
            var index = children.length;

            while (--index >= 0) {
                if (dispatchMouse(children[index], offsetX, offsetY, location, event, method)) {
                    return true;
                }
            }
        }

        var notImplementMethod: boolean = !hasImplements(sprite, method);
        var notImplementClick: boolean = !hasImplements(sprite, ON_CLICK);

        if (sprite.width === 0 || sprite.height === 0 || (notImplementMethod && notImplementClick)) {
            return false;
        }

        var rect: IRect = {
            x: offsetX,
            y: offsetY,
            width: sprite.width,
            height: sprite.height
        };

        if (isRectContainPoint(rect, location)) {
            location.target = sprite;
            location.localX = location.stageX - rect.x;
            location.localY = location.stageY - rect.y;

            if (!notImplementMethod) {
                sprite[method](location, event);
            }
            return true;
        }

        return false;
    }

    function dispatchKeyboard(sprite: Sprite, keyCode: number, event, method: string) {
        if (sprite.keyboardEnabled === false) {
            return;
        }

        if (hasImplements(sprite, method)) {
            sprite[method](keyCode, event);
        }

        var i = 0, children = sprite.children, child;

        if (children && children.length) {
            for (; child = children[i]; i++) {
                dispatchKeyboard(child, keyCode, event, method);
            }
        }
    }

    function hasImplements(sprite: Sprite, type: string) {
        return sprite[type] !== Sprite.prototype[type] && typeof sprite[type] === 'function';
    }
}