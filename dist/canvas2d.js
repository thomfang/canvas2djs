/**
 * canvas2djs v2.3.1
 * Copyright (c) 2013-present Todd Fon <tilfon@live.com>
 * All rights reserved.
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define('canvas2d', ['exports'], factory) :
	(factory((global.canvas2d = global.canvas2d || {})));
}(this, (function (exports) { 'use strict';

var Keys = {
    MOUSE_LEFT: 1,
    MOUSE_MID: 2,
    MOUSE_RIGHT: 3,
    BACKSPACE: 8,
    TAB: 9,
    NUM_CENTER: 12,
    ENTER: 13,
    RETURN: 13,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    PAUSE: 19,
    CAPS_LOCK: 20,
    ESC: 27,
    ESCAPE: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    PRINT_SCREEN: 44,
    INSERT: 45,
    DELETE: 46,
    ZERO: 48,
    ONE: 49,
    TWO: 50,
    THREE: 51,
    FOUR: 52,
    FIVE: 53,
    SIX: 54,
    SEVEN: 55,
    EIGHT: 56,
    NINE: 57,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    CONTEXT_MENU: 93,
    NUM0: 96,
    NUM1: 97,
    NUM2: 98,
    NUM3: 99,
    NUM4: 100,
    NUM5: 101,
    NUM6: 102,
    NUM7: 103,
    NUM8: 104,
    NUM9: 105,
    NUM_MULTIPLY: 106,
    NUM_PLUS: 107,
    NUM_MINUS: 109,
    NUM_PERIOD: 110,
    NUM_DIVISION: 111,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123
};

var Tween = {
    easeInQuad: function (pos) {
        return Math.pow(pos, 2);
    },
    easeOutQuad: function (pos) {
        return -(Math.pow((pos - 1), 2) - 1);
    },
    easeInOutQuad: function (pos) {
        if ((pos /= 0.5) < 1) {
            return 0.5 * Math.pow(pos, 2);
        }
        return -0.5 * ((pos -= 2) * pos - 2);
    },
    easeInCubic: function (pos) {
        return Math.pow(pos, 3);
    },
    easeOutCubic: function (pos) {
        return (Math.pow((pos - 1), 3) + 1);
    },
    easeInOutCubic: function (pos) {
        if ((pos /= 0.5) < 1) {
            return 0.5 * Math.pow(pos, 3);
        }
        return 0.5 * (Math.pow((pos - 2), 3) + 2);
    },
    easeInQuart: function (pos) {
        return Math.pow(pos, 4);
    },
    easeOutQuart: function (pos) {
        return -(Math.pow((pos - 1), 4) - 1);
    },
    easeInOutQuart: function (pos) {
        if ((pos /= 0.5) < 1)
            return 0.5 * Math.pow(pos, 4);
        return -0.5 * ((pos -= 2) * Math.pow(pos, 3) - 2);
    },
    easeInQuint: function (pos) {
        return Math.pow(pos, 5);
    },
    easeOutQuint: function (pos) {
        return (Math.pow((pos - 1), 5) + 1);
    },
    easeInOutQuint: function (pos) {
        if ((pos /= 0.5) < 1) {
            return 0.5 * Math.pow(pos, 5);
        }
        return 0.5 * (Math.pow((pos - 2), 5) + 2);
    },
    easeInSine: function (pos) {
        return -Math.cos(pos * (Math.PI / 2)) + 1;
    },
    easeOutSine: function (pos) {
        return Math.sin(pos * (Math.PI / 2));
    },
    easeInOutSine: function (pos) {
        return (-.5 * (Math.cos(Math.PI * pos) - 1));
    },
    easeInExpo: function (pos) {
        return (pos == 0) ? 0 : Math.pow(2, 10 * (pos - 1));
    },
    easeOutExpo: function (pos) {
        return (pos == 1) ? 1 : -Math.pow(2, -10 * pos) + 1;
    },
    easeInOutExpo: function (pos) {
        if (pos == 0)
            return 0;
        if (pos == 1)
            return 1;
        if ((pos /= 0.5) < 1)
            return 0.5 * Math.pow(2, 10 * (pos - 1));
        return 0.5 * (-Math.pow(2, -10 * --pos) + 2);
    },
    easeInCirc: function (pos) {
        return -(Math.sqrt(1 - (pos * pos)) - 1);
    },
    easeOutCirc: function (pos) {
        return Math.sqrt(1 - Math.pow((pos - 1), 2));
    },
    easeInOutCirc: function (pos) {
        if ((pos /= 0.5) < 1)
            return -0.5 * (Math.sqrt(1 - pos * pos) - 1);
        return 0.5 * (Math.sqrt(1 - (pos -= 2) * pos) + 1);
    },
    easeOutBounce: function (pos) {
        if ((pos) < (1 / 2.75)) {
            return (7.5625 * pos * pos);
        }
        else if (pos < (2 / 2.75)) {
            return (7.5625 * (pos -= (1.5 / 2.75)) * pos + .75);
        }
        else if (pos < (2.5 / 2.75)) {
            return (7.5625 * (pos -= (2.25 / 2.75)) * pos + .9375);
        }
        else {
            return (7.5625 * (pos -= (2.625 / 2.75)) * pos + .984375);
        }
    },
    easeInBack: function (pos) {
        var s = 1.70158;
        return (pos) * pos * ((s + 1) * pos - s);
    },
    easeOutBack: function (pos) {
        var s = 1.70158;
        return (pos = pos - 1) * pos * ((s + 1) * pos + s) + 1;
    },
    easeInOutBack: function (pos) {
        var s = 1.70158;
        if ((pos /= 0.5) < 1)
            return 0.5 * (pos * pos * (((s *= (1.525)) + 1) * pos - s));
        return 0.5 * ((pos -= 2) * pos * (((s *= (1.525)) + 1) * pos + s) + 2);
    },
    elastic: function (pos) {
        return -1 * Math.pow(4, -8 * pos) * Math.sin((pos * 6 - 1) * (2 * Math.PI) / 2) + 1;
    },
    swingFromTo: function (pos) {
        var s = 1.70158;
        return ((pos /= 0.5) < 1) ? 0.5 * (pos * pos * (((s *= (1.525)) + 1) * pos - s)) :
            0.5 * ((pos -= 2) * pos * (((s *= (1.525)) + 1) * pos + s) + 2);
    },
    swingFrom: function (pos) {
        var s = 1.70158;
        return pos * pos * ((s + 1) * pos - s);
    },
    swingTo: function (pos) {
        var s = 1.70158;
        return (pos -= 1) * pos * ((s + 1) * pos + s) + 1;
    },
    bounce: function (pos) {
        if (pos < (1 / 2.75)) {
            return (7.5625 * pos * pos);
        }
        else if (pos < (2 / 2.75)) {
            return (7.5625 * (pos -= (1.5 / 2.75)) * pos + .75);
        }
        else if (pos < (2.5 / 2.75)) {
            return (7.5625 * (pos -= (2.25 / 2.75)) * pos + .9375);
        }
        else {
            return (7.5625 * (pos -= (2.625 / 2.75)) * pos + .984375);
        }
    },
    bouncePast: function (pos) {
        if (pos < (1 / 2.75)) {
            return (7.5625 * pos * pos);
        }
        else if (pos < (2 / 2.75)) {
            return 2 - (7.5625 * (pos -= (1.5 / 2.75)) * pos + .75);
        }
        else if (pos < (2.5 / 2.75)) {
            return 2 - (7.5625 * (pos -= (2.25 / 2.75)) * pos + .9375);
        }
        else {
            return 2 - (7.5625 * (pos -= (2.625 / 2.75)) * pos + .984375);
        }
    },
    easeFromTo: function (pos) {
        if ((pos /= 0.5) < 1)
            return 0.5 * Math.pow(pos, 4);
        return -0.5 * ((pos -= 2) * Math.pow(pos, 3) - 2);
    },
    easeFrom: function (pos) {
        return Math.pow(pos, 4);
    },
    easeTo: function (pos) {
        return Math.pow(pos, 0.25);
    },
    linear: function (pos) {
        return pos;
    },
    sinusoidal: function (pos) {
        return (-Math.cos(pos * Math.PI) / 2) + 0.5;
    },
    reverse: function (pos) {
        return 1 - pos;
    },
    mirror: function (pos, transition) {
        transition = transition || this.sinusoidal;
        if (pos < 0.5)
            return transition(pos * 2);
        else
            return transition(1 - (pos - 0.5) * 2);
    },
    flicker: function (pos) {
        var pos = pos + (Math.random() - 0.5) / 5;
        return this.sinusoidal(pos < 0 ? 0 : pos > 1 ? 1 : pos);
    },
    wobble: function (pos) {
        return (-Math.cos(pos * Math.PI * (9 * pos)) / 2) + 0.5;
    },
    pulse: function (pos, pulses) {
        return (-Math.cos((pos * ((pulses || 5) - .5) * 2) * Math.PI) / 2) + .5;
    },
    blink: function (pos, blinks) {
        return Math.round(pos * (blinks || 5)) % 2;
    },
    spring: function (pos) {
        return 1 - (Math.cos(pos * 4.5 * Math.PI) * Math.exp(-pos * 6));
    },
    none: function (pos) {
        return 0;
    },
    full: function (pos) {
        return 1;
    }
};

var cache = {};
var loaded = {};
var loading = {};
/**
 * Sprite texture
 */
var Texture = (function () {
    /**
     * @param  source  Drawable source
     * @param  rect    Clipping rect
     */
    function Texture(source, sourceRect, textureRect) {
        this._readyCallbacks = [];
        this._gridSourceCache = {};
        this._gridSourceCount = 0;
        /**
         * Texture resource loading state
         */
        this.ready = false;
        this.width = 0;
        this.height = 0;
        var name = getCacheKey(source, sourceRect, textureRect);
        if (cache[name]) {
            return cache[name];
        }
        if (typeof source === 'string') {
            this._createByPath(source, sourceRect, textureRect);
        }
        else if ((source instanceof HTMLImageElement) || (source instanceof HTMLCanvasElement)) {
            this._createByImage(source, sourceRect, textureRect);
        }
        else {
            throw new Error("Invalid texture source");
        }
        if (name) {
            cache[name] = this;
        }
    }
    /**
     * Create a texture by source and clipping rectangle
     * @param  source  Drawable source
     * @param  rect    Clipping rect
     */
    Texture.create = function (source, sourceRect, textureRect) {
        var name = getCacheKey(source, sourceRect, textureRect);
        if (name && cache[name]) {
            return cache[name];
        }
        return new Texture(source, sourceRect, textureRect);
    };
    Texture.getByName = function (name) {
        return cache[name];
    };
    /**
     * 缓存Texture实例
     */
    Texture.cacheAs = function (name, texture) {
        cache[name] = texture;
    };
    /**
     * 清除缓存
     */
    Texture.clearCache = function (name) {
        if (name != null) {
            var texture = cache[name];
            if (texture) {
                texture.clearCacheGridSources();
            }
            delete cache[name];
        }
        else {
            cache = {};
        }
    };
    Texture.prototype.onReady = function (callback) {
        if (this.ready) {
            callback({ width: this.width, height: this.height });
        }
        else {
            this._readyCallbacks.push(callback);
        }
    };
    Texture.prototype.createGridSource = function (w, h, sx, sy, sw, sh, grid) {
        var _this = this;
        var cacheKey = getGridCacheKey(w, h, sx, sy, sw, sh, grid);
        if (this._gridSourceCache[cacheKey]) {
            return this._gridSourceCache[cacheKey];
        }
        var top = grid[0], right = grid[1], bottom = grid[2], left = grid[3];
        var grids = [
            { x: 0, y: 0, w: left, h: top, sx: sx, sy: sy, sw: left, sh: top },
            { x: w - right, y: 0, w: right, h: top, sx: sx + sw - right, sy: sy, sw: right, sh: top },
            { x: 0, y: h - bottom, w: left, h: bottom, sx: sx, sy: sy + sh - bottom, sw: left, sh: bottom },
            { x: w - right, y: h - bottom, w: right, h: bottom, sx: sx + sw - right, sy: sh - bottom + sy, sw: right, sh: bottom },
            { x: left, y: 0, w: w - left - right, h: top, sx: sx + left, sy: sy, sw: sw - left - right, sh: top },
            { x: left, y: h - bottom, w: w - left - right, h: bottom, sx: sx + left, sy: sh - bottom + sy, sw: sw - left - right, sh: bottom },
            { x: 0, y: top, w: left, h: h - top - bottom, sx: sx, sy: top, sw: left, sh: sh - top - bottom },
            { x: w - right, y: top, w: right, h: h - top - bottom, sx: sx + sw - right, sy: top, sw: right, sh: sh - top - bottom },
            { x: left, y: top, w: w - left - right, h: h - top - bottom, sx: sx + left, sy: top, sw: sw - left - right, sh: sh - top - bottom },
        ];
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        canvas.width = w;
        canvas.height = h;
        grids.forEach(function (g) {
            if (g.w && g.h) {
                context.drawImage(_this.source, g.sx, g.sy, g.sw, g.sh, Math.ceil(g.x), Math.ceil(g.y), Math.ceil(g.w), Math.ceil(g.h));
            }
        });
        this._gridSourceCache[cacheKey] = canvas;
        this._gridSourceCount += 1;
        return canvas;
    };
    Texture.prototype.clearCacheGridSources = function () {
        this._gridSourceCache = {};
        this._gridSourceCount = 0;
    };
    Texture.prototype._createByPath = function (path, sourceRect, textureRect) {
        var _this = this;
        var img = new Image();
        img.onload = function () {
            _this._createByImage(img, sourceRect, textureRect);
            // if (!loaded[path]) {
            //     console.log(`canvas2d: "${path}" loaded.`);
            // }
            loaded[path] = true;
            if (_this._readyCallbacks.length) {
                var size_1 = { width: _this.width, height: _this.height };
                _this._readyCallbacks.forEach(function (callback) {
                    callback(size_1);
                });
                _this._readyCallbacks.length = 0;
            }
            img = null;
        };
        img.onerror = function () {
            img = null;
            console.warn("canvas2d: Texture creating fail, error loading source \"" + path + "\".");
        };
        // if (!loading[path]) {
        //     console.log(`canvas2d: Start to load: "${path}".`);
        // }
        img.src = path;
        loading[path] = true;
    };
    Texture.prototype._createByImage = function (image, sourceRect, textureRect) {
        if (!sourceRect) {
            sourceRect = {
                x: 0,
                y: 0,
                width: image.width,
                height: image.height
            };
        }
        if (!textureRect) {
            textureRect = {
                x: 0,
                y: 0,
                width: sourceRect.width,
                height: sourceRect.height,
            };
        }
        var source = createCanvas(image, sourceRect, textureRect);
        this.width = source.width;
        this.height = source.height;
        this.source = source;
        this.ready = true;
    };
    return Texture;
}());
function getGridCacheKey() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return args.join(':');
}
function getCacheKey(source, sourceRect, textureRect) {
    var isStr = typeof source === 'string';
    if (!isStr && !source.src) {
        return null;
    }
    var src = isStr ? source : source.src;
    var sourceRectStr = sourceRect ? [sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height].join(',') : '';
    var textureRectStr = textureRect ? [textureRect.x, textureRect.y, textureRect.width, textureRect.height].join(',') : '';
    return src + sourceRectStr + textureRectStr;
}
function createCanvas(image, sourceRect, textureRect) {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext('2d');
    canvas.width = textureRect.width;
    canvas.height = textureRect.height;
    context.drawImage(image, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, textureRect.x, textureRect.y, sourceRect.width, sourceRect.height);
    return canvas;
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
}

