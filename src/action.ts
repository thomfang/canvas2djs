﻿/// <reference path="sprite.ts" />
/// <reference path="tween.ts" />

namespace canvas2d {

    interface IActionDefinition {
        immediate?: boolean;
        done: boolean;

        step(deltaTime: number, sprite: Sprite): void;
        end(sprite: Sprite): void;
    }

    function addArrayItem(array: Array<any>, item: any): void {
        if (array.indexOf(item) < 0) {
            array.push(item);
        }
    }

    function removeArrayItem(array: Array<any>, item: any): void {
        var index = array.indexOf(item);
        if (index > -1) {
            array.splice(index, 1);
        }
    }

    function publish(callbackList: Array<Function>): void {
        callbackList.forEach((callback) => {
            callback();
        });
    }

    class Callback implements IActionDefinition {
        
        done: boolean = false;
        immediate: boolean = true;

        constructor(public func: Function) {
        }

        step(): void {
            if (!this.done) {
                this.func.call(null);
                this.done = true;
            }
        }

        end(): void {
            this.step();
        }
    }

    class Delay implements IActionDefinition {
        
        done: boolean = false;
        elapsed: number = 0;
        immediate: boolean = true;

        constructor(public duration: number) {
        }

        step(deltaTime: number): void {
            this.elapsed += deltaTime;
            if (this.elapsed >= this.duration) {
                this.done = true;
            }
        }

        end(): void {
        }
    }

    class Transition implements IActionDefinition {

        private _defaultEasing = tween['easeInOutQuad'];

        done: boolean = false;
        immediate: boolean = false;
        elapsed: number = 0;

        options: Array<{ name: string; dest: number; easing: IEasingFunction; }>;
        beginValue: { [name: string]: number };
        deltaValue: { [name: string]: number };

        constructor(options: any, public duration: number, public isTransitionBy?: boolean) {
            this.options = [];
            this.deltaValue = {};

            if (isTransitionBy) {
                this._initAsTransitionBy(options);
            }
            else {
                this._initAsTransitionTo(options);
            }
        }

        private _initAsTransitionTo(options: { [name: string]: number | { dest: number; easing: IEasingFunction } }) {
            Object.keys(options).forEach(name => {
                let info = options[name];
                let easing: IEasingFunction;
                let dest: number;

                if (typeof info === 'number') {
                    dest = info;
                }
                else {
                    easing = info.easing;
                    dest = info.dest;
                }

                this.options.push({ name, dest, easing });
            });
        }

        private _initAsTransitionBy(options: { [name: string]: number | { value: number; easing: IEasingFunction } }) {
            let deltaValue = this.deltaValue;

            Object.keys(options).forEach(name => {
                let info = options[name];
                let easing: IEasingFunction;
                let dest: number;

                if (typeof info === 'number') {
                    deltaValue[name] = info;
                }
                else {
                    easing = info.easing;
                    deltaValue[name] = info.value;
                }

                this.options.push({ name, dest, easing });
            });
        }

        private _initBeginValue(sprite: Sprite) {
            let beginValue = this.beginValue = {};
            let deltaValue = this.deltaValue;

            if (this.isTransitionBy) {
                this.options.forEach(option => {
                    beginValue[option.name] = sprite[option.name];
                    option.dest = sprite[option.name] + deltaValue[option.name];
                });
            }
            else {
                this.options.forEach(option => {
                    beginValue[option.name] = sprite[option.name];
                    deltaValue[option.name] = option.dest - sprite[option.name];
                });
            }
        }

        step(deltaTime: number, sprite: Sprite): void {
            this.elapsed += deltaTime;

            if (this.beginValue == null) {
                this._initBeginValue(sprite);
            }

            if (this.elapsed >= this.duration) {
                this.end(sprite);
            }
            else {
                var percent = this.elapsed / this.duration;
                var beginValue = this.beginValue;
                var deltaValue = this.deltaValue;

                this.options.forEach(({name, dest, easing}) => {
                    easing = easing || this._defaultEasing;
                    sprite[name] = beginValue[name] + (easing(percent) * deltaValue[name]);
                });
            }
        }

        end(sprite: Sprite): void {
            this.options.forEach((attr) => {
                (<any>sprite)[attr.name] = attr.dest;
            });
            this.done = true;
        }
    }

    class Animation implements IActionDefinition {
        
        done: boolean = false;
        immediate: boolean = false;
        elapsed: number = 0;
        count: number = 0;
        frameIndex: number = 0;
        interval: number;

        constructor(public frameList: Texture[], frameRate: number, public repetitions?: number) {
            this.interval = 1 / frameRate;
        }

