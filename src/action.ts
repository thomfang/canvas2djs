/// <reference path="sprite.ts" />
/// <reference path="tween.ts" />

module canvas2d {

    interface ActionAttr {
        name: string;
        dest: number;
        easing: string;
    }

    export interface ActionArg {
        [index: string]: any;
    }

    interface ActionDefinition {
        immediate?: boolean;
        done: boolean;

        step(deltaTime: number, sprite: Sprite): void;
        end(sprite: Sprite): void;
    }

    function ensureItem(array: Array<any>, item: any): void {
        if (array.indexOf(item) < 0) {
            array.push(item);
        }
    }

    function removeItem(array: Array<any>, item: any): void {
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

    class Callback implements ActionDefinition {
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

    class Delay implements ActionDefinition {
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

    class Transition implements ActionDefinition {
        done: boolean = false;
        immediate: boolean = false;
        elapsed: number = 0;
        attrs: Array<ActionAttr> = [];

        starts: { [index: string]: number } = {};
        deltas: { [index: string]: number } = {};

        constructor(attrs: ActionArg, public duration: number) {
            var name: string;
            var value: any;

            for (name in attrs) {
                value = attrs[name];

                this.attrs.push({
                    name: name,
                    dest: typeof value === 'object' ? value.dest : value,
                    easing: value.easing || 'easeInOutQuad'
                });
            }
        }

        step(deltaTime: number, sprite: Sprite): void {
            this.elapsed += deltaTime;

            if (this.elapsed >= this.duration) {
                this.end(sprite);
            }
            else {
                var percent = this.elapsed / this.duration;
                var starts = this.starts;
                var deltas = this.deltas;

                var start: number;
                var dest: number;
                var delta: number;
                var name: string;

                this.attrs.forEach((attr) => {
                    name = attr.name;
                    dest = attr.dest;
                    delta = tween[attr.easing](percent);
                    start = starts[name];

                    if (start == null) {
                        start = starts[name] = (<any>sprite)[name];
                        deltas[name] = dest - start;
                    }

                    (<any>sprite)[name] = start + (delta * deltas[name]);
                });
            }
        }

        end(sprite: Sprite): void {
            this.attrs.forEach((attr) => {
                (<any>sprite)[attr.name] = attr.dest;
            });
            this.done = true;
        }
    }

    class Animation implements ActionDefinition {
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

                if (this.repetitions == null || this.count < this.repetitions) {
                    sprite.texture = this.frameList[this.frameIndex++];

                    if (this.frameIndex === this.frameList.length) {
                        this.frameIndex = 0;
                    }

                    this.count++;
                }
                else {
                    this.done = true;
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
                ensureItem(this._callback.all, callback);
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
                ensureItem(this._callback.any, callback);
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
                removeItem(Action._listenerList, this);
                this._resolved = true;
            }
        }
    }

    export class Action {

        static _actionList: Array<Action> = [];
        static _listenerList: Array<Listener> = [];

        private _queue: Array<ActionDefinition> = [];

        _done: boolean = false;
        running: boolean = false;

        constructor(public sprite: Sprite) {
        }

        static stop(sprite: Sprite) {
            Action._actionList.slice().forEach((action) => {
                if (action.sprite === sprite) {
                    action.stop();
                }
            });
        }

        static listen(actions: Array<Action>): Listener {
            var listener = new Listener(actions);
            Action._listenerList.push(listener);
            return listener;
        }

        static _step(deltaTime: number): void {
            var actionList: Array<Action> = Action._actionList;
            var i: number = 0;
            var action: Action;

            for (; action = actionList[i]; i++) {
                action._step(deltaTime);

                if (action._done) {
                    removeItem(actionList, action);
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

        then(func: Function): Action {
            this._queue.push(new Callback(func));
            return this;
        }

        wait(time: number): Action {
            this._queue.push(new Delay(time));
            return this;
        }

        animate(frameList: Array<Texture>, frameRate: number, repetitions?: number): Action {
            var anim = new Animation(frameList, frameRate, repetitions);
            this._queue.push(anim);
            anim.step(anim.interval, this.sprite);
            return this;
        }

        to(attrs: ActionArg, duration: number): Action {
            this._queue.push(new Transition(attrs, duration));
            return this;
        }

        start(): Action {
            if (!this.running) {
                ensureItem(Action._actionList, this);
                this.running = true;
            }
            return this;
        }

        stop() {
            this._done = true;
            this.running = false;
            this._queue.length = 0;

            removeItem(Action._actionList, this);
        }
    }
}