var BaseAction = (function () {
    function BaseAction() {
        this.immediate = false;
        this.done = false;
    }
    return BaseAction;
}());

var Delay = (function (_super) {
    __extends(Delay, _super);
    function Delay(duration) {
        var _this = _super.call(this) || this;
        _this.elapsed = 0;
        _this.duration = duration;
        return _this;
    }
    Delay.prototype.step = function (deltaTime) {
        this.elapsed += deltaTime;
        if (this.elapsed >= this.duration) {
            this.done = true;
        }
    };
    Delay.prototype.end = function () {
    };
    Delay.prototype.reset = function () {
        this.elapsed = 0;
        this.done = false;
    };
    Delay.prototype.reverse = function () {
        this.done = false;
        this.elapsed = 0;
    };
    Delay.prototype.destroy = function () {
    };
    return Delay;
}(BaseAction));

var Callback = (function (_super) {
    __extends(Callback, _super);
    function Callback(func) {
        var _this = _super.call(this) || this;
        _this.immediate = true;
        _this.func = func;
        return _this;
    }
    Callback.prototype.step = function () {
        this.func.call(null);
        this.end();
    };
    Callback.prototype.end = function () {
        this.func = null;
        this.done = true;
    };
    Callback.prototype.reset = function () {
        this.done = false;
    };
    Callback.prototype.reverse = function () {
        this.done = false;
    };
    Callback.prototype.destroy = function () {
        this.func = null;
    };
    return Callback;
}(BaseAction));

var Animation = (function (_super) {
    __extends(Animation, _super);
    function Animation(frameList, frameRate, repetitions) {
        var _this = _super.call(this) || this;
        _this.elapsed = 0;
        _this.count = 0;
        _this.frameIndex = 0;
        _this.frameList = frameList;
        _this.repetitions = repetitions;
        _this.interval = 1 / frameRate;
        return _this;
    }
    Animation.prototype.step = function (deltaTime, target) {
        this.elapsed += deltaTime;
        if (this.elapsed >= this.interval) {
            target.texture = this.frameList[this.frameIndex++];
            if (this.frameIndex === this.frameList.length) {
                if (this.repetitions == null || ++this.count < this.repetitions) {
                    this.frameIndex = 0;
                }
                else {
                    this.end();
                }
            }
            this.elapsed = 0;
        }
    };
    Animation.prototype.end = function () {
        this.done = true;
    };
    Animation.prototype.reset = function () {
        this.done = false;
        this.frameIndex = 0;
        this.elapsed = 0;
        this.count = 0;
    };
    Animation.prototype.reverse = function () {
        this.done = false;
        this.frameIndex = 0;
        this.elapsed = 0;
        this.count = 0;
        this.frameList = this.frameList.slice().reverse();
    };
    Animation.prototype.destroy = function () {
        this.frameList = null;
    };
    return Animation;
}(BaseAction));

var Key = 'canvas2d.uid';
var counter = 0;
var cachedColor = {};
function uid(target) {
    if (typeof target[Key] === 'undefined') {
        Object.defineProperty(target, Key, { value: counter++ });
    }
    return target[Key];
}
function addArrayItem(array, item) {
    if (array.indexOf(item) === -1) {
        array.push(item);
    }
}
function removeArrayItem(array, item) {
    var index = array.indexOf(item);
    if (index > -1) {
        array.splice(index, 1);
    }
}
function convertColor(color) {
    if (typeof color === 'string') {
        return color;
    }
    if (cachedColor[color]) {
        return cachedColor[color];
    }
    if (typeof color === 'number') {
        var result = color.toString(16);
        if (result.length < 3) {
            while (result.length < 3) {
                result = '0' + result;
            }
        }
        else if (result.length > 3 && result.length < 6) {
            while (result.length < 6) {
                result = '0' + result;
            }
        }
        if (result.length !== 3 && result.length !== 6) {
            throw new Error("canvas2d: Invalid hex color \"0x" + result + "\".");
        }
        result = cachedColor[color] = '#' + result;
        return result;
    }
}

var ActionListener = (function () {
    function ActionListener(actions) {
        this._resolved = false;
        this._callbacks = {};
        this._actions = actions;
    }
    ActionListener.prototype.all = function (callback) {
        if (this._resolved) {
            callback();
        }
        else {
            if (!this._callbacks.all) {
                this._callbacks.all = [];
            }
            addArrayItem(this._callbacks.all, callback);
        }
        return this;
    };
    ActionListener.prototype.any = function (callback) {
        if (this._resolved) {
            callback();
        }
        else {
            if (!this._callbacks.any) {
                this._callbacks.any = [];
            }
            addArrayItem(this._callbacks.any, callback);
        }
        return this;
    };
    ActionListener.prototype._step = function () {
        var allDone = true;
        var anyDone = false;
        this._actions.forEach(function (action) {
            if (action.isDone()) {
                anyDone = true;
            }
            else {
                allDone = false;
            }
        });
        if (anyDone && this._callbacks.any) {
            this._callbacks.any.forEach(function (callback) { return callback(); });
            this._callbacks.any = null;
        }
        if (allDone && this._callbacks.all) {
            this._callbacks.all.forEach(function (callback) { return callback(); });
            Action.removeListener(this);
            this._resolved = true;
        }
    };
    return ActionListener;
}());

var Transition = (function (_super) {
    __extends(Transition, _super);
    function Transition(options, duration, isTransitionBy) {
        var _this = _super.call(this) || this;
        _this.elapsed = 0;
        _this.options = [];
        _this.deltaValue = {};
        _this.duration = duration;
        _this.isTransitionBy = isTransitionBy;
        if (isTransitionBy) {
            _this._initAsTransitionBy(options);
        }
        else {
            _this._initAsTransitionTo(options);
        }
        return _this;
    }
    Transition.setDefaultEasingFunc = function (func) {
        this.defaultEasingFunc = func;
    };
    Transition.prototype._initAsTransitionTo = function (options) {
        var _this = this;
        Object.keys(options).forEach(function (name) {
            var info = options[name];
            var easing;
            var dest;
            if (typeof info === 'number') {
                dest = info;
            }
            else {
                easing = info.easing;
                dest = info.dest;
            }
            _this.options.push({ name: name, dest: dest, easing: easing });
        });
    };
    Transition.prototype._initAsTransitionBy = function (options) {
        var _this = this;
        var deltaValue = this.deltaValue;
        Object.keys(options).forEach(function (name) {
            var info = options[name];
            var easing;
            var dest;
            if (typeof info === 'number') {
                deltaValue[name] = info;
            }
            else {
                easing = info.easing;
                deltaValue[name] = info.value;
            }
            _this.options.push({ name: name, dest: dest, easing: easing });
        });
    };
    Transition.prototype._initBeginValue = function (target) {
        var beginValue = this.beginValue = {};
        var deltaValue = this.deltaValue;
        if (this.isTransitionBy) {
            this.options.forEach(function (option) {
                beginValue[option.name] = target[option.name];
                option.dest = target[option.name] + deltaValue[option.name];
            });
        }
        else {
            this.options.forEach(function (option) {
                beginValue[option.name] = target[option.name];
                deltaValue[option.name] = option.dest - target[option.name];
            });
        }
    };
    Transition.prototype.step = function (deltaTime, target) {
        this.elapsed += deltaTime;
        if (this.beginValue == null) {
            this._initBeginValue(target);
        }
        if (this.elapsed >= this.duration) {
            return this.end(target);
        }
        var percent = this.elapsed / this.duration;
        var beginValue = this.beginValue;
        var deltaValue = this.deltaValue;
        this.options.forEach(function (_a) {
            var name = _a.name, dest = _a.dest, easing = _a.easing;
            easing = easing || Transition.defaultEasingFunc;
            target[name] = beginValue[name] + (easing(percent) * deltaValue[name]);
        });
    };
    Transition.prototype.end = function (target) {
        this.options.forEach(function (attr) {
            target[attr.name] = attr.dest;
        });
        this.done = true;
    };
    Transition.prototype.destroy = function () {
        this.beginValue = null;
        this.deltaValue = null;
        this.options = null;
    };
    Transition.prototype.reset = function () {
        this.done = false;
        this.elapsed = 0;
    };
    Transition.prototype.reverse = function () {
        this.done = false;
        this.elapsed = 0;
        var _a = this, options = _a.options, beginValue = _a.beginValue, deltaValue = _a.deltaValue;
        options.forEach(function (e) {
            var dest = beginValue[e.name];
            beginValue[e.name] = e.dest;
            deltaValue[e.name] = -deltaValue[e.name];
            e.dest = dest;
        });
    };
    return Transition;
}(BaseAction));
Transition.defaultEasingFunc = Tween.easeInOutQuad;

(function (ActionType) {
    ActionType[ActionType["TO"] = 0] = "TO";
    ActionType[ActionType["BY"] = 1] = "BY";
    ActionType[ActionType["ANIM"] = 2] = "ANIM";
    ActionType[ActionType["WAIT"] = 3] = "WAIT";
    ActionType[ActionType["CALLBACK"] = 4] = "CALLBACK";
})(exports.ActionType || (exports.ActionType = {}));

