/**
 * canvas2djs v0.2.3
 * Copyright (c) 2013-present Todd Fon
 * All rights reserved.
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('canvas2d', factory) :
    (global.canvas2d = factory());
}(this, (function () { 'use strict';

function __extends(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var key = '__CANVAS2D_UUID__';
var counter = 0;
function uid(target) {
    if (typeof target[key] === 'undefined') {
        Object.defineProperty(target, key, { value: counter++ });
    }
    return target[key];
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

var Callback = (function () {
    function Callback(func) {
        this.done = false;
        this.immediate = true;
        this.func = func;
    }
    Callback.prototype.step = function () {
        this.func.call(null);
        this.end();
    };
    Callback.prototype.end = function () {
        this.func = null;
        this.done = true;
    };
    return Callback;
}());
var Delay = (function () {
    function Delay(duration) {
        this.done = false;
        this.elapsed = 0;
        this.immediate = true;
        this.duration = duration;
    }
    Delay.prototype.step = function (deltaTime) {
        this.elapsed += deltaTime;
        if (this.elapsed >= this.duration) {
            this.done = true;
        }
    };
    Delay.prototype.end = function () {
    };
    return Delay;
}());
var Transition = (function () {
    function Transition(options, duration, isTransitionBy) {
        this._defaultEasing = Tween.easeInOutQuad;
        this.done = false;
        this.immediate = false;
        this.elapsed = 0;
        this.options = [];
        this.deltaValue = {};
        this.duration = duration;
        this.isTransitionBy = isTransitionBy;
        if (isTransitionBy) {
            this._initAsTransitionBy(options);
        }
        else {
            this._initAsTransitionTo(options);
        }
    }
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
            _this.options.push({ name, dest, easing });
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
            _this.options.push({ name, dest, easing });
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
        var _this = this;
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
            easing = easing || _this._defaultEasing;
            target[name] = beginValue[name] + (easing(percent) * deltaValue[name]);
        });
    };
    Transition.prototype.end = function (target) {
        this.options.forEach(function (attr) {
            target[attr.name] = attr.dest;
        });
        this.beginValue = null;
        this.deltaValue = null;
        this.options = null;
        this.done = true;
    };
    return Transition;
}());
var Animation = (function () {
    function Animation(frameList, frameRate, repetitions) {
        this.done = false;
        this.immediate = false;
        this.elapsed = 0;
        this.count = 0;
        this.frameIndex = 0;
        this.frameList = frameList;
        this.repetitions = repetitions;
        this.interval = 1 / frameRate;
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
        this.frameList = null;
        this.done = true;
    };
    return Animation;
}());
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
            if (action._done) {
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
            removeArrayItem(Action._listenerList, this);
            this._resolved = true;
        }
    };
    return ActionListener;
}());
/**
 * Action manager
 */
