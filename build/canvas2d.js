var canvas2d;
(function (canvas2d) {
    var util;
    (function (util) {
        var uuidKey = '__CANVAS2D_UUID__';
        var uuidCounter = 0;
        function uuid(target) {
            if (typeof target[uuidKey] === 'undefined') {
                target[uuidKey] = uuidCounter++;
            }
            return target[uuidKey];
        }
        util.uuid = uuid;
        function addArrayItem(array, item) {
            if (array.indexOf(item) === -1) {
                array.push(item);
            }
        }
        util.addArrayItem = addArrayItem;
        function removeArrayItem(array, item) {
            var index = array.indexOf(item);
            if (index > -1) {
                array.splice(index, 1);
            }
        }
        util.removeArrayItem = removeArrayItem;
    })(util = canvas2d.util || (canvas2d.util = {}));
})(canvas2d || (canvas2d = {}));
var canvas2d;
(function (canvas2d) {
    canvas2d.Tween = {
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
})(canvas2d || (canvas2d = {}));
/// <reference path="util.ts" />
/// <reference path="tween.ts" />
var canvas2d;
(function (canvas2d) {
    var Callback = (function () {
        function Callback(func) {
            this.func = func;
            this.done = false;
            this.immediate = true;
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
    })();
    var Delay = (function () {
        function Delay(duration) {
            this.duration = duration;
            this.done = false;
            this.elapsed = 0;
            this.immediate = true;
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
    })();
    var Transition = (function () {
        function Transition(options, duration, isTransitionBy) {
            this.duration = duration;
            this.isTransitionBy = isTransitionBy;
            this._defaultEasing = canvas2d.Tween.easeInOutQuad;
            this.done = false;
            this.immediate = false;
            this.elapsed = 0;
            this.options = [];
            this.deltaValue = {};
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
    })();
    var Animation = (function () {
        function Animation(frameList, frameRate, repetitions) {
            this.frameList = frameList;
            this.repetitions = repetitions;
            this.done = false;
            this.immediate = false;
            this.elapsed = 0;
            this.count = 0;
            this.frameIndex = 0;
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
    })();
    var Listener = (function () {
        function Listener(_actions) {
            this._actions = _actions;
            this._resolved = false;
            this._callbacks = {};
        }
        Listener.prototype.all = function (callback) {
            if (this._resolved) {
                callback();
            }
            else {
                if (!this._callbacks.all) {
                    this._callbacks.all = [];
                }
                canvas2d.util.addArrayItem(this._callbacks.all, callback);
            }
            return this;
        };
        Listener.prototype.any = function (callback) {
            if (this._resolved) {
                callback();
            }
            else {
                if (!this._callbacks.any) {
                    this._callbacks.any = [];
                }
                canvas2d.util.addArrayItem(this._callbacks.any, callback);
            }
            return this;
        };
        Listener.prototype._step = function () {
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
                canvas2d.util.removeArrayItem(Action._listenerList, this);
                this._resolved = true;
            }
        };
        return Listener;
    })();
    canvas2d.Listener = Listener;
    /**
     * Action manager
     */
    var Action = (function () {
        function Action(target) {
            this.target = target;
            this._queue = [];
            this._done = false;
            /**
             * Action running state
             */
            this.running = false;
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
            var listener = new Listener(actions);
            Action._listenerList.push(listener);
            return listener;
        };
        Action.step = function (deltaTime) {
            Action._actionList.slice().forEach(function (action) {
                action._step(deltaTime);
                if (action._done) {
                    canvas2d.util.removeArrayItem(Action._actionList, action);
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
                    this.running = false;
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
            if (!this.running) {
                canvas2d.util.addArrayItem(Action._actionList, this);
                this.running = true;
            }
            return this;
        };
        /**
         * Stop the action
         */
        Action.prototype.stop = function () {
            this._done = true;
            this.running = false;
            this._queue.length = 0;
            canvas2d.util.removeArrayItem(Action._actionList, this);
        };
        Action._actionList = [];
        Action._listenerList = [];
        return Action;
    })();
    canvas2d.Action = Action;
})(canvas2d || (canvas2d = {}));
/**
 * Simple sound manager
 */
var canvas2d;
(function (canvas2d) {
    var Sound;
    (function (Sound) {
        var audios = {};
        /**
         * Could play sound
         */
        Sound.enabled = true;
        /**
         * Extension for media type
         */
        Sound.extension = ".mp3";
        /**
         *  Supported types of the browser
         */
        Sound.supportedType = {};
        /**
         * Load a sound resource
         */
        function load(basePath, name, onComplete, channels) {
            if (channels === void 0) { channels = 1; }
            var path = basePath + name + Sound.extension;
            var audio = document.createElement("audio");
            function onCanPlayThrough() {
                this.removeEventListener('canplaythrough', onCanPlayThrough, false);
                if (onComplete) {
                    onComplete();
                }
                var clone;
                while (--channels > 0) {
                    clone = audio.cloneNode(true);
                    audios[name].push(clone);
                }
                console.log("Loaded: " + path);
            }
            function onError(e) {
                console.warn("Error: " + path + " could not be loaded.");
                audios[name] = null;
            }
            audio.addEventListener('canplaythrough', onCanPlayThrough, false);
            audio.addEventListener('error', onError, false);
            audio['preload'] = "auto";
            audio['autobuffer'] = true;
            audio.setAttribute('src', path);
            audio.load();
            audios[name] = [audio];
            console.log("Start to load: ", path);
        }
        Sound.load = load;
        /**
         * Load multiple sound resources
         */
        function loadList(basePath, resList, onAllCompleted, onProgress) {
            var allCount = resList.length;
            var endedCount = 0;
            var onCompleted = function () {
                ++endedCount;
                if (onProgress) {
                    onProgress(endedCount / allCount);
                }
                if (endedCount === allCount && onAllCompleted) {
                    onAllCompleted();
                }
            };
            resList.forEach(function (res) {
                load(basePath, res.name, onCompleted, res.channels);
            });
        }
        Sound.loadList = loadList;
        function getPausedAudio(name, isGetAll) {
            var list = audios[name];
            if (!list || !list.length) {
                return null;
            }
            var i = 0;
            var all = [];
            var audio;
            for (; audio = list[i]; i++) {
                if (audio.ended || audio.paused) {
                    if (audio.ended) {
                        audio.currentTime = 0;
                    }
                    if (!isGetAll) {
                        return audio;
                    }
                    all.push(audio);
                }
            }
            return all;
        }
        Sound.getPausedAudio = getPausedAudio;
        function getPlayingAudio(name, isGetAll) {
            var list = audios[name];
            if (!list || !list.length) {
                return null;
            }
            var i = 0;
            var all = [];
            var audio;
            for (; audio = list[i]; i++) {
                if (!audio.paused) {
                    if (!isGetAll) {
                        return audio;
                    }
                    all.push(audio);
                }
            }
            return all;
        }
        Sound.getPlayingAudio = getPlayingAudio;
        /**
         * Get audio list
         */
        function getAudioListByName(name) {
            return audios[name].slice();
        }
        Sound.getAudioListByName = getAudioListByName;
        /**
         * Play sound by name
         */
        function play(name, loop) {
            var audio = Sound.enabled && getPausedAudio(name);
            if (audio) {
                if (loop) {
                    audio.loop = true;
                    audio.addEventListener("ended", replay, false);
                }
                else {
                    audio.loop = false;
                    audio.removeEventListener("ended", replay, false);
                }
                audio.play();
            }
            return audio;
        }
        Sound.play = play;
        /**
         * Pause sound by name
         */
        function pause(name, reset) {
            var list = audios[name];
            if (list) {
                list.forEach(function (audio) {
                    audio.pause();
                    if (reset) {
                        audio.currentTime = 0;
                    }
                });
            }
        }
        Sound.pause = pause;
        /**
         * Resume audio by name
         */
        function resume(name, reset) {
            var list = audios[name];
            if (list) {
                list.forEach(function (audio) {
                    if (!audio.ended && audio.currentTime > 0) {
                        if (reset) {
                            audio.currentTime = 0;
                        }
                        audio.play();
                    }
                });
            }
        }
        Sound.resume = resume;
        /**
         * Pause all audios
         */
        function pauseAll(reset) {
            Object.keys(audios).forEach(function (name) {
                pause(name, reset);
            });
        }
        Sound.pauseAll = pauseAll;
        /**
         * Resume all played audio
         */
        function resumeAll(reset) {
            Object.keys(audios).forEach(function (name) {
                resume(name, reset);
            });
        }
        Sound.resumeAll = resumeAll;
        /**
         * Stop the looping sound by name
         */
        function stopLoop(name) {
            var list = getPlayingAudio(name, true);
            if (list) {
                list.forEach(function (audio) {
                    audio.removeEventListener("ended", replay, false);
                    audio.loop = false;
                });
            }
        }
        Sound.stopLoop = stopLoop;
        function replay() {
            this.play();
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
                Sound.supportedType[name] = reg.test(aud.canPlayType(mts[name]));
            }
            aud = null;
        }
        detectSupportedType();
    })(Sound = canvas2d.Sound || (canvas2d.Sound = {}));
})(canvas2d || (canvas2d = {}));
var canvas2d;
(function (canvas2d) {
    var cache = {};
    var loaded = {};
    var loading = {};
    function getName(source, rect) {
        var isStr = typeof source === 'string';
        if (!isStr || !source.src) {
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
            if (typeof source === 'string') {
                this._createByPath(source, rect);
            }
            else if ((source instanceof HTMLImageElement) || (source instanceof HTMLCanvasElement)) {
                this._createByImage(source, rect);
            }
            else {
                throw new Error("Invalid texture source");
            }
            var name = getName(source, rect);
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
            this._readyCallbacks.push(callback);
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
                    var size = { width: img.width, height: img.height };
                    _this._readyCallbacks.forEach(function (callback) {
                        callback(size);
                    });
                    _this._readyCallbacks.length = 0;
                }
                img = null;
            };
            img.onerror = function () {
                img = null;
                console.warn('Texture creating fail by "' + path + '"');
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
    })();
    canvas2d.Texture = Texture;
})(canvas2d || (canvas2d = {}));
/// <reference path="util.ts" />
var canvas2d;
(function (canvas2d) {
    var counter = 0;
    var prefix = '__CANVAS2D_ONCE__';
    /**
     * EventEmitter
     */
    var EventEmitter = (function () {
        function EventEmitter() {
        }
        EventEmitter.prototype.addListener = function (type, listener) {
            var id = canvas2d.util.uuid(this);
            if (!EventEmitter._cache[id]) {
                EventEmitter._cache[id] = {};
            }
            if (!EventEmitter._cache[id][type]) {
                EventEmitter._cache[id][type] = [];
            }
            canvas2d.util.addArrayItem(EventEmitter._cache[id][type], listener);
            return this;
        };
        EventEmitter.prototype.on = function (type, listener) {
            return this.addListener(type, listener);
        };
        EventEmitter.prototype.once = function (type, listener) {
            listener[prefix + canvas2d.util.uuid(this)] = true;
            return this.addListener(type, listener);
        };
        EventEmitter.prototype.removeListener = function (type, listener) {
            var cache = EventEmitter._cache[canvas2d.util.uuid(this)];
            if (cache && cache[type]) {
                canvas2d.util.removeArrayItem(cache[type], listener);
                if (!cache[type].length) {
                    delete cache[type];
                }
            }
            return this;
        };
        EventEmitter.prototype.removeAllListeners = function (type) {
            var id = canvas2d.util.uuid(this);
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
            var id = canvas2d.util.uuid(this);
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
    })();
    canvas2d.EventEmitter = EventEmitter;
})(canvas2d || (canvas2d = {}));
/// <reference path="action.ts" />
/// <reference path="texture.ts" />
/// <reference path="eventemitter.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var canvas2d;
(function (canvas2d) {
    (function (AlignType) {
        AlignType[AlignType["TOP"] = 0] = "TOP";
        AlignType[AlignType["RIGHT"] = 1] = "RIGHT";
        AlignType[AlignType["BOTTOM"] = 2] = "BOTTOM";
        AlignType[AlignType["LEFT"] = 3] = "LEFT";
        AlignType[AlignType["CENTER"] = 4] = "CENTER";
    })(canvas2d.AlignType || (canvas2d.AlignType = {}));
    var AlignType = canvas2d.AlignType;
    canvas2d.RAD_PER_DEG = Math.PI / 180;
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
            this.id = canvas2d.util.uuid(this);
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
                this._rotationRad = this._rotation * canvas2d.RAD_PER_DEG;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "texture", {
            get: function () {
                return this._texture;
            },
            set: function (texture) {
                var _this = this;
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
            var texture = this.texture;
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
                    canvas2d.Action.stop(sprite);
                }
                this.removeChild(sprite);
            }
            this.children = null;
        };
        Sprite.prototype.release = function (recusive) {
            canvas2d.Action.stop(this);
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
    })(canvas2d.EventEmitter);
    canvas2d.Sprite = Sprite;
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
})(canvas2d || (canvas2d = {}));
/// <reference path="action.ts" />
/// <reference path="uievent.ts" />
/// <reference path="sprite.ts" />
var canvas2d;
(function (canvas2d) {
    var Stage;
    (function (Stage) {
        var eventloopTimerID;
        var lastUpdate;
        var bufferCanvas;
        var bufferContext;
        var stageScaleMode;
        var autoAdjustCanvasSize = false;
        var isUseInnerTimer = true;
        /**
         * FPS value
         */
        Stage.fps = 30;
        Stage.width = 0;
        Stage.height = 0;
        /**
         * Game running state
         */
        Stage.isRunning = false;
        /**
         * Set the stage could recieve touch event
         */
        Stage.touchEnabled = false;
        /**
         * Set the stage could recieve mouse event
         */
        Stage.mouseEnabled = false;
        /**
         * Set the stage could recieve keyboard event
         */
        Stage.keyboardEnabled = false;
        /**
         *  Scale mode for adjusting resolution design
         */
        (function (ScaleMode) {
            ScaleMode[ScaleMode["SHOW_ALL"] = 0] = "SHOW_ALL";
            ScaleMode[ScaleMode["NO_BORDER"] = 1] = "NO_BORDER";
            ScaleMode[ScaleMode["FIX_WIDTH"] = 2] = "FIX_WIDTH";
            ScaleMode[ScaleMode["FIX_HEIGHT"] = 3] = "FIX_HEIGHT";
        })(Stage.ScaleMode || (Stage.ScaleMode = {}));
        var ScaleMode = Stage.ScaleMode;
        /**
         * Scale value for adjusting the resolution design
         */
        Stage._scale = 1;
        function adjustCanvasSize() {
            if (!Stage.canvas || !Stage.canvas.parentNode) {
                return;
            }
            var style = Stage.canvas.style;
            var device = {
                width: Stage.canvas.parentElement.offsetWidth,
                height: Stage.canvas.parentElement.offsetHeight
            };
            var scaleX = device.width / Stage.width;
            var scaleY = device.height / Stage.height;
            var deltaWidth = 0;
            var deltaHeight = 0;
            var scale;
            var width;
            var height;
            switch (stageScaleMode) {
                case ScaleMode.SHOW_ALL:
                    if (scaleX < scaleY) {
                        scale = scaleX;
                        width = device.width;
                        height = scale * Stage.height;
                    }
                    else {
                        scale = scaleY;
                        width = scale * Stage.width;
                        height = device.height;
                    }
                    break;
                case ScaleMode.NO_BORDER:
                    if (scaleX > scaleY) {
                        scale = scaleX;
                    }
                    else {
                        scale = scaleY;
                    }
                    width = Stage.width * scale;
                    height = Stage.height * scale;
                    deltaWidth = (Stage.width - device.width / scale) * 0.5 | 0;
                    deltaHeight = (Stage.height - device.height / scale) * 0.5 | 0;
                    break;
                case ScaleMode.FIX_WIDTH:
                    scale = scaleX;
                    width = device.width;
                    height = device.height * scale;
                    deltaHeight = (Stage.height - device.height / scale) * 0.5 | 0;
                    break;
                case ScaleMode.FIX_HEIGHT:
                    scale = scaleY;
                    width = scale * device.width;
                    height = device.height;
                    deltaWidth = (Stage.width - device.width / scale) * 0.5 | 0;
                    break;
                default:
                    throw new Error("Unknow stage scale mode \"" + stageScaleMode + "\"");
            }
            style.width = width + 'px';
            style.height = height + 'px';
            style.top = ((device.height - height) * 0.5) + 'px';
            style.left = ((device.width - width) * 0.5) + 'px';
            style.position = 'absolute';
            Stage.visibleRect.left = deltaWidth;
            Stage.visibleRect.right = Stage.width - deltaWidth;
            Stage.visibleRect.top = deltaHeight;
            Stage.visibleRect.bottom = Stage.height - deltaHeight;
            Stage._scale = scale;
        }
        Stage.adjustCanvasSize = adjustCanvasSize;
        /**
         * Initialize the stage
         * @param  canvas     Canvas element
         * @param  width      Resolution design width
         * @param  height     Resolution design height
         * @param  scaleMode  Adjust resolution design scale mode
         */
        function init(canvas, width, height, scaleMode, autoAdjustCanvasSize) {
            Stage.sprite = new canvas2d.Sprite({
                x: width * 0.5,
                y: height * 0.5,
                width: width,
                height: height
            });
            stageScaleMode = scaleMode;
            Stage.canvas = canvas;
            Stage.context = canvas.getContext('2d');
            bufferCanvas = document.createElement("canvas");
            bufferContext = bufferCanvas.getContext("2d");
            Stage.width = canvas.width = bufferCanvas.width = width;
            Stage.height = canvas.height = bufferCanvas.height = height;
            Stage.visibleRect = { left: 0, right: width, top: 0, bottom: height };
            setAutoAdjustCanvasSize(autoAdjustCanvasSize);
        }
        Stage.init = init;
        function setAutoAdjustCanvasSize(value) {
            if (value && !autoAdjustCanvasSize) {
                autoAdjustCanvasSize = true;
                adjustCanvasSize();
                window.addEventListener("resize", adjustCanvasSize);
            }
            else if (!value && autoAdjustCanvasSize) {
                autoAdjustCanvasSize = false;
                window.removeEventListener("resize", adjustCanvasSize);
            }
        }
        Stage.setAutoAdjustCanvasSize = setAutoAdjustCanvasSize;
        function startTimer() {
            eventloopTimerID = setTimeout(function () {
                if (!isUseInnerTimer) {
                    return;
                }
                var deltaTime = getDeltaTime();
                canvas2d.Action.step(deltaTime);
                step(deltaTime);
                render();
                startTimer();
            }, 1000 / Stage.fps);
        }
        /**
         * Start the stage event loop
         */
        function start(useOuterTimer) {
            if (!Stage.isRunning) {
                isUseInnerTimer = !useOuterTimer;
                if (isUseInnerTimer) {
                    lastUpdate = Date.now();
                    startTimer();
                }
                canvas2d.UIEvent.register();
                Stage.isRunning = true;
            }
        }
        Stage.start = start;
        function step(deltaTime) {
            Stage.sprite._update(deltaTime);
        }
        Stage.step = step;
        /**
         * Stop the stage event loop
         */
        function stop(unregisterUIEvent) {
            if (!Stage.isRunning) {
                return;
            }
            if (unregisterUIEvent) {
                canvas2d.UIEvent.unregister();
            }
            Stage.isRunning = false;
            clearTimeout(eventloopTimerID);
        }
        Stage.stop = stop;
        function getDeltaTime() {
            var now = Date.now();
            var delta = now - lastUpdate;
            lastUpdate = now;
            return delta / 1000;
        }
        function render() {
            if (!Stage.isRunning) {
                return;
            }
            var width = Stage.canvas.width;
            var height = Stage.canvas.height;
            bufferContext.clearRect(0, 0, width, height);
            Stage.sprite._visit(bufferContext);
            Stage.context.clearRect(0, 0, width, height);
            Stage.context.drawImage(bufferCanvas, 0, 0, width, height);
        }
        Stage.render = render;
        /**
         * Add sprite to the stage
         */
        function addChild(child, position) {
            Stage.sprite.addChild(child, position);
        }
        Stage.addChild = addChild;
        /**
         * Remove sprite from the stage
         */
        function removeChild(child) {
            Stage.sprite.removeChild(child);
        }
        Stage.removeChild = removeChild;
        /**
         * Remove all sprites from the stage
         * @param  recusive  Recusize remove all the children
         */
        function removeAllChild(recusive) {
            Stage.sprite.removeAllChildren(recusive);
        }
        Stage.removeAllChild = removeAllChild;
    })(Stage = canvas2d.Stage || (canvas2d.Stage = {}));
})(canvas2d || (canvas2d = {}));
/// <reference path="stage.ts" />
/// <reference path="util.ts" />
/**
 * Virtual UI event manager
 */
var canvas2d;
(function (canvas2d) {
    var UIEvent;
    (function (UIEvent) {
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
        var touchHelperMap = {};
        var mouseBeginHelper;
        var mouseMovedHelper;
        var registered;
        UIEvent.supportTouch = "ontouchend" in window;
        /**
         * Register UI event
         */
        function register() {
            if (registered) {
                return;
            }
            var canvas = canvas2d.Stage.canvas;
            if (canvas2d.Stage.touchEnabled && UIEvent.supportTouch) {
                canvas.addEventListener(touchBegin, touchBeginHandler, false);
                canvas.addEventListener(touchMoved, touchMovedHandler, false);
                canvas.addEventListener(touchEnded, touchEndedHandler, false);
            }
            if (canvas2d.Stage.mouseEnabled) {
                canvas.addEventListener(mouseBegin, mouseBeginHandler, false);
                canvas.addEventListener(mouseMoved, mouseMovedHandler, false);
                canvas.addEventListener(mouseEnded, mouseEndedHandler, false);
            }
            if (canvas2d.Stage.keyboardEnabled) {
                document.addEventListener(keyDown, keyDownHandler, false);
                document.addEventListener(keyUp, keyUpHandler, false);
            }
            registered = true;
        }
        UIEvent.register = register;
        /**
         * Unregister UI event
         */
        function unregister() {
            var canvas = canvas2d.Stage.canvas;
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
        UIEvent.unregister = unregister;
        /**
         * Transform event location to stage location
         */
        function transformLocation(event) {
            var pos = canvas2d.Stage.canvas.getBoundingClientRect();
            var x = (event.clientX - pos.left) / canvas2d.Stage._scale;
            var y = (event.clientY - pos.top) / canvas2d.Stage._scale;
            return { x: x, y: y };
        }
        UIEvent.transformLocation = transformLocation;
        function transformTouches(touches, justGet) {
            var helpers = [];
            var rect = canvas2d.Stage.canvas.getBoundingClientRect();
            for (var i = 0, x, y, id, helper, touch; touch = touches[i]; i++) {
                id = touch.identifier;
                x = (touch.clientX - rect.left) / canvas2d.Stage._scale;
                y = (touch.clientY - rect.top) / canvas2d.Stage._scale;
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
        function touchBeginHandler(event) {
            if (!canvas2d.Stage.isRunning || !canvas2d.Stage.touchEnabled) {
                return;
            }
            var helpers = transformTouches(event.changedTouches);
            dispatchTouch(canvas2d.Stage.sprite, 0, 0, helpers.slice(), event, ontouchbegin);
            helpers.forEach(function (touch) {
                touch.beginTarget = touch.target;
            });
            event.preventDefault();
        }
        function touchMovedHandler(event) {
            if (!canvas2d.Stage.isRunning || !canvas2d.Stage.touchEnabled) {
                return;
            }
            var helpers = transformTouches(event.changedTouches);
            dispatchTouch(canvas2d.Stage.sprite, 0, 0, helpers, event, ontouchmoved);
            event.preventDefault();
        }
        function touchEndedHandler(event) {
            if (canvas2d.Stage.isRunning && canvas2d.Stage.touchEnabled) {
                var helpers = transformTouches(event.changedTouches, true);
                dispatchTouch(canvas2d.Stage.sprite, 0, 0, helpers.slice(), event, ontouchended, true);
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
                    touchHelperMap[helper.identifier] = null;
                });
                helpers = null;
            }
        }
        function mouseBeginHandler(event) {
            if (!canvas2d.Stage.isRunning || !canvas2d.Stage.mouseEnabled) {
                return;
            }
            var location = transformLocation(event);
            var helper = {
                beginX: location.x,
                beginY: location.y,
                stageX: location.x,
                stageY: location.y,
                cancelBubble: false
            };
            dispatchMouse(canvas2d.Stage.sprite, 0, 0, helper, event, onmousebegin);
            if (helper.target) {
                helper.beginTarget = helper.target;
                mouseBeginHelper = helper;
            }
            event.preventDefault();
        }
        function mouseMovedHandler(event) {
            if (!canvas2d.Stage.isRunning || !canvas2d.Stage.mouseEnabled) {
                return;
            }
            var location = transformLocation(event);
            if (mouseBeginHelper) {
                mouseBeginHelper.stageX = location.x;
                mouseBeginHelper.stageY = location.y;
                mouseBeginHelper._moved = mouseBeginHelper.beginX - location.x !== 0 || mouseBeginHelper.beginY - location.y !== 0;
                dispatchMouse(canvas2d.Stage.sprite, 0, 0, mouseBeginHelper, event, onmousemoved);
            }
            else {
                mouseMovedHelper = {
                    beginX: null,
                    beginY: null,
                    stageX: location.x,
                    stageY: location.y,
                    cancelBubble: false
                };
                dispatchMouse(canvas2d.Stage.sprite, 0, 0, mouseMovedHelper, event, onmousemoved);
            }
            event.preventDefault();
        }
        function mouseEndedHandler(event) {
            if (canvas2d.Stage.isRunning && canvas2d.Stage.mouseEnabled) {
                var location = transformLocation(event);
                var helper = mouseBeginHelper || mouseMovedHelper;
                var target;
                helper.stageX = location.x;
                helper.stageY = location.y;
                target = helper.target;
                // if (hasImplements(target, ON_MOUSE_ENDED)) {
                //     target[ON_MOUSE_ENDED](helper, event);
                // }
                var triggerClick = !helper._moved || isMovedSmallRange(helper);
                dispatchMouse(canvas2d.Stage.sprite, 0, 0, helper, event, onmouseended, triggerClick);
            }
            mouseBeginHelper = helper.target = helper.beginTarget = null;
        }
        function keyDownHandler(event) {
            if (!canvas2d.Stage.isRunning || !canvas2d.Stage.keyboardEnabled) {
                return;
            }
            dispatchKeyboard(canvas2d.Stage.sprite, event.keyCode, event, onkeydown);
        }
        function keyUpHandler(event) {
            if (!canvas2d.Stage.isRunning || !canvas2d.Stage.keyboardEnabled) {
                return;
            }
            dispatchKeyboard(canvas2d.Stage.sprite, event.keyCode, event, onkeyup);
        }
        function dispatchTouch(sprite, offsetX, offsetY, helpers, event, methodName, needTriggerClick) {
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
                    result = dispatchTouch(children[index], offsetX, offsetY, tmpHelpers, event, methodName, needTriggerClick);
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
                    canvas2d.util.addArrayItem(triggerreds, hits[0]);
                }
            }
            return triggerreds;
        }
        function dispatchMouse(sprite, offsetX, offsetY, helper, event, methodName, triggerClick) {
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
        }
        function dispatchKeyboard(sprite, keyCode, event, methodName) {
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
        function hasImplements(sprite, methodName) {
            return sprite[methodName] !== canvas2d.Sprite.prototype[methodName] && typeof sprite[methodName] === 'function';
        }
    })(UIEvent = canvas2d.UIEvent || (canvas2d.UIEvent = {}));
})(canvas2d || (canvas2d = {}));
var canvas2d;
(function (canvas2d) {
    var UIEvent;
    (function (UIEvent) {
        UIEvent.Key = {
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
    })(UIEvent = canvas2d.UIEvent || (canvas2d.UIEvent = {}));
})(canvas2d || (canvas2d = {}));
/// <reference path="sprite.ts" />
var canvas2d;
(function (canvas2d) {
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
    })(canvas2d.Sprite);
    canvas2d.TextLabel = TextLabel;
})(canvas2d || (canvas2d = {}));
//# sourceMappingURL=canvas2d.js.map