(function (ActionRepeatMode) {
    ActionRepeatMode[ActionRepeatMode["NONE"] = 0] = "NONE";
    ActionRepeatMode[ActionRepeatMode["REPEAT"] = 1] = "REPEAT";
    ActionRepeatMode[ActionRepeatMode["REVERSE_REPEAT"] = 2] = "REVERSE_REPEAT";
})(exports.ActionRepeatMode || (exports.ActionRepeatMode = {}));
var Action = (function () {
    function Action(target) {
        this._queue = [];
        this._currentIndex = 0;
        this._done = false;
        this._repeatMode = exports.ActionRepeatMode.NONE;
        /**
         * Action running state
         */
        this.isRunning = false;
        this.target = target;
    }
    /**
     * Stop action by target
     */
    Action.stop = function (target) {
        Action._actionList.slice().forEach(function (action) {
            if (action.target === target) {
                action.stop();
            }
        });
    };
    /**
     * Listen a action list, when all actions are done then publish to listener
     */
    Action.listen = function (actions) {
        var listener = new ActionListener(actions);
        Action._listenerList.push(listener);
        return listener;
    };
    Action.removeListener = function (listener) {
        removeArrayItem(this._listenerList, this);
    };
    Action.schedule = function (deltaTime) {
        Action._actionList.slice().forEach(function (action) {
            action._step(deltaTime);
            if (action._done) {
                removeArrayItem(Action._actionList, action);
            }
        });
        Action._listenerList.slice().forEach(function (listener) {
            listener._step();
        });
    };
    Action.prototype.isDone = function () {
        return this._done;
    };
    Action.prototype.setRepeatMode = function (mode) {
        this._repeatMode = mode;
        return this;
    };
    Object.defineProperty(Action.prototype, "repeatMode", {
        get: function () {
            return this._repeatMode;
        },
        set: function (mode) {
            this._repeatMode = mode;
        },
        enumerable: true,
        configurable: true
    });
    Action.prototype.queue = function (actions) {
        var _this = this;
        actions.forEach(function (action) {
            switch (action.type) {
                case exports.ActionType.ANIM:
                    _this.animate(action.frameList, action.frameRate, action.repetitions);
                    break;
                case exports.ActionType.BY:
                    _this.by(action.options, action.duration);
                    break;
                case exports.ActionType.TO:
                    _this.to(action.options, action.duration);
                    break;
                case exports.ActionType.WAIT:
                    _this.wait(action.duration);
                    break;
                case exports.ActionType.CALLBACK:
                    _this.then(action.callback);
                    break;
            }
        });
        return this;
    };
    /**
     * Add a callback, it will exec after previous action is done.
     */
    Action.prototype.then = function (callback) {
        this._queue.push(new Callback(callback));
        return this;
    };
    /**
     * Add a delay action.
     */
    Action.prototype.wait = function (time) {
        this._queue.push(new Delay(time));
        return this;
    };
    /**
     * Add a animation action
     */
    Action.prototype.animate = function (frameList, frameRate, repetitions) {
        var anim = new Animation(frameList, frameRate, repetitions);
        this._queue.push(anim);
        anim.step(anim.interval, this.target);
        return this;
    };
    /**
     * TransitionTo action
     */
    Action.prototype.to = function (attrs, duration) {
        this._queue.push(new Transition(attrs, duration));
        return this;
    };
    /**
     * TransitionBy action
     */
    Action.prototype.by = function (attrs, duration) {
        this._queue.push(new Transition(attrs, duration, true));
        return this;
    };
    /**
     * Start the action
     */
    Action.prototype.start = function () {
        if (!this.isRunning) {
            addArrayItem(Action._actionList, this);
            this.isRunning = true;
        }
        return this;
    };
    /**
     * Stop the action
     */
    Action.prototype.stop = function () {
        this._queue.forEach(function (action) { return action.destroy(); });
        this._done = true;
        this.isRunning = false;
        this._queue.length = 0;
        removeArrayItem(Action._actionList, this);
    };
    Action.prototype.clear = function () {
        this._queue.forEach(function (action) { return action.destroy(); });
        this._done = false;
        this.isRunning = false;
        this._queue.length = 0;
        this._currentIndex = 0;
        this._repeatMode = exports.ActionRepeatMode.NONE;
        removeArrayItem(Action._actionList, this);
    };
    Action.prototype._step = function (deltaTime) {
        if (!this._queue.length || this._currentIndex >= this._queue.length) {
            return;
        }
        var action = this._queue[this._currentIndex];
        action.step(deltaTime, this.target);
        if (action.done) {
            this._currentIndex += 1;
            if (this._currentIndex >= this._queue.length) {
                this._onAllActionDone();
            }
            else if (action.immediate) {
                this._step(deltaTime);
            }
        }
    };
    Action.prototype._onAllActionDone = function () {
        switch (this._repeatMode) {
            case exports.ActionRepeatMode.REPEAT:
                this._queue.forEach(function (a) { return a.reset(); });
                this._currentIndex = 0;
                break;
            case exports.ActionRepeatMode.REVERSE_REPEAT:
                this._queue.forEach(function (a) { return a.reverse(); });
                this._currentIndex = 0;
                break;
            default:
                this._done = true;
                this.isRunning = false;
                this.target = null;
                this._queue.forEach(function (a) { return a.destroy(); });
                this._queue.length = 0;
                break;
        }
    };
    return Action;
}());
Action._actionList = [];
Action._listenerList = [];

var EventEmitter = (function () {
    function EventEmitter() {
    }
    EventEmitter.prototype.addListener = function (type, listener) {
        var id = uid(this);
        if (!EventEmitter._eventCache[id]) {
            EventEmitter._eventCache[id] = {};
        }
        if (!EventEmitter._eventCache[id][type]) {
            EventEmitter._eventCache[id][type] = [];
        }
        var events = EventEmitter._eventCache[id][type];
        if (events.some(function (ev) { return ev.listener === listener && !ev.once; })) {
            return this;
        }
        events.push({ listener: listener });
        return this;
    };
    EventEmitter.prototype.on = function (type, listener) {
        return this.addListener(type, listener);
    };
    EventEmitter.prototype.once = function (type, listener) {
        var id = uid(this);
        if (!EventEmitter._eventCache[id]) {
            EventEmitter._eventCache[id] = {};
        }
        if (!EventEmitter._eventCache[id][type]) {
            EventEmitter._eventCache[id][type] = [];
        }
        var events = EventEmitter._eventCache[id][type];
        if (events.some(function (ev) { return ev.listener === listener && ev.once; })) {
            return this;
        }
        events.push({ listener: listener, once: true });
        return this;
    };
    EventEmitter.prototype.removeListener = function (type, listener) {
        var cache = EventEmitter._eventCache[uid(this)];
        if (cache && cache[type]) {
            var events_1 = cache[type];
            events_1.slice().forEach(function (ev, index) {
                if (ev.listener === listener) {
                    removeArrayItem(events_1, ev);
                }
            });
            if (!events_1.length) {
                delete cache[type];
            }
        }
        return this;
    };
    EventEmitter.prototype.removeAllListeners = function (type) {
        var id = uid(this);
        var cache = EventEmitter._eventCache[id];
        if (cache) {
            if (type == null) {
                EventEmitter[id] = null;
            }
            else {
                delete cache[type];
            }
        }
        return this;
    };
    EventEmitter.prototype.emit = function (type) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var id = uid(this);
        var cache = EventEmitter._eventCache[id];
        if (cache && cache[type]) {
            var events_2 = cache[type];
            events_2.slice().forEach(function (ev) {
                ev.listener.apply(_this, args);
                if (ev.once) {
                    removeArrayItem(events_2, ev);
                }
            });
        }
        return this;
    };
    return EventEmitter;
}());
EventEmitter._eventCache = {};

var instance;
var ReleasePool = (function () {
    function ReleasePool() {
        this._objs = [];
    }
    ReleasePool.prototype.add = function (obj) {
        var _this = this;
        this._objs.push(obj);
        if (this._timerId != null) {
            return;
        }
        this._timerId = setTimeout(function () { return _this._release(); }, 0);
    };
    ReleasePool.prototype._release = function () {
        this._objs.forEach(function (obj) {
            Object.keys(obj).forEach(function (key) { return delete obj[key]; });
        });
        this._timerId = null;
        this._objs.length = 0;
    };
    Object.defineProperty(ReleasePool, "instance", {
        get: function () {
            if (!instance) {
                instance = new ReleasePool();
            }
            return instance;
        },
        enumerable: true,
        configurable: true
    });
    return ReleasePool;
}());

var RAD_PER_DEG = Math.PI / 180;