var Action = (function () {
    function Action(target) {
        this._queue = [];
        this._done = false;
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
    Action.step = function (deltaTime) {
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
    Action.prototype._step = function (deltaTime) {
        if (!this._queue.length) {
            return;
        }
        var action = this._queue[0];
        action.step(deltaTime, this.target);
        if (action.done) {
            this._queue.shift();
            if (!this._queue.length) {
                this._done = true;
                this.isRunning = false;
                this.target = null;
            }
            else if (action.immediate) {
                this._step(deltaTime);
            }
        }
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
     * @param  attrs     Transition attributes map
     * @param  duration  Transition duration
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
        this._done = true;
        this.isRunning = false;
        this._queue.length = 0;
        removeArrayItem(Action._actionList, this);
    };
    Action._actionList = [];
    Action._listenerList = [];
    return Action;
}());

var prefix = '__CANVAS2D_ONCE__';
/**
 * EventEmitter
 */
var EventEmitter = (function () {
    function EventEmitter() {
    }
    EventEmitter.prototype.addListener = function (type, listener) {
        var id = uid(this);
        if (!EventEmitter._cache[id]) {
            EventEmitter._cache[id] = {};
        }
        if (!EventEmitter._cache[id][type]) {
            EventEmitter._cache[id][type] = [];
        }
        addArrayItem(EventEmitter._cache[id][type], listener);
        return this;
    };
    EventEmitter.prototype.on = function (type, listener) {
        return this.addListener(type, listener);
    };
    EventEmitter.prototype.once = function (type, listener) {
        listener[prefix + uid(this)] = true;
        return this.addListener(type, listener);
    };
    EventEmitter.prototype.removeListener = function (type, listener) {
        var cache = EventEmitter._cache[uid(this)];
        if (cache && cache[type]) {
            removeArrayItem(cache[type], listener);
            if (!cache[type].length) {
                delete cache[type];
            }
        }
        return this;
    };
    EventEmitter.prototype.removeAllListeners = function (type) {
        var id = uid(this);
        var cache = EventEmitter._cache[id];
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
        var cache = EventEmitter._cache[id];
        var onceKey = prefix + id;
        if (cache && cache[type]) {
            cache[type].slice().forEach(function (listener) {
                listener.apply(_this, args);
                if (listener[onceKey]) {
                    _this.removeListener(type, listener);
                    listener[onceKey] = null;
                }
            });
        }
        return this;
    };
    EventEmitter._cache = {};
    return EventEmitter;
}());

var AudioCtx = window['AudioContext'] || window['webkitAudioContext'];
var context = AudioCtx ? new AudioCtx() : null;
/**
 * WebAudio
 */
var WebAudio = (function (_super) {
    __extends(WebAudio, _super);
    function WebAudio(src) {
        _super.call(this);
        this._startTime = 0;
        this.loop = false;
        this.muted = false;
        this.loaded = false;
        this.volume = 1;
        this.playing = false;
        this.autoplay = false;
        this.duration = 0;
        this.currentTime = 0;
        this.src = src;
        this._handleEvent = this._handleEvent.bind(this);
        this._gainNode = context.createGain ? context.createGain() : context['createGainNode']();
        this._gainNode.connect(context.destination);
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
            this.once('load', function () {
                cloned._onDecodeCompleted(_this._buffer);
            });
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
    WebAudio.isSupported = AudioCtx != null;
    WebAudio._initialized = false;
    WebAudio._enabled = false;
    return WebAudio;
}(EventEmitter));
/**
 * HTMLAudio
 */
var HTMLAudio = (function (_super) {
    __extends(HTMLAudio, _super);
    function HTMLAudio(src) {
        _super.call(this);
        this.loop = false;
        this.muted = false;
        this.loaded = false;
        this.volume = 1;
        this.playing = false;
        this.autoplay = false;
        this.duration = 0;
        this.currentTime = 0;
        this.src = src;
        this._handleEvent = this._handleEvent.bind(this);
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
    HTMLAudio.enabled = false;
    return HTMLAudio;
}(EventEmitter));

var enabled = false;
var extension = ".mp3";
var supportedType = {
    mp3: false,
    mp4: false,
    wav: false,
    ogg: false
};
var audioesCache = {};
var pausedAudioes = {};
var Sound = {
    get enabled() {
        return enabled;
    },
    set enabled(value) {
        if (value == enabled) {
            return;
        }
        if (value) {
            WebAudio.enabled = true;
            HTMLAudio.enabled = true;
            if (pausedAudioes) {
                Object.keys(pausedAudioes).forEach(function (id) {
                    pausedAudioes[id].resume();
                });
                pausedAudioes = null;
            }
        }
        else {
            WebAudio.enabled = false;
            HTMLAudio.enabled = false;
            pausedAudioes = {};
            Object.keys(audioesCache).forEach(function (name) {
                audioesCache[name].forEach(function (audio) {
                    if (audio.playing) {
                        audio.pause();
                        pausedAudioes[uid(audio)] = audio;
                    }
                });
            });
        }
        enabled = value;
    },
    get supportedType() {
        return Object.create(supportedType);
    },
    get extension() {
        return extension;
    },
    set extension(value) {
        extension = value;
    },
    get getAudio() {
        return getAudio;
    },
    get _cache() {
        return Object.create(audioesCache);
    },
    /**
     * Load a sound resource
     */
    load: function (basePath, name, onComplete, channels) {
        if (channels === void 0) { channels = 1; }
        var src = basePath + name + extension;
        var audio = WebAudio.isSupported ? new WebAudio(src) : new HTMLAudio(src);
        audio.once('load', function () {
            if (onComplete) {
                onComplete();
            }
            var cloned;
            while (--channels > 0) {
                cloned = audio.clone();
                audioesCache[name].push(cloned);
            }
        });
        audio.once('error', function (e) {
            console.warn("canvas2d.Sound.load() Error: " + src + " could not be loaded.");
            removeArrayItem(audioesCache[name], audio);
        });
        if (!audioesCache[name]) {
            audioesCache[name] = [];
        }
        audioesCache[name].push(audio);
        audio.load();
    },
    /**
     * Load multiple sound resources
     */
    loadList: function (basePath, resources, onAllCompleted, onProgress) {
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
        resources.forEach(function (res) { return Sound.load(basePath, res.name, onCompleted, res.channels); });
    },
    /**
     * Get all audioes by name
     */
    getAllAudioes: function (name) {
        return audioesCache[name] && audioesCache[name].slice();
    },
    /**
     * Play sound by name
     */
    play: function (name, loop) {
        if (loop === void 0) { loop = false; }
        var audio = enabled && getAudio(name);
        if (audio) {
            audio.loop = loop;
            audio.play();
        }
        return audio;
    },
    /**
     * Pause sound by name
     */
    pause: function (name) {
        var list = getAudio(name, true);
        if (list) {
            list.forEach(function (audio) { return audio.pause(); });
        }
    },
    /**
     * Stop sound by name
     */
    stop: function (name) {
        var list = audioesCache[name];
        if (list) {
            list.forEach(function (audio) { return audio.stop(); });
        }
    },
    /**
     * Resume audio by name
     */
    resume: function (name) {
        var list = audioesCache[name];
        if (list) {
            list.forEach(function (audio) { return !audio.playing && audio.currentTime > 0 && audio.resume(); });
        }
    },
};
function getAudio(name, returnList) {
    var list = audioesCache[name];
    if (!list || !list.length) {
        return returnList ? [] : null;
    }
    var i = 0;
    var all = [];
    var audio;
    for (; audio = list[i]; i++) {
        if (!audio.playing) {
            if (!returnList) {
                return audio;
            }
            all.push(audio);
        }
    }
    return all;
}
function detectSupportedType() {
    var aud = new Audio();
    var reg = /maybe|probably/i;
    var mts = {
        mp3: 'audio/mpeg',
        mp4: 'audio/mp4; codecs="mp4a.40.5"',
        wav: 'audio/x-wav',
        ogg: 'audio/ogg; codecs="vorbis"'
    };
    for (var name in mts) {
        supportedType[name] = reg.test(aud.canPlayType(mts[name]));
    }
    aud = null;
}
detectSupportedType();

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
    function Texture(source, rect) {
        this._readyCallbacks = [];
        /**
         * Texture resource loading state
         */
        this.ready = false;
        this.width = 0;
        this.height = 0;
        var name = getName(source, rect);
        if (cache[name]) {
            return cache[name];
        }
        if (typeof source === 'string') {
            this._createByPath(source, rect);
        }
        else if ((source instanceof HTMLImageElement) || (source instanceof HTMLCanvasElement)) {
            this._createByImage(source, rect);
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
    Texture.create = function (source, rect) {
        var name = getName(source, rect);
        if (name && cache[name]) {
            return cache[name];
        }
        return new Texture(source, rect);
    };
    Texture.prototype.onReady = function (callback) {
        if (this.ready) {
            callback({ width: this.width, height: this.height });
        }
        else {
            this._readyCallbacks.push(callback);
        }
    };
    Texture.prototype._createByPath = function (path, rect) {
        var _this = this;
        var img = new Image();
        img.onload = function () {
            _this._createByImage(img, rect);
            if (!loaded[path]) {
                console.log("Loaded: " + path);
            }
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
            console.warn('Texture creating fail, error in loading source "' + path + '"');
        };
        if (!loading[path]) {
            console.log("Start to load: " + path);
        }
        img.src = path;
        loading[path] = true;
    };
    Texture.prototype._createByImage = function (image, rect) {
        if (!rect) {
            rect = {
                x: 0,
                y: 0,
                width: image.width,
                height: image.height
            };
        }
        var source = createCanvas(image, rect);
        this.width = source.width;
        this.height = source.height;
        this.source = source;
        this.ready = true;
    };
    return Texture;
}());
function getName(source, rect) {
    var isStr = typeof source === 'string';
    if (!isStr && !source.src) {
        return null;
    }
    var src = isStr ? source : source.src;
    var str = rect ? [rect.x, rect.y, rect.width, rect.height].join(',') : '';
    return src + str;
}
function createCanvas(image, rect) {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext('2d');
    canvas.width = rect.width;
    canvas.height = rect.height;
    context.drawImage(image, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
    return canvas;
}

var AlignType;
(function (AlignType) {
    AlignType[AlignType["TOP"] = 0] = "TOP";
    AlignType[AlignType["RIGHT"] = 1] = "RIGHT";
    AlignType[AlignType["BOTTOM"] = 2] = "BOTTOM";
    AlignType[AlignType["LEFT"] = 3] = "LEFT";
    AlignType[AlignType["CENTER"] = 4] = "CENTER";
})(AlignType || (AlignType = {}));
var RAD_PER_DEG = Math.PI / 180;
/**
 * Sprite as the base element
 */
var Sprite = (function (_super) {
    __extends(Sprite, _super);
    function Sprite(attrs) {
        _super.call(this);
        this._width = 0;
        this._height = 0;
        this._originX = 0.5;
        this._originY = 0.5;
        this._rotation = 0;
        this._rotationRad = 0;
        this._originPixelX = 0;
        this._originPixelY = 0;
        this.x = 0;
        this.y = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.radius = 0;
        this.opacity = 1;
        this.sourceX = 0;
        this.sourceY = 0;
        this.lighterMode = false;
        this.autoResize = true;
        this.flippedX = false;
        this.flippedY = false;
        this.visible = true;
        this.clipOverflow = false;
        this.touchEnabled = true;
        this.mouseEnabled = true;
        this.keyboardEnabled = true;
        this.id = uid(this);
        this._init(attrs);
    }
    Sprite.prototype._init = function (attrs) {
        var _this = this;
        if (attrs) {
            Object.keys(attrs).forEach(function (name) { return _this[name] = attrs[name]; });
        }
        this.init();
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
            this.adjustAlignX();
            this.children && this.children.forEach(function (sprite) { return sprite.adjustAlignX(); });
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
            this.adjustAlignY();
            this.children && this.children.forEach(function (sprite) { return sprite.adjustAlignY(); });
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
            this.adjustAlignX();
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
            this.adjustAlignY();
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
            if (sprite) {
                this.adjustAlignX();
                this.adjustAlignY();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "alignX", {
        get: function () {
            return this._alignX;
        },
        set: function (value) {
            if (this._alignX === value || value === AlignType.BOTTOM || value === AlignType.TOP) {
                return;
            }
            this._alignX = value;
            this.adjustAlignX();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "alignY", {
        get: function () {
            return this._alignY;
        },
        set: function (value) {
            if (this._alignY === value || value === AlignType.LEFT || value === AlignType.RIGHT) {
                return;
            }
            this._alignY = value;
            this.adjustAlignY();
        },
        enumerable: true,
        configurable: true
    });
    Sprite.prototype._update = function (deltaTime) {
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
        this._visitAllChildren(context);
        context.restore();
    };
    Sprite.prototype.adjustAlignX = function () {
        if (!this.parent || this._alignX == null) {
            return;
        }
        var x;
        var ox = this._originPixelX;
        switch (this._alignX) {
            case AlignType.LEFT:
                x = ox;
                break;
            case AlignType.RIGHT:
                x = this.parent.width - (this.width - ox);
                break;
            case AlignType.CENTER:
                x = this.parent.width * 0.5 + ox - this.width * 0.5;
                break;
        }
        if (x != null) {
            this.x = x;
        }
    };
    Sprite.prototype.adjustAlignY = function () {
        if (!this.parent || this._alignY == null) {
            return;
        }
        var y;
        var oy = this._originPixelY;
        switch (this._alignY) {
            case AlignType.TOP:
                y = oy;
                break;
            case AlignType.BOTTOM:
                y = this.parent.height - (this.height - oy);
                break;
            case AlignType.CENTER:
                y = this.parent.height * 0.5 + oy - this.height * 0.5;
                break;
        }
        if (y != null) {
            this.y = y;
        }
    };
    Sprite.prototype._visitAllChildren = function (context) {
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
        if (typeof this.bgColor === 'string') {
            context.fillStyle = this.bgColor;
            context.beginPath();
            if (this.radius > 0) {
                context.arc(0, 0, this.radius, 0, Math.PI * 2, true);
            }
            else {
                context.rect(-this._originPixelX, -this._originPixelY, this._width, this._height);
            }
            context.closePath();
            context.fill();
        }
    };
    Sprite.prototype._drawBorder = function (context) {
        if (this.border) {
            context.lineWidth = this.border.width;
            context.strokeStyle = this.border.color;
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
        if (texture && texture.ready && texture.width !== 0 && texture.height !== 0) {
            var sx = this.sourceX;
            var sy = this.sourceY;
            var sw = this.sourceWidth == null ? texture.width : this.sourceWidth;
            var sh = this.sourceHeight == null ? texture.height : this.sourceHeight;
            context.drawImage(texture.source, sx, sy, sw, sh, -this._originPixelX, -this._originPixelY, this.width, this.height);
        }
    };
    Sprite.prototype.addChild = function (target, position) {
        if (target.parent) {
            throw new Error("Sprite has been added");
        }
        if (!this.children) {
            this.children = [];
        }
        var children = this.children;
        if (children.indexOf(target) === -1) {
            if (position > -1 && position < children.length) {
                children.splice(position, 0, target);
            }
            else {
                children.push(target);
            }
            target.parent = this;
        }
    };
    Sprite.prototype.removeChild = function (target) {
        if (!this.children || !this.children.length) {
            return;
        }
        var index = this.children.indexOf(target);
        if (index > -1) {
            this.children.splice(index, 1);
            target.parent = null;
        }
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
        addToReleasePool(this);
    };
    Sprite.prototype.init = function () {
    };
    Sprite.prototype.update = function (deltaTime) {
    };
    return Sprite;
}(EventEmitter));
var releaseSpritePool = [];
var timerId;
function addToReleasePool(sprite) {
    releaseSpritePool.push(sprite);
    if (timerId != null) {
        return;
    }
    setTimeout(function () {
        releaseSpritePool.forEach(function (e) {
            for (var i in e) {
                delete e[i];
            }
        });
        timerId = null;
        releaseSpritePool.length = 0;
    }, 0);
}

var keyDown = "keydown";
var keyUp = "keyup";
var touchBegin = "touchstart";
var touchMoved = "touchmove";
var touchEnded = "touchend";
var mouseBegin = "mousedown";
var mouseMoved = "mousemove";
var mouseEnded = "mouseup";
var onclick = "onclick";
var onkeyup = "onkeyup";
var onkeydown = "onkeydown";
var ontouchbegin = "ontouchbegin";
var ontouchmoved = "ontouchmoved";
var ontouchended = "ontouchended";
var onmousebegin = "onmousebegin";
var onmousemoved = "onmousemoved";
var onmouseended = "onmouseended";
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
            _this._dispatchTouch(stage.sprite, 0, 0, helpers.slice(), event, ontouchbegin);
            helpers.forEach(function (touch) {
                touch.beginTarget = touch.target;
            });
            event.preventDefault();
        };
        this._touchMovedHandler = function (event) {
            var stage = _this.stage;
            if (!stage.isRunning || !stage.touchEnabled) {
                return;
            }
            var helpers = _this._transformTouches(event.changedTouches);
            _this._dispatchTouch(stage.sprite, 0, 0, helpers, event, ontouchmoved);
            event.preventDefault();
        };
        this._touchEndedHandler = function (event) {
            var stage = _this.stage;
            if (stage.isRunning && stage.touchEnabled) {
                var helpers = _this._transformTouches(event.changedTouches, true);
                _this._dispatchTouch(stage.sprite, 0, 0, helpers.slice(), event, ontouchended, true);
                helpers.forEach(function (helper) {
                    // target = helper.target;
                    // if (hasImplements(target, ontouchended)) {
                    //     target[ontouchended](helper, helpers, event);
                    // }
                    // if (hasImplements(target, onclick) && target === helper.beginTarget && (!helper._moved || isMovedSmallRange(helper))) {
                    //     target[onclick](helper, event);
                    // }
                    helper.target = null;
                    helper.beginTarget = null;
                    _this._touchHelperMap[helper.identifier] = null;
                });
                helpers = null;
            }
        };
        this._mouseBeginHandler = function (event) {
            var stage = _this.stage;
            if (!stage.isRunning || !stage.mouseEnabled) {
                return;
            }
            var location = _this.transformLocation(event);
            var helper = {
                beginX: location.x,
                beginY: location.y,
                stageX: location.x,
                stageY: location.y,
                cancelBubble: false
            };
            _this._dispatchMouse(stage.sprite, 0, 0, helper, event, onmousebegin);
            if (helper.target) {
                helper.beginTarget = helper.target;
                _this._mouseBeginHelper = helper;
            }
            event.preventDefault();
        };
        this._mouseMovedHandler = function (event) {
            var stage = _this.stage;
            if (!stage.isRunning || !stage.mouseEnabled) {
                return;
            }
            var location = _this.transformLocation(event);
            var mouseBeginHelper = _this._mouseBeginHelper;
            if (mouseBeginHelper) {
                mouseBeginHelper.stageX = location.x;
                mouseBeginHelper.stageY = location.y;
                mouseBeginHelper._moved = mouseBeginHelper.beginX - location.x !== 0 || mouseBeginHelper.beginY - location.y !== 0;
                _this._dispatchMouse(stage.sprite, 0, 0, mouseBeginHelper, event, onmousemoved);
            }
            else {
                var mouseMovedHelper = _this._mouseMovedHelper = {
                    beginX: null,
                    beginY: null,
                    stageX: location.x,
                    stageY: location.y,
                    cancelBubble: false
                };
                _this._dispatchMouse(stage.sprite, 0, 0, mouseMovedHelper, event, onmousemoved);
            }
            event.preventDefault();
        };
        this._mouseEndedHandler = function (event) {
            var stage = _this.stage;
            if (stage.isRunning && stage.mouseEnabled) {
                var location = _this.transformLocation(event);
                var helper = _this._mouseBeginHelper || _this._mouseMovedHelper;
                var target;
                helper.stageX = location.x;
                helper.stageY = location.y;
                target = helper.target;
                // if (hasImplements(target, ON_MOUSE_ENDED)) {
                //     target[ON_MOUSE_ENDED](helper, event);
                // }
                var triggerClick = !helper._moved || isMovedSmallRange(helper);
                _this._dispatchMouse(stage.sprite, 0, 0, helper, event, onmouseended, triggerClick);
            }
            _this._mouseBeginHelper = helper.target = helper.beginTarget = null;
        };
        this._keyDownHandler = function (event) {
            var stage = _this.stage;
            if (!stage.isRunning || !stage.keyboardEnabled) {
                return;
            }
            _this._dispatchKeyboard(stage.sprite, event.keyCode, event, onkeydown);
        };
        this._keyUpHandler = function (event) {
            var stage = _this.stage;
            if (!stage.isRunning || !stage.keyboardEnabled) {
                return;
            }
            _this._dispatchKeyboard(stage.sprite, event.keyCode, event, onkeyup);
        };
        this.stage = stage;
        this.element = stage.canvas;
    }
    UIEvent.prototype.register = function () {
        if (this._registered) {
            return;
        }
        var _a = this, stage = _a.stage, element = _a.element;
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
    };
    UIEvent.prototype.unregister = function () {
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
    };
    UIEvent.prototype.transformLocation = function (event) {
        var clientReact = this.element.getBoundingClientRect();
        var scale = this.stage.scale;
        var x = (event.clientX - clientReact.left) / scale;
        var y = (event.clientY - clientReact.top) / scale;
        return { x, y };
    };
    UIEvent.prototype._transformTouches = function (touches, justGet) {
        var helpers = [];
        var rect = this.element.getBoundingClientRect();
        var scale = this.stage.scale;
        var touchHelperMap = this._touchHelperMap;
        for (var i = 0, x, y, id, helper, touch; touch = touches[i]; i++) {
            id = touch.identifier;
            x = (touch.clientX - rect.left) / scale;
            y = (touch.clientY - rect.top) / scale;
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
    };
    UIEvent.prototype._dispatchTouch = function (sprite, offsetX, offsetY, helpers, event, methodName, needTriggerClick) {
        if (sprite.touchEnabled === false || !sprite.visible) {
            return;
        }
        offsetX += sprite.x - sprite._originPixelX;
        offsetY += sprite.y - sprite._originPixelY;
        var children = sprite.children;
        var tmpHelpers = helpers.slice();
        var triggerreds = [];
        var result;
        var callback = function (helper) { return result.indexOf(helper) === -1; };
        if (children && children.length) {
            var index = children.length;
            while (--index >= 0) {
                result = this._dispatchTouch(children[index], offsetX, offsetY, tmpHelpers, event, methodName, needTriggerClick);
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
        var count = 0;
        for (var i = 0, helper = void 0; helper = tmpHelpers[i]; i++) {
            if (isRectContainPoint(rect, helper)) {
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
            var hasMethod = hasImplements(sprite, methodName);
            var hasClickHandler = hasImplements(sprite, onclick);
            if (hasMethod) {
                sprite[methodName](hits, event);
                triggerreds.push.apply(triggerreds, hits.slice(hits.length - count, count));
            }
            // Click event would just trigger by only a touch
            if (hasClickHandler && needTriggerClick && hits.length === 1 && (!hits[0]._moved || isMovedSmallRange(hits[0]))) {
                sprite[onclick](hits[0], event);
                addArrayItem(triggerreds, hits[0]);
            }
        }
        return triggerreds;
    };
    UIEvent.prototype._dispatchMouse = function (sprite, offsetX, offsetY, helper, event, methodName, triggerClick) {
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
        var rect = {
            x: offsetX,
            y: offsetY,
            width: sprite.width,
            height: sprite.height
        };
        if (triggerred || isRectContainPoint(rect, helper)) {
            var hasMethod = hasImplements(sprite, methodName);
            var hasClickHandler = hasImplements(sprite, onclick);
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
    };
    UIEvent.prototype._dispatchKeyboard = function (sprite, keyCode, event, methodName) {
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
    };
    UIEvent.supportTouch = "ontouchend" in window;
    return UIEvent;
}());
function isRectContainPoint(rect, p) {
    return rect.x <= p.stageX && rect.x + rect.width >= p.stageX &&
        rect.y <= p.stageY && rect.y + rect.height >= p.stageY;
}
function isMovedSmallRange(e) {
    if (e.beginX == null && e.beginY == null) {
        return false;
    }
    var x = Math.abs(e.beginX - e.stageX);
    var y = Math.abs(e.beginY - e.stageY);
    return x <= 5 && y <= 5;
}
function hasImplements(sprite, methodName) {
    return sprite[methodName] !== Sprite.prototype[methodName] && typeof sprite[methodName] === 'function';
}

var AlignType$1;
(function (AlignType) {
    AlignType[AlignType["TOP"] = 0] = "TOP";
    AlignType[AlignType["RIGHT"] = 1] = "RIGHT";
    AlignType[AlignType["BOTTOM"] = 2] = "BOTTOM";
    AlignType[AlignType["LEFT"] = 3] = "LEFT";
    AlignType[AlignType["CENTER"] = 4] = "CENTER";
})(AlignType$1 || (AlignType$1 = {}));
var RAD_PER_DEG$1 = Math.PI / 180;
/**
 * Sprite as the base element
 */
var Sprite$2 = (function (_super) {
    __extends(Sprite, _super);
    function Sprite(attrs) {
        _super.call(this);
        this._width = 0;
        this._height = 0;
        this._originX = 0.5;
        this._originY = 0.5;
        this._rotation = 0;
        this._rotationRad = 0;
        this._originPixelX = 0;
        this._originPixelY = 0;
        this.x = 0;
        this.y = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.radius = 0;
        this.opacity = 1;
        this.sourceX = 0;
        this.sourceY = 0;
        this.lighterMode = false;
        this.autoResize = true;
        this.flippedX = false;
        this.flippedY = false;
        this.visible = true;
        this.clipOverflow = false;
        this.touchEnabled = true;
        this.mouseEnabled = true;
        this.keyboardEnabled = true;
        this.id = uid(this);
        this._init(attrs);
    }
    Sprite.prototype._init = function (attrs) {
        var _this = this;
        if (attrs) {
            Object.keys(attrs).forEach(function (name) { return _this[name] = attrs[name]; });
        }
        this.init();
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
            this.adjustAlignX();
            this.children && this.children.forEach(function (sprite) { return sprite.adjustAlignX(); });
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
            this.adjustAlignY();
            this.children && this.children.forEach(function (sprite) { return sprite.adjustAlignY(); });
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
            this.adjustAlignX();
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
            this.adjustAlignY();
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
            this._rotationRad = this._rotation * RAD_PER_DEG$1;
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
            if (sprite) {
                this.adjustAlignX();
                this.adjustAlignY();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "alignX", {
        get: function () {
            return this._alignX;
        },
        set: function (value) {
            if (this._alignX === value || value === AlignType$1.BOTTOM || value === AlignType$1.TOP) {
                return;
            }
            this._alignX = value;
            this.adjustAlignX();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "alignY", {
        get: function () {
            return this._alignY;
        },
        set: function (value) {
            if (this._alignY === value || value === AlignType$1.LEFT || value === AlignType$1.RIGHT) {
                return;
            }
            this._alignY = value;
            this.adjustAlignY();
        },
        enumerable: true,
        configurable: true
    });
    Sprite.prototype._update = function (deltaTime) {
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
        this._visitAllChildren(context);
        context.restore();
    };
    Sprite.prototype.adjustAlignX = function () {
        if (!this.parent || this._alignX == null) {
            return;
        }
        var x;
        var ox = this._originPixelX;
        switch (this._alignX) {
            case AlignType$1.LEFT:
                x = ox;
                break;
            case AlignType$1.RIGHT:
                x = this.parent.width - (this.width - ox);
                break;
            case AlignType$1.CENTER:
                x = this.parent.width * 0.5 + ox - this.width * 0.5;
                break;
        }
        if (x != null) {
            this.x = x;
        }
    };
    Sprite.prototype.adjustAlignY = function () {
        if (!this.parent || this._alignY == null) {
            return;
        }
        var y;
        var oy = this._originPixelY;
        switch (this._alignY) {
            case AlignType$1.TOP:
                y = oy;
                break;
            case AlignType$1.BOTTOM:
                y = this.parent.height - (this.height - oy);
                break;
            case AlignType$1.CENTER:
                y = this.parent.height * 0.5 + oy - this.height * 0.5;
                break;
        }
        if (y != null) {
            this.y = y;
        }
    };
    Sprite.prototype._visitAllChildren = function (context) {
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
        if (typeof this.bgColor === 'string') {
            context.fillStyle = this.bgColor;
            context.beginPath();
            if (this.radius > 0) {
                context.arc(0, 0, this.radius, 0, Math.PI * 2, true);
            }
            else {
                context.rect(-this._originPixelX, -this._originPixelY, this._width, this._height);
            }
            context.closePath();
            context.fill();
        }
    };
    Sprite.prototype._drawBorder = function (context) {
        if (this.border) {
            context.lineWidth = this.border.width;
            context.strokeStyle = this.border.color;
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
        if (texture && texture.ready && texture.width !== 0 && texture.height !== 0) {
            var sx = this.sourceX;
            var sy = this.sourceY;
            var sw = this.sourceWidth == null ? texture.width : this.sourceWidth;
            var sh = this.sourceHeight == null ? texture.height : this.sourceHeight;
            context.drawImage(texture.source, sx, sy, sw, sh, -this._originPixelX, -this._originPixelY, this.width, this.height);
        }
    };
    Sprite.prototype.addChild = function (target, position) {
        if (target.parent) {
            throw new Error("Sprite has been added");
        }
        if (!this.children) {
            this.children = [];
        }
        var children = this.children;
        if (children.indexOf(target) === -1) {
            if (position > -1 && position < children.length) {
                children.splice(position, 0, target);
            }
            else {
                children.push(target);
            }
            target.parent = this;
        }
    };
    Sprite.prototype.removeChild = function (target) {
        if (!this.children || !this.children.length) {
            return;
        }
        var index = this.children.indexOf(target);
        if (index > -1) {
            this.children.splice(index, 1);
            target.parent = null;
        }
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
        addToReleasePool$1(this);
    };
    Sprite.prototype.init = function () {
    };
    Sprite.prototype.update = function (deltaTime) {
    };
    return Sprite;
}(EventEmitter));
var releaseSpritePool$1 = [];
var timerId$1;
function addToReleasePool$1(sprite) {
    releaseSpritePool$1.push(sprite);
    if (timerId$1 != null) {
        return;
    }
    setTimeout(function () {
        releaseSpritePool$1.forEach(function (e) {
            for (var i in e) {
                delete e[i];
            }
        });
        timerId$1 = null;
        releaseSpritePool$1.length = 0;
    }, 0);
}

var measureContext = document.createElement("canvas").getContext("2d");
var regEnter = /\n/;
var TextLabel = (function (_super) {
    __extends(TextLabel, _super);
    function TextLabel(attrs) {
        _super.call(this);
        this.fontName = 'sans-serif';
        this.textAlign = 'center';
        this.fontColor = '#000';
        this.fontSize = 20;
        this.fontWeight = 'normal';
        this.fontStyle = 'normal';
        this.lineSpace = 5;
        this._text = '';
        _super.prototype._init.call(this, attrs);
    }
    TextLabel.prototype._init = function (attrs) {
    };
    Object.defineProperty(TextLabel.prototype, "text", {
        get: function () {
            return this._text;
        },
        set: function (content) {
            if (this._text !== content) {
                this._text = content;
                if (this.autoResize) {
                    this._resize();
                }
                else {
                    this._lines = content.split(regEnter);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    TextLabel.prototype._resize = function () {
        this._lines = this._text.split(regEnter);
        var width = 0;
        var height = 0;
        var fontSize = this.fontSize;
        var lineSpace = this.lineSpace;
        measureContext.save();
        measureContext.font = this.fontStyle + ' ' + this.fontWeight + ' ' + fontSize + 'px ' + this.fontName;
        this._lines.forEach(function (text, i) {
            width = Math.max(width, measureContext.measureText(text).width);
            height = lineSpace * i + fontSize * (i + 1);
        });
        measureContext.restore();
        this.width = width;
        this.height = height;
    };
    TextLabel.prototype.addChild = function () {
        throw new Error("TextLabel cannot not have children");
    };
    TextLabel.prototype.removeChild = function () {
        throw new Error("TextLabel has no child");
    };
    TextLabel.prototype.draw = function (context) {
        var _this = this;
        this._drawBgColor(context);
        this._drawBorder(context);
        if (this._text.length === 0) {
            return;
        }
        context.font = this.fontStyle + ' ' + this.fontWeight + ' ' + this.fontSize + 'px ' + this.fontName;
        context.fillStyle = this.fontColor;
        context.textAlign = this.textAlign;
        context.textBaseline = 'middle';
        context.lineJoin = 'round';
        if (this.stroke) {
            context.strokeStyle = this.stroke.color;
            context.lineWidth = this.stroke.width * 2;
        }
        var y = 0;
        var h = this.fontSize + this.lineSpace;
        this._lines.forEach(function (text) {
            if (text.length > 0) {
                if (_this.stroke) {
                    context.strokeText(text, 0, y, 0xffff);
                }
                context.fillText(text, 0, y, 0xffff);
            }
            y += h;
        });
    };
    return TextLabel;
}(Sprite$2));

var BMFontLabel = (function (_super) {
    __extends(BMFontLabel, _super);
    function BMFontLabel(attrs) {
        _super.call(this, attrs);
    }
    Object.defineProperty(BMFontLabel.prototype, "text", {
        get: function () {
            return this._text;
        },
        set: function (text) {
            if (text === this._text) {
                return;
            }
            this.setText(text);
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
            this.setText(this._text);
        },
        enumerable: true,
        configurable: true
    });
    BMFontLabel.prototype.setText = function (text) {
        var _this = this;
        this._text = text || '';
        if (!this.textureMap || !this._text) {
            return;
        }
        var words = this._text.split('');
        if (!words.length) {
            this._words.length = 0;
        }
        else {
            this._words = words.map(function (word) {
                if (!_this._textureMap[word]) {
                    console.error(word + ': texture of the word not found');
                }
                return _this._textureMap[word];
            });
        }
        this.removeAllChildren();
        if (this._words && this._words.length) {
            this._words.forEach(function (word, i) {
                if (!word) {
                    return;
                }
                _super.prototype.addChild.call(_this, new Sprite({
                    x: i * word.width,
                    texture: word,
                    originX: 0,
                    originY: 0
                }));
            });
            this.width = this._words.length * this._words[0].width;
            this.height = this._words[0].height;
        }
    };
    BMFontLabel.prototype.addChild = function () {
        throw new Error('BMFontLabel:addChild is not callable!');
    };
    return BMFontLabel;
}(Sprite));

var ScaleMode;
(function (ScaleMode) {
    ScaleMode[ScaleMode["SHOW_ALL"] = 0] = "SHOW_ALL";
    ScaleMode[ScaleMode["NO_BORDER"] = 1] = "NO_BORDER";
    ScaleMode[ScaleMode["FIX_WIDTH"] = 2] = "FIX_WIDTH";
    ScaleMode[ScaleMode["FIX_HEIGHT"] = 3] = "FIX_HEIGHT";
})(ScaleMode || (ScaleMode = {}));
var Stage = (function () {
    /**
     * @param  canvas     Canvas element
     * @param  width      Resolution design width
     * @param  height     Resolution design height
     * @param  scaleMode  Adjust resolution design scale mode
     */
    function Stage(canvas, width, height, scaleMode, autoAdjustCanvasSize) {
        var _this = this;
        this._fps = 30;
        this._frameRate = 1000 / this._fps;
        this._width = 0;
        this._height = 0;
        this.adjustCanvasSize = function () {
            var canvasElement = _this._canvasElement;
            var stageWidth = _this._width;
            var stageHeight = _this._height;
            var currentScaleMode = _this._scaleMode;
            var visibleRect = _this._visibleRect;
            if (!canvasElement || !canvasElement.parentNode) {
                return;
            }
            var style = canvasElement.style;
            var container = {
                width: canvasElement.parentElement.offsetWidth,
                height: canvasElement.parentElement.offsetHeight
            };
            var scaleX = container.width / stageWidth;
            var scaleY = container.height / stageHeight;
            var deltaWidth = 0;
            var deltaHeight = 0;
            var scale;
            var width;
            var height;
            switch (currentScaleMode) {
                case ScaleMode.SHOW_ALL:
                    if (scaleX < scaleY) {
                        scale = scaleX;
                        width = container.width;
                        height = scale * stageHeight;
                    }
                    else {
                        scale = scaleY;
                        width = scale * stageWidth;
                        height = container.height;
                    }
                    break;
                case ScaleMode.NO_BORDER:
                    scale = scaleX > scaleY ? scaleX : scaleY;
                    width = stageWidth * scale;
                    height = stageHeight * scale;
                    deltaWidth = (stageWidth - container.width / scale) * 0.5 | 0;
                    deltaHeight = (stageHeight - container.height / scale) * 0.5 | 0;
                    break;
                case ScaleMode.FIX_WIDTH:
                    scale = scaleX;
                    width = container.width;
                    height = container.height * scale;
                    deltaHeight = (stageHeight - container.height / scale) * 0.5 | 0;
                    break;
                case ScaleMode.FIX_HEIGHT:
                    scale = scaleY;
                    width = scale * container.width;
                    height = container.height;
                    deltaWidth = (stageWidth - container.width / scale) * 0.5 | 0;
                    break;
                default:
                    throw new Error("Unknow stage scale mode \"" + currentScaleMode + "\"");
            }
            style.width = width + 'px';
            style.height = height + 'px';
            style.top = ((container.height - height) * 0.5) + 'px';
            style.left = ((container.width - width) * 0.5) + 'px';
            style.position = 'absolute';
            visibleRect.left = deltaWidth;
            visibleRect.right = stageWidth - deltaWidth;
            visibleRect.top = deltaHeight;
            visibleRect.bottom = stageHeight - deltaHeight;
            _this._canvasScale = scale;
        };
        this._rootSprite = new Sprite({
            x: width * 0.5,
            y: height * 0.5,
            width: width,
            height: height
        });
        this._scaleMode = scaleMode;
        this._canvasElement = canvas;
        this._renderContext = canvas.getContext('2d');
        this._bufferCanvas = document.createElement("canvas");
        this._bufferContext = this._bufferCanvas.getContext("2d");
        this._width = canvas.width = this._bufferCanvas.width = width;
        this._height = canvas.height = this._bufferCanvas.height = height;
        this._visibleRect = { left: 0, right: width, top: 0, bottom: height };
        this.autoAdjustCanvasSize = autoAdjustCanvasSize;
        this._uiEvent = new UIEvent(this);
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
            return this._canvasElement;
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
            return this._rootSprite;
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
    Object.defineProperty(Stage.prototype, "scale", {
        get: function () {
            return this._canvasScale;
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
        this._rootSprite._update(deltaTime);
    };
    Stage.prototype.stop = function (unregisterUIEvent) {
        if (!this._isRunning) {
            return;
        }
        if (unregisterUIEvent) {
            this._uiEvent.unregister();
        }
        this._isRunning = false;
        clearTimeout(this._eventLoopTimerId);
    };
    Stage.prototype.render = function () {
        if (!this._isRunning) {
            return;
        }
        var _a = this._canvasElement, width = _a.width, height = _a.height;
        this._bufferContext.clearRect(0, 0, width, height);
        this._rootSprite._visit(this._bufferContext);
        this._renderContext.clearRect(0, 0, width, height);
        this._renderContext.drawImage(this._bufferCanvas, 0, 0, width, height);
    };
    /**
     * Add sprite to the stage
     */
    Stage.prototype.addChild = function (child, position) {
        this._rootSprite.addChild(child, position);
    };
    /**
     * Remove sprite from the stage
     */
    Stage.prototype.removeChild = function (child) {
        this._rootSprite.removeChild(child);
    };
    /**
     * Remove all sprites from the stage
     * @param  recusive  Recusize remove all the children
     */
    Stage.prototype.removeAllChildren = function (recusive) {
        this._rootSprite.removeAllChildren(recusive);
    };
    Stage.prototype.release = function () {
        this.stop(true);
        this._rootSprite.release(true);
        this._rootSprite = this._uiEvent = this._canvasElement = this._renderContext = this._bufferCanvas = this._bufferContext = null;
    };
    Stage.prototype._startTimer = function () {
        var _this = this;
        this._eventLoopTimerId = setTimeout(function () {
            if (_this._useExternalTimer) {
                return;
            }
            var deltaTime = _this._getDeltaTime();
            Action.step(deltaTime);
            _this._rootSprite._update(deltaTime);
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
}());

var canvas2d = {
    Util: {
        uid: uid,
        addArrayItem: addArrayItem,
        removeArrayItem: removeArrayItem
    },
    Keys: Keys,
    Tween: Tween,
    Action: Action,
    EventEmitter: EventEmitter,
    HTMLAudio: HTMLAudio,
    WebAudio: WebAudio,
    Sound: Sound,
    Texture: Texture,
    UIEvent: UIEvent,
    Sprite: Sprite,
    TextLabel: TextLabel,
    BMFontLabel: BMFontLabel,
    Stage: Stage,
    AlignType: AlignType,
    RAD_PER_DEG: RAD_PER_DEG,
    ScaleMode: ScaleMode,
};

return canvas2d;

})));
//# sourceMappingURL=canvas2d.js.map