        step(deltaTime: number, sprite: Sprite) {
            this.elapsed += deltaTime;

            if (this.elapsed >= this.interval) {
                sprite.texture = this.frameList[this.frameIndex++];

                if (this.frameIndex === this.frameList.length) {
                    if (this.repetitions == null || ++this.count < this.repetitions) {
                        this.frameIndex = 0;
                    } else {
                        this.done = true;
                    }
                }

                this.elapsed = 0;
            }
        }

        end() {
        }
    }

    export class Listener {

        private _resolved: boolean = false;
        private _callback: { any?: Array<Function>; all?: Array<Function> } = {};

        constructor(private _actions: Array<Action>) {
        }

        allDone(callback: Function): Listener {
            if (this._resolved) {
                callback();
            }
            else {
                if (!this._callback.all) {
                    this._callback.all = [];
                }
                addArrayItem(this._callback.all, callback);
            }

            return this;
        }

        anyDone(callback: Function): Listener {
            if (this._resolved) {
                callback();
            }
            else {
                if (!this._callback.any) {
                    this._callback.any = [];
                }
                addArrayItem(this._callback.any, callback);
            }

            return this;
        }

        _step(): void {
            var allDone: boolean = true;
            var anyDone: boolean = false;

            this._actions.forEach((action) => {
                if (action._done) {
                    anyDone = true;
                }
                else {
                    allDone = false;
                }
            });

            if (anyDone && this._callback.any) {
                publish(this._callback.any);
                this._callback.any = null;
            }

            if (allDone && this._callback.all) {
                publish(this._callback.all);
                removeArrayItem(Action._listenerList, this);
                this._resolved = true;
            }
        }
    }

    /**
     * Action manager
     */
    export class Action {

        static _actionList: Array<Action> = [];
        static _listenerList: Array<Listener> = [];

        private _queue: Array<IActionDefinition> = [];

        _done: boolean = false;
        
        /**
         * Action running state
         */
        running: boolean = false;

        constructor(public sprite: Sprite) {

        }

        /**
         * Stop action by sprite
         */
        static stop(sprite: Sprite) {
            Action._actionList.slice().forEach((action) => {
                if (action.sprite === sprite) {
                    action.stop();
                }
            });
        }

        /**
         * Listen a action list, when all actions are done then publish to listener
         */
        static listen(actions: Array<Action>): Listener {
            var listener = new Listener(actions);
            Action._listenerList.push(listener);
            return listener;
        }

        static step(deltaTime: number): void {
            var actionList: Array<Action> = Action._actionList;
            var i: number = 0;
            var action: Action;

            for (; action = actionList[i]; i++) {
                action._step(deltaTime);

                if (action._done) {
                    removeArrayItem(actionList, action);
                }
            }

            Action._listenerList.slice().forEach((listener) => {
                listener._step();
            });
        }

        private _step(deltaTime: number): void {
            if (!this._queue.length) {
                return;
            }

            var action = this._queue[0];

            action.step(deltaTime, this.sprite);

            if (action.done) {
                this._queue.shift();

                if (!this._queue.length) {
                    this._done = true;
                    this.running = false;
                    this.sprite = null;
                }
                else if (action.immediate) {
                    this._step(deltaTime);
                }
            }
        }

        /**
         * Add a callback, it will exec after previous action is done.
         */
        then(func: Function): Action {
            this._queue.push(new Callback(func));
            return this;
        }

        /**
         * Add a delay action.
         */
        wait(time: number): Action {
            this._queue.push(new Delay(time));
            return this;
        }

        /**
         * Add a animation action
         */
        animate(frameList: Array<Texture>, frameRate: number, repetitions?: number): Action {
            var anim = new Animation(frameList, frameRate, repetitions);
            this._queue.push(anim);
            anim.step(anim.interval, this.sprite);
            return this;
        }

        /**
         * TransitionTo action
         * @param  attrs     Transition attributes map
         * @param  duration  Transition duration
         */
        to(attrs: { [name: string]: number | { dest: number; easing: IEasingFunction; } }, duration: number): Action {
            this._queue.push(new Transition(attrs, duration));
            return this;
        }
        
        /**
         * TransitionBy action
         */
        by(attrs: { [name: string]: number | { value: number; easing: IEasingFunction; } }, duration: number): Action {
            this._queue.push(new Transition(attrs, duration, true));
            return this;
        }

        /**
         * Start the action
         */
        start(): Action {
            if (!this.running) {
                addArrayItem(Action._actionList, this);
                this.running = true;
            }
            return this;
        }

        /**
         * Stop the action
         */
        stop() {
            this._done = true;
            this.running = false;
            this._queue.length = 0;

            removeArrayItem(Action._actionList, this);
        }
    }
}