(function (AlignType) {
    AlignType[AlignType["TOP"] = 0] = "TOP";
    AlignType[AlignType["RIGHT"] = 1] = "RIGHT";
    AlignType[AlignType["BOTTOM"] = 2] = "BOTTOM";
    AlignType[AlignType["LEFT"] = 3] = "LEFT";
    AlignType[AlignType["CENTER"] = 4] = "CENTER";
})(exports.AlignType || (exports.AlignType = {}));
var Sprite = (function (_super) {
    __extends(Sprite, _super);
    function Sprite(props) {
        var _this = _super.call(this) || this;
        _this._width = 0;
        _this._height = 0;
        _this._originX = 0.5;
        _this._originY = 0.5;
        _this._rotation = 0;
        _this._rotationRad = 0;
        _this._originPixelX = 0;
        _this._originPixelY = 0;
        _this.x = 0;
        _this.y = 0;
        _this.scaleX = 1;
        _this.scaleY = 1;
        _this.radius = 0;
        _this.opacity = 1;
        _this.sourceX = 0;
        _this.sourceY = 0;
        _this.lighterMode = false;
        _this.autoResize = true;
        _this.flippedX = false;
        _this.flippedY = false;
        _this.visible = true;
        _this.clipOverflow = false;
        _this.touchEnabled = true;
        _this.mouseEnabled = true;
        _this.id = uid(_this);
        _this._init(props);
        return _this;
    }
    Sprite.prototype._init = function (props) {
        if (props) {
            this.setProps(props);
        }
    };
    Sprite.prototype.setProps = function (props) {
        var _this = this;
        Object.keys(props).forEach(function (key) {
            _this[key] = props[key];
        });
    };
    Object.defineProperty(Sprite.prototype, "width", {
        get: function () {
            return this._width;
        },
        set: function (value) {
            if (this._width === value) {
                return;
            }
            this._width = value;
            this._originPixelX = this._width * this._originX;
            if (this.left != null || this.right != null) {
                this._reCalcX();
            }
            else {
                this._adjustAlignX();
            }
            this._reLayoutChildrenOnWidthChanged();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "height", {
        get: function () {
            return this._height;
        },
        set: function (value) {
            if (this._height === value) {
                return;
            }
            this._height = value;
            this._originPixelY = this._height * this._originY;
            if (this.top != null || this.bottom != null) {
                this._reCalcY();
            }
            else {
                this._adjustAlignY();
            }
            this._reLayoutChildrenOnHeightChanged();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "originX", {
        get: function () {
            return this._originX;
        },
        set: function (value) {
            if (this._originX === value) {
                return;
            }
            this._originX = value;
            this._originPixelX = this._originX * this._width;
            if (this.left != null || this.right != null) {
                this._reCalcX();
            }
            else {
                this._adjustAlignX();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "originY", {
        get: function () {
            return this._originY;
        },
        set: function (value) {
            if (this._originY === value) {
                return;
            }
            this._originY = value;
            this._originPixelY = this._originY * this._height;
            if (this.top != null || this.bottom != null) {
                this._reCalcY();
            }
            else {
                this._adjustAlignY();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "top", {
        get: function () {
            return this._top;
        },
        set: function (top) {
            this.autoResize = false;
            this._top = top;
            this._resizeHeight();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "right", {
        get: function () {
            return this._right;
        },
        set: function (right) {
            this.autoResize = false;
            this._right = right;
            this._resizeWidth();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "bottom", {
        get: function () {
            return this._bottom;
        },
        set: function (bottom) {
            this.autoResize = false;
            this._bottom = bottom;
            this._resizeHeight();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "left", {
        get: function () {
            return this._left;
        },
        set: function (left) {
            this.autoResize = false;
            this._left = left;
            this._resizeWidth();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "percentWidth", {
        get: function () {
            return this._percentWidth;
        },
        set: function (percentWidth) {
            this.autoResize = false;
            this._percentWidth = percentWidth;
            this._resizeWidth();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "percentHeight", {
        get: function () {
            return this._percentHeight;
        },
        set: function (percentHeight) {
            this.autoResize = false;
            this._percentHeight = percentHeight;
            this._resizeHeight();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "grid", {
        get: function () {
            return this._grid;
        },
        set: function (grid) {
            this._grid = grid;
            this.autoResize = false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "rotation", {
        get: function () {
            return this._rotation;
        },
        set: function (value) {
            if (this._rotation === value) {
                return;
            }
            this._rotation = value;
            this._rotationRad = this._rotation * RAD_PER_DEG;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "texture", {
        get: function () {
            return this._texture;
        },
        set: function (value) {
            var _this = this;
            var texture;
            if (typeof value === 'string') {
                texture = Texture.create(value);
            }
            else {
                texture = value;
            }
            if (texture === this._texture) {
                return;
            }
            this._texture = texture;
            if (!this.autoResize) {
                return;
            }
            if (texture) {
                if (texture.ready) {
                    this.width = texture.width;
                    this.height = texture.height;
                }
                else {
                    texture.onReady(function (size) {
                        _this.width = size.width;
                        _this.height = size.height;
                    });
                }
            }
            else {
                this.width = 0;
                this.height = 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        set: function (sprite) {
            if (sprite === this._parent) {
                return;
            }
            this._parent = sprite;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "stage", {
        get: function () {
            return this._stage;
        },
        set: function (stage) {
            if (stage == null) {
                this.emit(UIEvent.REMOVED_FROM_STAGE);
                this._stage = stage;
            }
            else {
                this._stage = stage;
                this.emit(UIEvent.ADD_TO_STAGE);
            }
            this.children && this.children.forEach(function (child) { return child.stage = stage; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "alignX", {
        get: function () {
            return this._alignX;
        },
        set: function (value) {
            if (this._alignX === value || value === exports.AlignType.BOTTOM || value === exports.AlignType.TOP) {
                return;
            }
            this._alignX = value;
            this._adjustAlignX();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "alignY", {
        get: function () {
            return this._alignY;
        },
        set: function (value) {
            if (this._alignY === value || value === exports.AlignType.LEFT || value === exports.AlignType.RIGHT) {
                return;
            }
            this._alignY = value;
            this._adjustAlignY();
        },
        enumerable: true,
        configurable: true
    });
    Sprite.prototype._update = function (deltaTime) {
        this.emit(UIEvent.FRAME, deltaTime);
        this.update(deltaTime);
        if (this.children && this.children.length) {
            this.children.slice().forEach(function (child) {
                child._update(deltaTime);
            });
        }
    };
    Sprite.prototype._visit = function (context) {
        if (!this.visible || this.opacity === 0) {
            return;
        }
        var sx = this.scaleX;
        var sy = this.scaleY;
        context.save();
        if (this.lighterMode) {
            context.globalCompositeOperation = "lighter";
        }
        if (this.x !== 0 || this.y !== 0) {
            context.translate(this.x, this.y);
        }
        if (this.opacity !== 1) {
            context.globalAlpha = this.opacity;
        }
        if (this.flippedX) {
            sx = -sx;
        }
        if (this.flippedY) {
            sy = -sy;
        }
        if (sx !== 1 || sy !== 1) {
            context.scale(sx, sy);
        }
        var rotationRad = this._rotationRad % 360;
        if (rotationRad !== 0) {
            context.rotate(rotationRad);
        }
        if ((this._width !== 0 && this._height !== 0) || this.radius > 0) {
            this.draw(context);
        }
        this._visitChildren(context);
        context.restore();
    };
    Sprite.prototype._reLayoutChildrenOnWidthChanged = function () {
        if (!this.children || !this.children.length) {
            return;
        }
        this.children.forEach(function (child) {
            child._resizeWidth();
            child._adjustAlignX();
        });
    };
    Sprite.prototype._reLayoutChildrenOnHeightChanged = function () {
        if (!this.children || !this.children.length) {
            return;
        }
        this.children.forEach(function (child) {
            child._resizeHeight();
            child._adjustAlignY();
        });
    };
    Sprite.prototype._resizeWidth = function () {
        if (this.parent == null) {
            return;
        }
        var _a = this, parent = _a.parent, percentWidth = _a.percentWidth, right = _a.right, left = _a.left;
        if (left != null && right != null) {
            this.width = parent.width - left - right;
        }
        else if (percentWidth != null) {
            this.width = parent.width * percentWidth;
        }
        this._reCalcX();
    };
    Sprite.prototype._reCalcX = function () {
        var _a = this, left = _a.left, right = _a.right, parent = _a.parent, width = _a.width, _originPixelX = _a._originPixelX;
        if (left != null) {
            this.x = left + _originPixelX;
        }
        else if (right != null && parent != null) {
            this.x = parent.width - (width + right - _originPixelX);
        }
    };
    Sprite.prototype._resizeHeight = function () {
        if (this.parent == null) {
            return;
        }
        var _a = this, parent = _a.parent, percentHeight = _a.percentHeight, top = _a.top, bottom = _a.bottom;
        if (top != null && bottom != null) {
            this.height = parent.height - top - bottom;
            this.y = top + this._originPixelY;
            return;
        }
        if (percentHeight != null) {
            this.height = parent.height * percentHeight;
        }
        this._reCalcY();
    };
    Sprite.prototype._reCalcY = function () {
        var _a = this, top = _a.top, bottom = _a.bottom, parent = _a.parent, height = _a.height, _originPixelY = _a._originPixelY;
        if (top != null) {
            this.y = top + _originPixelY;
        }
        else if (bottom != null && parent != null) {
            this.y = parent.height - (height + bottom - _originPixelY);
        }
    };
    Sprite.prototype._adjustAlignX = function () {
        if (!this.parent || this._alignX == null || this.left != null || this.right != null) {
            return false;
        }
        var x;
        var ox = this._originPixelX;
        switch (this._alignX) {
            case exports.AlignType.LEFT:
                x = ox;
                break;
            case exports.AlignType.RIGHT:
                x = this.parent.width - (this.width - ox);
                break;
            case exports.AlignType.CENTER:
                x = this.parent.width * 0.5 + ox - this.width * 0.5;
                break;
        }
        if (x != null) {
            this.x = x;
        }
        return true;
    };
    Sprite.prototype._adjustAlignY = function () {
        if (!this.parent || this._alignY == null || this.top != null || this.bottom != null) {
            return false;
        }
        var y;
        var oy = this._originPixelY;
        switch (this._alignY) {
            case exports.AlignType.TOP:
                y = oy;
                break;
            case exports.AlignType.BOTTOM:
                y = this.parent.height - (this.height - oy);
                break;
            case exports.AlignType.CENTER:
                y = this.parent.height * 0.5 + oy - this.height * 0.5;
                break;
        }
        if (y != null) {
            this.y = y;
        }
        return true;
    };
    Sprite.prototype._visitChildren = function (context) {
        if (!this.children || !this.children.length) {
            return;
        }
        if (this._originPixelX !== 0 || this._originPixelY !== 0) {
            context.translate(-this._originPixelX, -this._originPixelY);
        }
        this.children.forEach(function (child) {
            child._visit(context);
        });
    };
    Sprite.prototype._clip = function (context) {
        if (!this.clipOverflow) {
            return;
        }
        context.beginPath();
        if (this.radius > 0) {
            context.arc(0, 0, this.radius, 0, Math.PI * 2, true);
        }
        else {
            context.rect(-this._originPixelX, -this._originPixelY, this._width, this._height);
        }
        context.closePath();
        context.clip();
    };
    Sprite.prototype._drawBgColor = function (context) {
        if (this.bgColor == null) {
            return;
        }
        context.fillStyle = convertColor(this.bgColor);
        context.beginPath();
        if (this.radius > 0) {
            context.arc(0, 0, this.radius, 0, Math.PI * 2, true);
        }
        else {
            context.rect(-this._originPixelX, -this._originPixelY, this._width, this._height);
        }
        context.closePath();
        context.fill();
    };
    Sprite.prototype._drawBorder = function (context) {
        if (this.borderColor != null) {
            context.lineWidth = this.borderWidth || 1;
            context.strokeStyle = convertColor(this.borderColor || 0x000);
            context.beginPath();
            if (this.radius > 0) {
                context.arc(0, 0, this.radius, 0, Math.PI * 2, true);
            }
            else {
                context.rect(-this._originPixelX, -this._originPixelY, this._width, this._height);
            }
            context.closePath();
            context.stroke();
        }
    };
    Sprite.prototype.draw = function (context) {
        this._clip(context);
        this._drawBgColor(context);
        this._drawBorder(context);
        var texture = this._texture;
        if (!texture || !texture.ready || texture.width === 0 || texture.height === 0) {
            return;
        }
        var sx = this.sourceX;
        var sy = this.sourceY;
        var sw = this.sourceWidth == null ? texture.width : this.sourceWidth;
        var sh = this.sourceHeight == null ? texture.height : this.sourceHeight;
        var w = this.width;
        var h = this.height;
        var ox = this._originPixelX;
        var oy = this._originPixelY;
        var grid = this.grid;
        if (!Array.isArray(grid)) {
            context.drawImage(texture.source, sx, sy, sw, sh, -ox, -oy, w, h);
        }
        else {
            var gridSource = this.texture.createGridSource(w, h, sx, sy, sw, sh, grid);
            context.drawImage(gridSource, -ox, -oy, w, h);
        }
    };
    Sprite.prototype.addChild = function (target, position) {
        if (target.parent) {
            throw new Error("canvas2d.Sprite.addChild(): Child has been added.");
        }
        if (!this.children) {
            this.children = [];
        }
        var children = this.children;
        if (children.indexOf(target) < 0) {
            if (position > -1 && position < children.length) {
                children.splice(position, 0, target);
            }
            else {
                children.push(target);
            }
            target.parent = this;
            if (this.stage) {
                target.stage = this.stage;
            }
            target._resizeWidth();
            target._resizeHeight();
            target._adjustAlignX();
            target._adjustAlignY();
        }
    };
    Sprite.prototype.addChildren = function () {
        var _this = this;
        var children = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            children[_i] = arguments[_i];
        }
        children.forEach(function (child) {
            _this.addChild(child);
        });
    };
    Sprite.prototype.removeChild = function (target) {
        if (!this.children || !this.children.length) {
            return;
        }
        var index = this.children.indexOf(target);
        if (index > -1) {
            this.children.splice(index, 1);
            target.parent = null;
            target.stage = null;
        }
    };
    Sprite.prototype.removeChildren = function () {
        var _this = this;
        var children = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            children[_i] = arguments[_i];
        }
        children.forEach(function (child) {
            _this.removeChild(child);
        });
    };
    Sprite.prototype.removeAllChildren = function (recusive) {
        if (!this.children || !this.children.length) {
            return;
        }
        while (this.children.length) {
            var sprite = this.children[0];
            if (recusive) {
                sprite.removeAllChildren(true);
                Action.stop(sprite);
            }
            this.removeChild(sprite);
        }
        this.children = null;
    };
    Sprite.prototype.contains = function (target) {
        if (!this.children || !this.children.length) {
            return false;
        }
        return this.children.indexOf(target) > -1 || this.children.some(function (c) { return c.contains(target); });
    };
    Sprite.prototype.release = function (recusive) {
        Action.stop(this);
        if (recusive && this.children) {
            while (this.children.length) {
                this.children[0].release(recusive);
            }
        }
        else {
            this.removeAllChildren();
        }
        if (this.parent) {
            this.parent.removeChild(this);
        }
        ReleasePool.instance.add(this);
        this.removeAllListeners();
    };
    Sprite.prototype.update = function (deltaTime) {
    };
    return Sprite;
}(EventEmitter));

var onClick = "onClick";
var onTouchBegin = "onTouchBegin";
var onTouchMoved = "onTouchMoved";
var onTouchEnded = "onTouchEnded";
var onMouseBegin = "onMouseBegin";
var onMouseMoved = "onMouseMoved";
var onMouseEnded = "onMouseEnded";
var UIEvent = (function () {
    function UIEvent(stage) {
        var _this = this;
        this._touchHelperMap = {};
        this._touchBeginHandler = function (event) {
            var stage = _this.stage;
            if (!stage.isRunning || !stage.touchEnabled) {
                return;
            }
            var helpers = _this._transformTouches(event.changedTouches);
            _this._dispatchTouch(stage.sprite, 0, 0, helpers.slice(), event, onTouchBegin, UIEvent.TOUCH_BEGIN);
            helpers.forEach(function (touch) {
                touch.beginTarget = touch.target;
            });
            stage.emit(UIEvent.TOUCH_BEGIN, helpers, event);
            event.preventDefault();
        };
        this._touchMovedHandler = function (event) {
            var stage = _this.stage;
            if (!stage.isRunning || !stage.touchEnabled) {
                return;
            }
            var helpers = _this._transformTouches(event.changedTouches);
            _this._dispatchTouch(stage.sprite, 0, 0, helpers, event, onTouchMoved, UIEvent.TOUCH_MOVED);
            stage.emit(UIEvent.TOUCH_MOVED, helpers, event);
            event.preventDefault();
        };
        this._touchEndedHandler = function (event) {
            var stage = _this.stage;
            if (stage.isRunning && stage.touchEnabled) {
                var helpers = _this._transformTouches(event.changedTouches, true);
                _this._dispatchTouch(stage.sprite, 0, 0, helpers.slice(), event, onTouchEnded, UIEvent.TOUCH_ENDED, true);
                helpers.forEach(function (helper) {
                    helper.target = null;
                    helper.beginTarget = null;
                    _this._touchHelperMap[helper.identifier] = null;
                });
                stage.emit(UIEvent.TOUCH_ENDED, helpers, event);
                helpers = null;
            }
        };
        this._mouseBeginHandler = function (event) {
            var stage = _this.stage;
            if (!stage.isRunning || !stage.mouseEnabled) {
                return;
            }
            var location = _this._transformLocation(event);
            var helper = {
                beginX: location.x,
                beginY: location.y,
                stageX: location.x,
                stageY: location.y,
                cancelBubble: false,
                stopPropagation: function () {
                    this.cancelBubble = true;
                }
            };
            _this._dispatchMouse(stage.sprite, 0, 0, helper, event, UIEvent.MOUSE_BEGIN, onMouseBegin);
            if (helper.target) {
                helper.beginTarget = helper.target;
                _this._mouseBeginHelper = helper;
            }
            stage.emit(UIEvent.MOUSE_BEGIN, helper, event);
            event.preventDefault();
        };
        this._mouseMovedHandler = function (event) {
            var stage = _this.stage;
            if (!stage.isRunning || !stage.mouseEnabled) {
                return;
            }
            var location = _this._transformLocation(event);
            var mouseBeginHelper = _this._mouseBeginHelper;
            if (mouseBeginHelper) {
                mouseBeginHelper.stageX = location.x;
                mouseBeginHelper.stageY = location.y;
                mouseBeginHelper._moved = mouseBeginHelper.beginX - location.x !== 0 || mouseBeginHelper.beginY - location.y !== 0;
                mouseBeginHelper.cancelBubble = false;
                _this._dispatchMouse(stage.sprite, 0, 0, mouseBeginHelper, event, UIEvent.MOUSE_MOVED, onMouseMoved);
                stage.emit(UIEvent.MOUSE_MOVED, mouseBeginHelper, event);
            }
            else {
                var mouseMovedHelper = _this._mouseMovedHelper = {
                    beginX: null,
                    beginY: null,
                    stageX: location.x,
                    stageY: location.y,
                    cancelBubble: false,
                    stopPropagation: function () {
                        this.cancelBubble = true;
                    }
                };
                _this._dispatchMouse(stage.sprite, 0, 0, mouseMovedHelper, event, UIEvent.MOUSE_MOVED, onMouseMoved);
                stage.emit(UIEvent.MOUSE_MOVED, mouseMovedHelper, event);
            }
            event.preventDefault();
        };
        this._mouseEndedHandler = function (event) {
            var stage = _this.stage;
            if (stage.isRunning && stage.mouseEnabled) {
                var location = _this._transformLocation(event);
                var helper = _this._mouseBeginHelper || _this._mouseMovedHelper;
                var target;
                helper.stageX = location.x;
                helper.stageY = location.y;
                target = helper.target;
                var triggerClick = !helper._moved || isMovedSmallRange(helper);
                _this._dispatchMouse(stage.sprite, 0, 0, helper, event, onMouseEnded, UIEvent.MOUSE_ENDED, triggerClick);
                stage.emit(UIEvent.MOUSE_ENDED, helper, event);
                helper.target = helper.beginTarget = null;
            }
            _this._mouseBeginHelper = _this._mouseMovedHelper = null;
        };
        this.stage = stage;
        this.element = stage.canvas;
    }
    UIEvent.prototype.register = function () {
        if (this._registered) {
            return;
        }
        var _a = this, stage = _a.stage, element = _a.element;
        if (UIEvent.supportTouch) {
            element.addEventListener(UIEvent.TOUCH_BEGIN, this._touchBeginHandler, false);
            element.addEventListener(UIEvent.TOUCH_MOVED, this._touchMovedHandler, false);
            element.addEventListener(UIEvent.TOUCH_ENDED, this._touchEndedHandler, false);
        }
        element.addEventListener(UIEvent.MOUSE_BEGIN, this._mouseBeginHandler, false);
        element.addEventListener(UIEvent.MOUSE_MOVED, this._mouseMovedHandler, false);
        element.addEventListener(UIEvent.MOUSE_ENDED, this._mouseEndedHandler, false);
        this._touchHelperMap = {};
        this._registered = true;
    };
    UIEvent.prototype.unregister = function () {
        if (!this._registered) {
            return;
        }
        var element = this.element;
        element.removeEventListener(UIEvent.TOUCH_BEGIN, this._touchBeginHandler, false);
        element.removeEventListener(UIEvent.TOUCH_MOVED, this._touchMovedHandler, false);
        element.removeEventListener(UIEvent.TOUCH_ENDED, this._touchEndedHandler, false);
        element.removeEventListener(UIEvent.MOUSE_BEGIN, this._mouseBeginHandler, false);
        element.removeEventListener(UIEvent.MOUSE_MOVED, this._mouseMovedHandler, false);
        element.removeEventListener(UIEvent.MOUSE_ENDED, this._mouseEndedHandler, false);
        this._mouseBeginHelper = this._mouseMovedHelper = null;
        this._registered = false;
    };
    UIEvent.prototype.release = function () {
        this.unregister();
        this._mouseBeginHandler = this._mouseMovedHandler = this._mouseEndedHandler = null;
        this._touchBeginHandler = this._touchMovedHandler = this._touchEndedHandler = null;
        this._touchHelperMap = null;
        this.element = this.stage = null;
    };
    UIEvent.prototype._transformLocation = function (event) {
        var clientRect = this.element.getBoundingClientRect();
        var scaleX = this.stage.scaleX;
        var scaleY = this.stage.scaleY;
        var isRotated = this.stage.isPortrait && this.stage.orientation === exports.Orientation.LANDSCAPE;
        var x;
        var y;
        if (isRotated) {
            x = (event.clientY - clientRect.top) / scaleX;
            y = this.stage.height - (event.clientX - clientRect.left) / scaleY;
        }
        else {
            x = (event.clientX - clientRect.left) / scaleX;
            y = (event.clientY - clientRect.top) / scaleY;
        }
        return { x: x, y: y };
    };
    UIEvent.prototype._transformTouches = function (touches, justGet) {
        var helpers = [];
        var clientRect = this.element.getBoundingClientRect();
        var scaleX = this.stage.scaleX;
        var scaleY = this.stage.scaleY;
        var isRotated = this.stage.isPortrait && this.stage.orientation === exports.Orientation.LANDSCAPE;
        var touchHelperMap = this._touchHelperMap;
        for (var i = 0, x, y, id, helper, touch; touch = touches[i]; i++) {
            id = touch.identifier;
            var x;
            var y;
            if (isRotated) {
                x = (touch.clientY - clientRect.top) / scaleX;
                y = this.stage.height - (touch.clientX - clientRect.left) / scaleY;
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
                    stopPropagation: function () {
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
    };
    UIEvent.prototype._dispatchTouch = function (sprite, offsetX, offsetY, helpers, event, methodName, eventName, needTriggerClick) {
        if (!sprite.touchEnabled || !sprite.visible) {
            return;
        }
        offsetX += sprite.x - sprite._originPixelX;
        offsetY += sprite.y - sprite._originPixelY;
        if (sprite.clipOverflow) {
            return this._detectTouchOnClipArea(sprite, offsetX, offsetY, helpers, event, methodName, eventName, needTriggerClick);
        }
        var children = sprite.children;
        var tmpHelpers = helpers.slice();
        var triggerreds = [];
        var result;
        var callback = function (helper) { return result.indexOf(helper) === -1; };
        if (children && children.length) {
            var index = children.length;
            while (--index >= 0) {
                result = this._dispatchTouch(children[index], offsetX, offsetY, tmpHelpers, event, methodName, eventName, needTriggerClick);
                if (result && result.length) {
                    triggerreds.push.apply(triggerreds, result);
                    // Remove triggerred touch helper, it won't pass to other child sprites
                    tmpHelpers = tmpHelpers.filter(callback);
                    // All triggerred then exit the loop
                    if (!tmpHelpers.length) {
                        break;
                    }
                }
            }
        }
        var hits = triggerreds.filter(function (helper) { return !helper.cancelBubble; });
        var rect = {
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
        for (var i = 0, helper = void 0; helper = tmpHelpers[i]; i++) {
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
            triggerreds.push.apply(triggerreds, hits.slice(hits.length - count, count));
            sprite.emit(eventName, hits, event);
            sprite[methodName] && sprite[methodName](hits, event);
            // Click event would just trigger by only a touch
            if (needTriggerClick && hits.length === 1 && (!hits[0]._moved || isMovedSmallRange(hits[0]))) {
                sprite.emit(UIEvent.CLICK, hits[0], event);
                sprite[onClick] && sprite[onClick](hits[0], event);
                addArrayItem(triggerreds, hits[0]);
            }
        }
        return triggerreds;
    };
    UIEvent.prototype._detectTouchOnClipArea = function (sprite, offsetX, offsetY, helpers, event, methodName, eventName, needTriggerClick) {
        var hits = [];
        var rect = {
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
        for (var i = 0, helper = void 0; helper = helpers[i]; i++) {
            if (isRectContainPoint(rect, helper) || isCircleContainPoint(circle, helper)) {
                if (!helper.target) {
                    helper.target = sprite;
                }
                helper.localX = helper.stageX - offsetX;
                helper.localY = helper.stageY - offsetY;
                // Add for current sprite hit list
                hits.push(helper);
                count++;
            }
        }
        if (hits.length) {
            var children = sprite.children;
            var triggerreds = [];
            if (children && children.length) {
                var index = children.length;
                var result_1;
                var filterUnTriggerred = function (helper) { return result_1.indexOf(helper) === -1; };
                var tmpHelpers = hits.slice();
                while (--index >= 0) {
                    result_1 = this._dispatchTouch(children[index], offsetX, offsetY, tmpHelpers, event, methodName, eventName, needTriggerClick);
                    if (result_1 && result_1.length) {
                        triggerreds.push.apply(triggerreds, result_1);
                        // Remove triggerred touch helper, it won't pass to other child sprites
                        tmpHelpers = tmpHelpers.filter(filterUnTriggerred);
                        // All triggerred then exit the loop
                        if (!tmpHelpers.length) {
                            break;
                        }
                    }
                }
            }
            hits = triggerreds.filter(function (helper) { return !helper.cancelBubble; });
            if (hits.length) {
                sprite.emit(eventName, hits, event);
                sprite[methodName] && sprite[methodName](hits, event);
                // Click event would just trigger by only a touch
                if (needTriggerClick && hits.length === 1 && (!hits[0]._moved || isMovedSmallRange(hits[0]))) {
                    sprite.emit(UIEvent.CLICK, hits[0], event);
                    sprite[onClick] && sprite[onClick](hits[0], event);
                }
            }
            return triggerreds;
        }
    };
    UIEvent.prototype._dispatchMouse = function (sprite, offsetX, offsetY, helper, event, methodName, eventName, needTriggerClick) {
        if (!sprite.mouseEnabled || !sprite.visible) {
            return false;
        }
        offsetX += sprite.x - sprite._originPixelX;
        offsetY += sprite.y - sprite._originPixelY;
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
        var rect = {
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
    };
    UIEvent.prototype._detectMouseOnClipArea = function (sprite, offsetX, offsetY, helper, event, methodName, eventName, needTriggerClick) {
        var rect = {
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
    };
    return UIEvent;
}());
UIEvent.supportTouch = "ontouchend" in window;
UIEvent.TOUCH_BEGIN = "touchstart";
UIEvent.TOUCH_MOVED = "touchmove";
UIEvent.TOUCH_ENDED = "touchend";
UIEvent.MOUSE_BEGIN = "mousedown";
UIEvent.MOUSE_MOVED = "mousemove";
UIEvent.MOUSE_ENDED = "mouseup";
UIEvent.CLICK = "click";
UIEvent.ADD_TO_STAGE = "addtostage";
UIEvent.REMOVED_FROM_STAGE = "removedfromstage";
UIEvent.FRAME = "frame";
function isRectContainPoint(rect, p) {
    return rect.x <= p.stageX && rect.x + rect.width >= p.stageX &&
        rect.y <= p.stageY && rect.y + rect.height >= p.stageY;
}
function isCircleContainPoint(circle, p) {
    var dx = p.stageX - circle.x;
    var dy = p.stageY - circle.y;
    return Math.sqrt(dx * dx + dy * dy) <= circle.radius;
}
function isMovedSmallRange(e) {
    if (e.beginX == null && e.beginY == null) {
        return false;
    }
    var x = Math.abs(e.beginX - e.stageX);
    var y = Math.abs(e.beginY - e.stageY);
    return x <= 5 && y <= 5;
}

(function (ScaleMode) {
    ScaleMode[ScaleMode["SHOW_ALL"] = 0] = "SHOW_ALL";
    ScaleMode[ScaleMode["NO_BORDER"] = 1] = "NO_BORDER";
    ScaleMode[ScaleMode["FIX_WIDTH"] = 2] = "FIX_WIDTH";
    ScaleMode[ScaleMode["FIX_HEIGHT"] = 3] = "FIX_HEIGHT";
    ScaleMode[ScaleMode["EXACTFIT"] = 4] = "EXACTFIT";
})(exports.ScaleMode || (exports.ScaleMode = {}));

(function (Orientation) {
    Orientation[Orientation["LANDSCAPE"] = 0] = "LANDSCAPE";
    Orientation[Orientation["PORTRAIT"] = 1] = "PORTRAIT";
})(exports.Orientation || (exports.Orientation = {}));
var Stage = (function (_super) {
    __extends(Stage, _super);
    /**
     * @param  canvas     Canvas element
     * @param  width      Resolution design width
     * @param  height     Resolution design height
     * @param  scaleMode  Adjust resolution design scale mode
     */
    function Stage(canvas, width, height, scaleMode, autoAdjustCanvasSize, orientation) {
        if (orientation === void 0) { orientation = exports.Orientation.PORTRAIT; }
        var _this = _super.call(this) || this;
        _this._fps = 30;
        _this._frameRate = 1000 / _this._fps;
        _this._width = 0;
        _this._height = 0;
        _this.adjustCanvasSize = function () {
            var canvas = _this._canvas;
            var stageWidth = _this._width;
            var stageHeight = _this._height;
            var scaleMode = _this._scaleMode;
            var visibleRect = _this._visibleRect;
            var orientation = _this._orientation;
            if (!canvas || !canvas.parentNode) {
                return;
            }
            var style = canvas.style;
            var container = {
                width: canvas.parentElement.offsetWidth,
                height: canvas.parentElement.offsetHeight
            };
            var isPortrait = container.width < container.height;
            if (orientation === exports.Orientation.LANDSCAPE && isPortrait) {
                var tmpHeight = container.height;
                container.height = container.width;
                container.width = tmpHeight;
            }
            var sx = container.width / stageWidth;
            var sy = container.height / stageHeight;
            var deltaWidth = 0;
            var deltaHeight = 0;
            var scaleX;
            var scaleY;
            var width;
            var height;
            switch (scaleMode) {
                case exports.ScaleMode.SHOW_ALL:
                    if (sx < sy) {
                        scaleX = scaleY = sx;
                        width = container.width;
                        height = scaleX * stageHeight;
                    }
                    else {
                        scaleX = scaleY = sy;
                        width = scaleX * stageWidth;
                        height = container.height;
                    }
                    break;
                case exports.ScaleMode.NO_BORDER:
                    scaleX = scaleY = sx > sy ? sx : sy;
                    width = stageWidth * scaleX;
                    height = stageHeight * scaleX;
                    deltaWidth = (stageWidth - container.width / scaleX) * 0.5 | 0;
                    deltaHeight = (stageHeight - container.height / scaleX) * 0.5 | 0;
                    break;
                case exports.ScaleMode.FIX_WIDTH:
                    scaleX = scaleY = sx;
                    width = container.width;
                    height = container.height * scaleX;
                    deltaHeight = (stageHeight - container.height / scaleX) * 0.5 | 0;
                    break;
                case exports.ScaleMode.FIX_HEIGHT:
                    scaleX = scaleY = sy;
                    width = scaleX * container.width;
                    height = container.height;
                    deltaWidth = (stageWidth - container.width / scaleX) * 0.5 | 0;
                    break;
                case exports.ScaleMode.EXACTFIT:
                    scaleX = sx;
                    scaleY = sy;
                    width = container.width;
                    height = container.height;
                    break;
                default:
                    throw new Error("Unknow stage scale mode \"" + scaleMode + "\"");
            }
            style.width = width + 'px';
            style.height = height + 'px';
            style.position = 'absolute';
            visibleRect.left = deltaWidth;
            visibleRect.right = stageWidth - deltaWidth;
            visibleRect.top = deltaHeight;
            visibleRect.bottom = stageHeight - deltaHeight;
            if (orientation === exports.Orientation.LANDSCAPE && isPortrait) {
                style.top = ((container.width - width) * 0.5) + 'px';
                style.left = ((container.height - height) * 0.5) + 'px';
                style.transformOrigin = style['webkitTransformOrigin'] = '0 0 0';
                style.transform = style['webkitTransform'] = "translateX(" + height + "px) rotate(90deg)";
            }
            else {
                style.transform = '';
                style.top = ((container.height - height) * 0.5) + 'px';
                style.left = ((container.width - width) * 0.5) + 'px';
            }
            _this._scaleX = scaleX;
            _this._scaleY = scaleY;
            _this._isPortrait = isPortrait;
        };
        _this._sprite = new Sprite({
            x: width * 0.5,
            y: height * 0.5,
            width: width,
            height: height
        });
        _this._sprite.stage = _this;
        _this._scaleMode = scaleMode;
        _this._canvas = canvas;
        _this._renderContext = canvas.getContext('2d');
        _this._bufferCanvas = document.createElement("canvas");
        _this._bufferContext = _this._bufferCanvas.getContext("2d");
        _this._width = canvas.width = _this._bufferCanvas.width = width;
        _this._height = canvas.height = _this._bufferCanvas.height = height;
        _this._scaleX = _this._scaleY = 1;
        _this._isPortrait = false;
        _this._visibleRect = { left: 0, right: width, top: 0, bottom: height };
        _this.orientation = orientation;
        _this.autoAdjustCanvasSize = autoAdjustCanvasSize;
        _this._uiEvent = new UIEvent(_this);
        return _this;
    }
    Object.defineProperty(Stage.prototype, "fps", {
        get: function () {
            return this._fps;
        },
        set: function (value) {
            this._frameRate = 1000 / value;
            this._fps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "isRunning", {
        get: function () {
            return this._isRunning;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "width", {
        get: function () {
            return this._width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "height", {
        get: function () {
            return this._height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "canvas", {
        get: function () {
            return this._canvas;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "context", {
        get: function () {
            return this._renderContext;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "sprite", {
        get: function () {
            return this._sprite;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "visibleRect", {
        get: function () {
            return this._visibleRect;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "scaleX", {
        get: function () {
            return this._scaleX;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "scaleY", {
        get: function () {
            return this._scaleY;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "isPortrait", {
        get: function () {
            return this._isPortrait;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "scaleMode", {
        get: function () {
            return this._scaleMode;
        },
        set: function (value) {
            if (value === this._scaleMode) {
                return;
            }
            this._scaleMode = value;
            this.adjustCanvasSize();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "autoAdjustCanvasSize", {
        get: function () {
            return this._autoAdjustCanvasSize;
        },
        set: function (value) {
            if (value && !this._autoAdjustCanvasSize) {
                this._autoAdjustCanvasSize = true;
                this.adjustCanvasSize();
                window.addEventListener("resize", this.adjustCanvasSize);
            }
            else if (!value && this._autoAdjustCanvasSize) {
                this._autoAdjustCanvasSize = false;
                window.removeEventListener("resize", this.adjustCanvasSize);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "orientation", {
        get: function () {
            return this._orientation;
        },
        set: function (orientation) {
            if (this._orientation != orientation) {
                this._orientation = orientation;
            }
        },
        enumerable: true,
        configurable: true
    });
    Stage.prototype.setSize = function (width, height) {
        this._width = this._canvas.width = this._bufferCanvas.width = width;
        this._height = this._canvas.height = this._bufferCanvas.height = height;
        if (this._autoAdjustCanvasSize) {
            this.adjustCanvasSize();
        }
        this._sprite.x = width * 0.5;
        this._sprite.y = height * 0.5;
        this._sprite.width = width;
        this._sprite.height = height;
    };
    Stage.prototype.start = function (useExternalTimer) {
        if (this._isRunning) {
            return;
        }
        this._useExternalTimer = !!useExternalTimer;
        if (!useExternalTimer) {
            this._lastUpdateTime = Date.now();
            this._startTimer();
        }
        this._uiEvent.register();
        this._isRunning = true;
    };
    Stage.prototype.step = function (deltaTime) {
        this._sprite._update(deltaTime);
    };
    Stage.prototype.stop = function (unregisterUIEvent) {
        if (!this._isRunning) {
            return;
        }
        if (unregisterUIEvent) {
            this._uiEvent.unregister();
        }
        this._isRunning = false;
        clearTimeout(this._timerId);
    };
    Stage.prototype.render = function () {
        if (!this._isRunning) {
            return;
        }
        var _a = this._canvas, width = _a.width, height = _a.height;
        this._bufferContext.clearRect(0, 0, width, height);
        this._sprite._visit(this._bufferContext);
        this._renderContext.clearRect(0, 0, width, height);
        this._renderContext.drawImage(this._bufferCanvas, 0, 0, width, height);
    };
    /**
     * Add sprite to the stage
     */
    Stage.prototype.addChild = function (child, position) {
        this._sprite.addChild(child, position);
    };
    /**
     * Remove sprite from the stage
     */
    Stage.prototype.removeChild = function (child) {
        this._sprite.removeChild(child);
    };
    /**
     * Remove all sprites from the stage
     * @param  recusive  Recusize remove all the children
     */
    Stage.prototype.removeAllChildren = function (recusive) {
        this._sprite.removeAllChildren(recusive);
    };
    Stage.prototype.release = function () {
        this.stop(true);
        this._uiEvent.release();
        this._sprite.release(true);
        this._sprite = this._uiEvent = this._canvas = this._renderContext = this._bufferCanvas = this._bufferContext = null;
    };
    Stage.prototype._startTimer = function () {
        var _this = this;
        this._timerId = setTimeout(function () {
            if (_this._useExternalTimer) {
                return;
            }
            var deltaTime = _this._getDeltaTime();
            Action.schedule(deltaTime);
            _this._sprite._update(deltaTime);
            _this.render();
            _this._startTimer();
        }, this._frameRate);
    };
    Stage.prototype._getDeltaTime = function () {
        var now = Date.now();
        var delta = now - this._lastUpdateTime;
        this._lastUpdateTime = now;
        return delta / 1000;
    };
    return Stage;
}(EventEmitter));

var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
var _cache = {};
function getCacheKey$1(text, width, fontFace, fontSize, lineHeight) {
    return text + width + fontFace.name + fontSize + lineHeight;
}
function measureText(text, width, fontFace, fontSize, lineHeight) {
    var cacheKey = getCacheKey$1(text, width, fontFace, fontSize, lineHeight);
    var cached = _cache[cacheKey];
    if (cached) {
        return cached;
    }
    var measuredSize = {};
    var textMetrics;
    var lastMeasuredWidth;
    var tryLine;
    var currentLine;
    ctx.font = fontFace.style + ' ' + fontFace.weight + ' ' + fontSize + 'px ' + fontFace.name;
    textMetrics = ctx.measureText(text);
    measuredSize.width = textMetrics.width;
    measuredSize.height = lineHeight;
    measuredSize.lines = [];
    if (measuredSize.width <= width) {
        // The entire text string fits.
        measuredSize.lines.push({ width: measuredSize.width, text: text });
    }
    else {
        // Break into multiple lines.
        measuredSize.width = width;
        currentLine = '';
        var breaker = new LineBreaker(text, fontSize);
        var remainWidth = width;
        var index = 0;
        var words = void 0;
        while (index < text.length) {
            var res = breaker.nextBreak(remainWidth);
            if (res.len) {
                words = text.slice(index, index + res.len);
                tryLine = currentLine + words;
                textMetrics = ctx.measureText(tryLine);
                if (textMetrics.width > width) {
                    measuredSize.height += lineHeight;
                    measuredSize.lines.push({
                        width: lastMeasuredWidth,
                        text: currentLine.trim(),
                    });
                    currentLine = words;
                    lastMeasuredWidth = ctx.measureText(currentLine.trim()).width;
                    remainWidth = width;
                }
                else {
                    currentLine = tryLine;
                    lastMeasuredWidth = textMetrics.width;
                    remainWidth = width - lastMeasuredWidth;
                }
            }
            else {
                measuredSize.height += lineHeight;
                measuredSize.lines.push({
                    width: lastMeasuredWidth,
                    text: currentLine.trim(),
                });
                currentLine = "";
                lastMeasuredWidth = 0;
                remainWidth = width;
            }
            index += res.len;
        }
        currentLine = currentLine.trim();
        if (currentLine.length > 0) {
            textMetrics = ctx.measureText(currentLine);
            measuredSize.lines.push({ width: textMetrics.width, text: currentLine });
        }
    }
    _cache[cacheKey] = measuredSize;
    return measuredSize;
}

var LineBreaker = (function () {
    function LineBreaker(text, fontSize) {
        this.text = text;
        this.fontSize = fontSize;
        this.position = 0;
    }
    LineBreaker.prototype.nextBreak = function (width) {
        var len = Math.max(0, Math.floor(width / this.fontSize) - 1);
        var pos = this.position;
        this.position += len;
        return {
            len: len,
        };
    };
    return LineBreaker;
}());

var DefaultFontSize = 24;
var TextLabel = (function (_super) {
    __extends(TextLabel, _super);
    function TextLabel(props) {
        var _this = _super.call(this) || this;
        _this.textAlign = 'center';
        _this.fontColor = 0x000;
        _this._wordWrap = true;
        _this._fontName = 'sans-serif';
        _this._fontSize = DefaultFontSize;
        _this._fontWeight = 'normal';
        _this._fontStyle = 'normal';
        _this._lines = [];
        props && _this.setProps(props);
        return _this;
    }
    Object.defineProperty(TextLabel.prototype, "width", {
        get: function () {
            return this._width;
        },
        set: function (value) {
            if (this._width === value) {
                return;
            }
            this._width = value;
            this._originPixelX = this._width * this._originX;
            if (this.left != null || this.right != null) {
                this._reCalcX();
            }
            else {
                this._adjustAlignX();
            }
            this._reMeasureText();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextLabel.prototype, "height", {
        get: function () {
            return this._height;
        },
        set: function (value) {
            if (this._height === value) {
                return;
            }
            this._height = value;
            this._originPixelY = this._height * this._originY;
            if (this.top != null || this.bottom != null) {
                this._reCalcY();
            }
            else {
                this._adjustAlignY();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextLabel.prototype, "fontSize", {
        get: function () {
            return this._fontSize;
        },
        set: function (value) {
            if (this._fontSize != value) {
                this._fontSize = value;
                if (this._lineHeight == null) {
                    this._lineHeight = value;
                }
                this._reMeasureText();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextLabel.prototype, "fontName", {
        get: function () {
            return this._fontName;
        },
        set: function (value) {
            if (this._fontName != value) {
                this._fontName = value;
                this._reMeasureText();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextLabel.prototype, "fontStyle", {
        get: function () {
            return this._fontStyle;
        },
        set: function (value) {
            if (this._fontStyle != value) {
                this._fontStyle = value;
                this._reMeasureText();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextLabel.prototype, "fontWeight", {
        get: function () {
            return this._fontWeight;
        },
        set: function (value) {
            if (this._fontWeight != value) {
                this._fontWeight = value;
                this._reMeasureText();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextLabel.prototype, "lineHeight", {
        get: function () {
            return this._lineHeight == null ? this._fontSize : this._lineHeight;
        },
        set: function (value) {
            if (this._lineHeight != value) {
                this._lineHeight = value;
                this._reMeasureText();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextLabel.prototype, "wordWrap", {
        get: function () {
            return this._wordWrap;
        },
        set: function (value) {
            if (this._wordWrap !== value) {
                this._wordWrap = value;
                this._reMeasureText();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextLabel.prototype, "text", {
        get: function () {
            return this._text;
        },
        set: function (content) {
            if (this._text !== content) {
                this._text = content;
                this._reMeasureText();
            }
        },
        enumerable: true,
        configurable: true
    });
    TextLabel.prototype._reMeasureText = function () {
        if (!this._text || this.width <= 0) {
            return;
        }
        if (!this.wordWrap) {
            this.height = this.lineHeight;
            this._lines = [{
                    text: this._text || "",
                    width: this._width,
                }];
            return;
        }
        var res = measureText(this._text, this.width, {
            style: this.fontStyle,
            name: this.fontName,
            weight: this.fontWeight,
        }, this.fontSize, this.lineHeight);
        this._lines = res.lines;
        this.height = res.height;
    };
    TextLabel.prototype.addChild = function (target) {
        if (Array.isArray(target)) {
            this.text += target.join("");
        }
        else {
            this.text += String(target);
        }
    };
    TextLabel.prototype.addChildren = function () {
        var children = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            children[_i] = arguments[_i];
        }
    };
    TextLabel.prototype.draw = function (context) {
        _super.prototype.draw.call(this, context);
        if (!this._lines || this._lines.length === 0) {
            return;
        }
        var _a = this, strokeWidth = _a.strokeWidth, strokeColor = _a.strokeColor, textAlign = _a.textAlign, lineHeight = _a.lineHeight, _originPixelX = _a._originPixelX, _originPixelY = _a._originPixelY, fontSize = _a.fontSize, fontWeight = _a.fontWeight, fontStyle = _a.fontStyle, fontName = _a.fontName, fontColor = _a.fontColor, width = _a.width;
        context.font = fontStyle + ' ' + fontWeight + ' ' + fontSize + 'px ' + fontName;
        context.fillStyle = convertColor(fontColor);
        context.textAlign = textAlign;
        context.textBaseline = 'middle';
        context.lineJoin = 'round';
        if (strokeColor != null) {
            context.strokeStyle = convertColor(strokeColor || 0x000);
            context.lineWidth = (strokeWidth || 1) * 2;
        }
        var x = textAlign === 'left' ? -_originPixelX : textAlign === 'center' ? 0 : width - _originPixelX;
        var y = -_originPixelY + lineHeight * 0.5;
        this._lines.forEach(function (line) {
            if (line.text.length > 0) {
                if (strokeColor != null) {
                    context.strokeText(line.text, x, y);
                }
                context.fillText(line.text, x, y);
            }
            y += lineHeight;
        });
    };
    return TextLabel;
}(Sprite));

var BMFontLabel = (function (_super) {
    __extends(BMFontLabel, _super);
    function BMFontLabel(props) {
        var _this = _super.call(this) || this;
        _this._lineHeight = 5;
        _this._wordSpace = 0;
        _this._fontSize = 0;
        _this._textAlign = "center";
        _this._wordWrap = true;
        _this._text = "";
        _this._lines = [];
        _this._autoResize = true;
        props && _this.setProps(props);
        return _this;
    }
    Object.defineProperty(BMFontLabel.prototype, "autoResize", {
        get: function () {
            return this._autoResize;
        },
        set: function (value) {
            if (this._autoResize !== value) {
                this._autoResize = value;
                if (value && this._lines.length) {
                    this.height = this._lines.length * this.lineHeight;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BMFontLabel.prototype, "text", {
        get: function () {
            return this._text;
        },
        set: function (text) {
            if (text === this._text) {
                return;
            }
            this._text = text;
            this._reMeasureText();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BMFontLabel.prototype, "textureMap", {
        get: function () {
            return this._textureMap;
        },
        set: function (textureMap) {
            this._textureMap = textureMap;
            this._reMeasureText();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BMFontLabel.prototype, "textAlign", {
        get: function () {
            return this._textAlign;
        },
        set: function (value) {
            if (this._textAlign != value) {
                this._textAlign = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BMFontLabel.prototype, "lineHeight", {
        get: function () {
            return this._lineHeight;
        },
        set: function (value) {
            if (this._lineHeight != value) {
                this._lineHeight = value;
                if (this.autoResize && this._lines.length) {
                    this.height = this._lines.length * value;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BMFontLabel.prototype, "wordSpace", {
        get: function () {
            return this._wordSpace;
        },
        set: function (value) {
            if (this._wordSpace !== value) {
                this._wordSpace = value;
                this._reMeasureText();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BMFontLabel.prototype, "wordWrap", {
        get: function () {
            return this._wordWrap;
        },
        set: function (value) {
            if (this._wordWrap !== value) {
                this._wordWrap = value;
                this._reMeasureText();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BMFontLabel.prototype, "fontSize", {
        get: function () {
            return this._fontSize;
        },
        set: function (value) {
            if (this._fontSize !== value) {
                this._fontSize = value;
                this._reMeasureText();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BMFontLabel.prototype, "width", {
        get: function () {
            return this._width;
        },
        set: function (value) {
            if (this._width === value) {
                return;
            }
            this._width = value;
            this._originPixelX = this._width * this._originX;
            if (this.left != null || this.right != null) {
                this._reCalcX();
            }
            else {
                this._adjustAlignX();
            }
            this._reMeasureText();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BMFontLabel.prototype, "height", {
        get: function () {
            return this._height;
        },
        set: function (value) {
            if (this._height === value) {
                return;
            }
            this._height = value;
            this._originPixelY = this._height * this._originY;
            if (this.top != null || this.bottom != null) {
                this._reCalcY();
            }
            else {
                this._adjustAlignY();
            }
        },
        enumerable: true,
        configurable: true
    });
    BMFontLabel.prototype._reMeasureText = function () {
        var _this = this;
        if (!this.textureMap || !this._text) {
            this._lines.length = 0;
            return;
        }
        var _a = this, textureMap = _a.textureMap, text = _a.text, width = _a.width, lineHeight = _a.lineHeight, fontSize = _a.fontSize, wordWrap = _a.wordWrap, wordSpace = _a.wordSpace, _lines = _a._lines;
        _lines.length = 0;
        var words = this._text.split('');
        var currLine = _lines[0] = { width: 0, words: [] };
        words.forEach(function (word) {
            var texture;
            if (word === " ") {
                texture = null;
            }
            else {
                texture = textureMap[word];
                if (!texture) {
                    console.error("canvas2d.BMFontLabel: Texture of the word \"" + word + "\" not found.", _this);
                    texture = null;
                }
                if (!texture.ready) {
                    console.error("canvas2d.BMFontLabel: Texture of the word \"" + word + "\" is not ready to use.", _this);
                    texture = null;
                }
            }
            if (!wordWrap || currLine.width + fontSize <= width) {
                currLine.width += fontSize;
                currLine.words.push(texture);
                if (currLine.width + wordSpace >= width) {
                    currLine = _lines[_lines.length] = {
                        width: 0, words: []
                    };
                }
            }
            else {
                currLine = _lines[_lines.length] = {
                    width: fontSize, words: [texture]
                };
            }
        });
        if (this.autoResize) {
            this.height = _lines.length * lineHeight;
        }
    };
    BMFontLabel.prototype.draw = function (context) {
        _super.prototype.draw.call(this, context);
        var _a = this, _originPixelX = _a._originPixelX, _originPixelY = _a._originPixelY, _textAlign = _a._textAlign, fontSize = _a.fontSize, lineHeight = _a.lineHeight, wordSpace = _a.wordSpace, width = _a.width;
        var lineSpace = (lineHeight - fontSize) * 0.5;
        var y = -_originPixelY + lineSpace;
        this._lines.forEach(function (line, i) {
            var x;
            if (_textAlign === "right") {
                x = width - line.width - _originPixelX;
            }
            else if (_textAlign == "center") {
                x = (width - line.width) * 0.5 - _originPixelX;
            }
            else {
                x = -_originPixelX;
            }
            line.words.forEach(function (word, j) {
                if (word) {
                    context.drawImage(word.source, 0, 0, word.width, word.height, x, y, fontSize, fontSize);
                }
                x += fontSize + wordSpace;
            });
            y += lineHeight;
        });
    };
    BMFontLabel.prototype.addChild = function (target) {
        this._text = (this._text || "") + target;
    };
    BMFontLabel.prototype.addChildren = function () {
        var children = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            children[_i] = arguments[_i];
        }
        this._text = (this._text || "") + children.join("");
    };
    return BMFontLabel;
}(Sprite));

function createSprite(type, props) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    props = props || {};
    var sprite;
    var ref = props.ref, actions = props.actions, options = __rest(props, ["ref", "actions"]);
    if (typeof type === 'function') {
        sprite = new type(options);
        addChildren(sprite, children);
    }
    else {
        switch (type) {
            case "sprite":
                sprite = new Sprite(options);
                addChildren(sprite, children);
                break;
            case "text":
                sprite = createLabel(type, TextLabel, options, children);
                break;
            case "bmfont":
                sprite = createLabel(type, BMFontLabel, options, children);
                break;
            case 'stage':
                sprite = createStage(options, children);
                break;
        }
    }
    if (sprite == null) {
        console.error("canvas2d.createSprite(): Unknown sprite type", type);
    }
    else if (actions && actions.length) {
        actions.forEach(function (queue) {
            new Action(sprite).queue(queue).start();
        });
    }
    if (ref) {
        ref.call(undefined, sprite);
    }
    return sprite;
}
function createLabel(tag, ctor, props, children) {
    var sprite = new ctor(props);
    if (children.length) {
        sprite.text = children.join('');
    }
    return sprite;
}
function createStage(props, children) {
    var canvas = props.canvas, width = props.width, height = props.height, scaleMode = props.scaleMode, autoAdjustCanvasSize = props.autoAdjustCanvasSize, useExternalTimer = props.useExternalTimer, touchEnabled = props.touchEnabled, mouseEnabled = props.mouseEnabled, orientation = props.orientation;
    var stage = new Stage(canvas, width, height, scaleMode, autoAdjustCanvasSize, orientation);
    stage.touchEnabled = touchEnabled;
    stage.mouseEnabled = mouseEnabled;
    stage.start(useExternalTimer);
    if (children.length) {
        children.forEach(function (child) { return child && stage.addChild(child); });
    }
    return stage;
}
function addChildren(sprite, children) {
    if (!children.length) {
        return;
    }
    children.forEach(function (child) {
        if (!child) {
            return;
        }
        if (Array.isArray(child)) {
            addChildren(sprite, child);
        }
        else {
            sprite.addChild(child);
        }
    });
}

var HTMLAudio = (function (_super) {
    __extends(HTMLAudio, _super);
    function HTMLAudio(src) {
        var _this = _super.call(this) || this;
        _this.loop = false;
        _this.muted = false;
        _this.loaded = false;
        _this.volume = 1;
        _this.playing = false;
        _this.autoplay = false;
        _this.duration = 0;
        _this.currentTime = 0;
        _this.src = src;
        _this._handleEvent = _this._handleEvent.bind(_this);
        return _this;
    }
    HTMLAudio.prototype.load = function () {
        if (this.loaded || this._isLoading) {
            return;
        }
        var audioNode = this._audioNode = new Audio();
        audioNode.addEventListener('canplaythrough', this._handleEvent, false);
        audioNode.addEventListener('ended', this._handleEvent, false);
        audioNode.addEventListener('error', this._handleEvent, false);
        audioNode.preload = "auto";
        audioNode['autobuffer'] = true;
        audioNode.setAttribute('src', this.src);
        audioNode.volume = this.volume;
        audioNode.load();
    };
    HTMLAudio.prototype.play = function () {
        if (!HTMLAudio.enabled) {
            return;
        }
        if (this.playing) {
            this.stop();
        }
        if (this.loaded) {
            this._play();
        }
        else if (!this._isLoading) {
            this.autoplay = true;
            this.load();
        }
    };
    HTMLAudio.prototype.pause = function () {
        if (this.playing) {
            this._audioNode.pause();
            this.currentTime = this._audioNode.currentTime;
            this.playing = false;
        }
    };
    HTMLAudio.prototype.resume = function () {
        if (!this.playing && HTMLAudio.enabled) {
            this.play();
        }
    };
    HTMLAudio.prototype.stop = function () {
        if (this.playing) {
            this._audioNode.pause();
            this._audioNode.currentTime = this.currentTime = 0;
            this.playing = false;
        }
    };
    HTMLAudio.prototype.setMute = function (muted) {
        if (this.muted != muted) {
            this.muted = muted;
            if (this._audioNode) {
                this._audioNode.volume = muted ? 0 : this.volume;
            }
        }
    };
    HTMLAudio.prototype.setVolume = function (volume) {
        if (this.volume != volume) {
            this.volume = volume;
            if (this._audioNode) {
                this._audioNode.volume = volume;
            }
        }
    };
    HTMLAudio.prototype.clone = function () {
        var cloned = new HTMLAudio(this.src);
        if (this.loaded) {
            cloned._audioNode = this._audioNode.cloneNode(true);
            cloned.loaded = true;
            cloned.duration = this.duration;
        }
        return cloned;
    };
    HTMLAudio.prototype._handleEvent = function (e) {
        var type = e.type;
        switch (type) {
            case 'canplaythrough':
                e.target.removeEventListener('canplaythrough', this._handleEvent, false);
                this.loaded = true;
                this.duration = this._audioNode.duration;
                this.emit('load');
                if (this.autoplay) {
                    this.play();
                }
                break;
            case 'ended':
                this.playing = false;
                this.currentTime = 0;
                this.emit('ended');
                if (this.loop) {
                    this.play();
                }
                break;
        }
    };
    HTMLAudio.prototype._play = function () {
        if (!this.playing) {
            this._audioNode.volume = this.muted ? 0 : this.volume;
            this._audioNode.play();
            this.playing = true;
        }
    };
    return HTMLAudio;
}(EventEmitter));
HTMLAudio.enabled = false;

var AudioCtx = window['AudioContext'] || window['webkitAudioContext'];
var context = AudioCtx ? new AudioCtx() : null;
var WebAudio = (function (_super) {
    __extends(WebAudio, _super);
    function WebAudio(src) {
        var _this = _super.call(this) || this;
        _this._startTime = 0;
        _this.loop = false;
        _this.muted = false;
        _this.loaded = false;
        _this.volume = 1;
        _this.playing = false;
        _this.autoplay = false;
        _this.duration = 0;
        _this.currentTime = 0;
        _this.src = src;
        _this._handleEvent = _this._handleEvent.bind(_this);
        _this._gainNode = context.createGain ? context.createGain() : context['createGainNode']();
        _this._gainNode.connect(context.destination);
        return _this;
    }
    Object.defineProperty(WebAudio, "enabled", {
        get: function () {
            return this._enabled;
        },
        set: function (enabled) {
            if (enabled && this.isSupported && !this._initialized) {
                var source = context.createBufferSource();
                source.buffer = context.createBuffer(1, 1, 22050);
                source.connect(context.destination);
                source.start ? source.start(0, 0, 0) : source['noteOn'](0, 0, 0);
                this._initialized = true;
            }
            this._enabled = enabled;
        },
        enumerable: true,
        configurable: true
    });
    WebAudio.prototype.load = function () {
        if (this._isLoading || this.loaded) {
            return;
        }
        var request = new XMLHttpRequest();
        request.onprogress = request.onload = request.onerror = this._handleEvent;
        request.open('GET', this.src, true);
        request.responseType = 'arraybuffer';
        request.send();
        this._isLoading = true;
    };
    WebAudio.prototype.play = function () {
        if (!WebAudio.enabled) {
            return;
        }
        if (this.playing) {
            this.stop();
        }
        if (this.loaded) {
            this._play();
        }
        else if (!this._buffer) {
            this.autoplay = true;
            this.load();
        }
    };
    WebAudio.prototype.pause = function () {
        if (this.playing) {
            this._audioNode.stop();
            this.currentTime += context.currentTime - this._startTime;
            this.playing = false;
        }
    };
    WebAudio.prototype.resume = function () {
        if (!this.playing && WebAudio.enabled) {
            this._play();
        }
    };
    WebAudio.prototype.stop = function () {
        if (this.playing) {
            this._audioNode.stop(0);
            this._audioNode.disconnect();
            this.currentTime = 0;
            this.playing = false;
        }
    };
    WebAudio.prototype.setMute = function (muted) {
        if (this.muted != muted) {
            this.muted = muted;
            this._gainNode.gain.value = muted ? 0 : this.volume;
        }
    };
    WebAudio.prototype.setVolume = function (volume) {
        if (this.volume != volume) {
            this.volume = volume;
            this._gainNode.gain.value = volume;
        }
    };
    WebAudio.prototype.clone = function () {
        var _this = this;
        var cloned = new WebAudio(this.src);
        if (this._isLoading) {
            cloned._isLoading = true;
            var onLoad = function () {
                cloned._onDecodeCompleted(_this._buffer);
                _this.removeListener("load", onload);
            };
            this.on('load', onload);
        }
        else if (this.loaded) {
            cloned._onDecodeCompleted(this._buffer);
        }
        return cloned;
    };
    WebAudio.prototype._handleEvent = function (e) {
        var _this = this;
        var type = e.type;
        switch (type) {
            case 'load':
                var request = e.target;
                request.onload = request.onprogress = request.onerror = null;
                context.decodeAudioData(request.response, function (buffer) { return _this._onDecodeCompleted(buffer); }, function () { return _this.emit('error'); });
                request = null;
                break;
            case 'ended':
                if (this.playing) {
                    // play ended, not paused
                    this.currentTime = 0;
                    this.playing = false;
                    this.emit('ended');
                    if (this.loop) {
                        this.play();
                    }
                }
                break;
            default:
                this.emit(type, e);
                break;
        }
    };
    WebAudio.prototype._onDecodeCompleted = function (buffer) {
        this._buffer = buffer;
        this._isLoading = false;
        this.loaded = true;
        this.duration = buffer.duration;
        this.emit('load');
        if (this.autoplay) {
            this.play();
        }
    };
    WebAudio.prototype._play = function () {
        this._clearAudioNode();
        var audioNode = context.createBufferSource();
        if (!audioNode.start) {
            audioNode.start = audioNode['noteOn'];
            audioNode.stop = audioNode['noteOff'];
        }
        this._gainNode.gain.value = this.muted ? 0 : this.volume;
        audioNode.buffer = this._buffer;
        audioNode.onended = this._handleEvent;
        audioNode.connect(this._gainNode);
        audioNode.start(0, this.currentTime);
        this._audioNode = audioNode;
        this._startTime = context.currentTime;
        this.playing = true;
    };
    WebAudio.prototype._clearAudioNode = function () {
        var audioNode = this._audioNode;
        if (audioNode) {
            audioNode.onended = null;
            audioNode.disconnect(0);
            this._audioNode = null;
        }
    };
    return WebAudio;
}(EventEmitter));
WebAudio.isSupported = AudioCtx != null;
WebAudio._initialized = false;
WebAudio._enabled = false;

var SoundManager = (function () {
    function SoundManager() {
        this._ext = ".mp3";
        this._audioCache = {};
        this._supportedType = {
            mp3: false,
            mp4: false,
            wav: false,
            ogg: false
        };
        this._detectSupportedType();
    }
    Object.defineProperty(SoundManager.prototype, "enabled", {
        get: function () {
            return this._enabled;
        },
        set: function (value) {
            if (value == this._enabled) {
                return;
            }
            this._setEnabled(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SoundManager.prototype, "supportedType", {
        get: function () {
            return __assign({}, this._supportedType);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SoundManager.prototype, "ext", {
        get: function () {
            return this._ext;
        },
        set: function (ext) {
            this._ext = ext;
        },
        enumerable: true,
        configurable: true
    });
    SoundManager.prototype.getAudio = function (name, returnAll) {
        var list = this._audioCache[name];
        if (!list || !list.length) {
            return returnAll ? [] : null;
        }
        var i = 0;
        var all = [];
        var audio;
        for (; audio = list[i]; i++) {
            if (!audio.playing) {
                if (!returnAll) {
                    return audio;
                }
                all.push(audio);
            }
        }
        return returnAll ? all : all[0];
    };
    SoundManager.prototype.load = function (baseUri, name, onComplete, channels) {
        var _this = this;
        if (channels === void 0) { channels = 1; }
        var src = baseUri + name + this._ext;
        var audio = WebAudio.isSupported ? new WebAudio(src) : new HTMLAudio(src);
        audio.on('load', function () {
            if (onComplete) {
                onComplete();
            }
            var cloned;
            while (--channels > 0) {
                cloned = audio.clone();
                _this._audioCache[name].push(cloned);
            }
        });
        audio.on('error', function (e) {
            console.warn("canvas2d.Sound.load() Error: " + src + " could not be loaded.");
            removeArrayItem(_this._audioCache[name], audio);
        });
        if (!this._audioCache[name]) {
            this._audioCache[name] = [];
        }
        this._audioCache[name].push(audio);
        audio.load();
    };
    /**
     * Load multiple sound resources
     */
    SoundManager.prototype.loadList = function (baseUri, resources, onAllCompleted, onProgress) {
        var _this = this;
        var totalCount = resources.length;
        var endedCount = 0;
        var onCompleted = function () {
            ++endedCount;
            if (onProgress) {
                onProgress(endedCount / totalCount);
            }
            if (endedCount === totalCount && onAllCompleted) {
                onAllCompleted();
            }
        };
        resources.forEach(function (res) { return _this.load(baseUri, res.name, onCompleted, res.channels); });
    };
    /**
     * Get all audioes by name
     */
    SoundManager.prototype.getAllAudioes = function (name) {
        return this._audioCache[name] && this._audioCache[name].slice();
    };
    /**
     * Play sound by name
     */
    SoundManager.prototype.play = function (name, loop) {
        if (loop === void 0) { loop = false; }
        var audio = this._enabled && this.getAudio(name);
        if (audio) {
            audio.loop = loop;
            audio.play();
        }
        return audio;
    };
    /**
     * Pause sound by name
     */
    SoundManager.prototype.pause = function (name) {
        var list = this.getAllAudioes(name);
        if (list) {
            list.forEach(function (audio) { return audio.pause(); });
        }
    };
    /**
     * Stop sound by name
     */
    SoundManager.prototype.stop = function (name) {
        var list = this._audioCache[name];
        if (list) {
            list.forEach(function (audio) { return audio.stop(); });
        }
    };
    /**
     * Resume audio by name
     */
    SoundManager.prototype.resume = function (name) {
        var list = this._audioCache[name];
        if (list) {
            list.forEach(function (audio) { return !audio.playing && audio.currentTime > 0 && audio.resume(); });
        }
    };
    SoundManager.prototype._setEnabled = function (value) {
        var _this = this;
        if (value) {
            WebAudio.enabled = true;
            HTMLAudio.enabled = true;
            if (this._pausedAudios) {
                Object.keys(this._pausedAudios).forEach(function (id) {
                    _this._pausedAudios[id].resume();
                });
                this._pausedAudios = null;
            }
        }
        else {
            WebAudio.enabled = false;
            HTMLAudio.enabled = false;
            this._pausedAudios = {};
            Object.keys(this._audioCache).forEach(function (name) {
                _this._audioCache[name].forEach(function (audio) {
                    if (audio.playing) {
                        audio.pause();
                        _this._pausedAudios[uid(audio)] = audio;
                    }
                });
            });
        }
        this._enabled = value;
    };
    SoundManager.prototype._detectSupportedType = function () {
        var aud = new Audio();
        var reg = /maybe|probably/i;
        var mts = {
            mp3: 'audio/mpeg',
            mp4: 'audio/mp4; codecs="mp4a.40.5"',
            wav: 'audio/x-wav',
            ogg: 'audio/ogg; codecs="vorbis"'
        };
        for (var name in mts) {
            this._supportedType[name] = reg.test(aud.canPlayType(mts[name]));
        }
        aud = null;
    };
    return SoundManager;
}());
var Sound = new SoundManager();

exports.Keys = Keys;
exports.Tween = Tween;
exports.Texture = Texture;
exports.Action = Action;
exports.Stage = Stage;
exports.createSprite = createSprite;
exports.EventEmitter = EventEmitter;
exports.UIEvent = UIEvent;
exports.uid = uid;
exports.addArrayItem = addArrayItem;
exports.removeArrayItem = removeArrayItem;
exports.convertColor = convertColor;
exports.SoundManager = SoundManager;
exports.Sound = Sound;
exports.HTMLAudio = HTMLAudio;
exports.WebAudio = WebAudio;
exports.RAD_PER_DEG = RAD_PER_DEG;
exports.Sprite = Sprite;
exports.BMFontLabel = BMFontLabel;
exports.TextLabel = TextLabel;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=canvas2d.js.map
