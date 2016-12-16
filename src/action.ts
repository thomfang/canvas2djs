import * as Util from './Util';
import Tween, { IEasingFunction } from './Tween';
import Texture from './Texture';

export interface IActionListener {
    all(callback: Function): IActionListener;
    any(callback: Function): IActionListener;
}

interface IAction {
    immediate?: boolean;
    done: boolean;

    step(deltaTime: number, target: any): void;
    end(target: any): void;
}

class Callback implements IAction {

    func: Function;
    done: boolean = false;
    immediate: boolean = true;

    constructor(func: Function) {
        this.func = func;
    }

    step(): void {
        this.func.call(null);
        this.end();
    }

    end(): void {
        this.func = null;
        this.done = true;
    }
}

class Delay implements IAction {

    duration: number;
    done: boolean = false;
    elapsed: number = 0;
    immediate: boolean = true;

    constructor(duration: number) {
        this.duration = duration;
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

class Transition implements IAction {

    private _defaultEasing: IEasingFunction = Tween.easeInOutQuad;

    done: boolean = false;
    immediate: boolean = false;
    elapsed: number = 0;
    duration: number;
    isTransitionBy: boolean;

    options: Array<{ name: string; dest: number; easing: IEasingFunction; }>;
    beginValue: { [name: string]: number };
    deltaValue: { [name: string]: number };

    constructor(options: any, duration: number, isTransitionBy?: boolean) {
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

    private _initBeginValue(target: any) {
        let beginValue = this.beginValue = {};
        let deltaValue = this.deltaValue;

        if (this.isTransitionBy) {
            this.options.forEach(option => {
                beginValue[option.name] = target[option.name];
                option.dest = target[option.name] + deltaValue[option.name];
            });
        }
        else {
            this.options.forEach(option => {
                beginValue[option.name] = target[option.name];
                deltaValue[option.name] = option.dest - target[option.name];
            });
        }
    }

    step(deltaTime: number, target: any): void {
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

        this.options.forEach(({name, dest, easing}) => {
            easing = easing || this._defaultEasing;
            target[name] = beginValue[name] + (easing(percent) * deltaValue[name]);
        });
    }

    end(target: any): void {
        this.options.forEach((attr) => {
            target[attr.name] = attr.dest;
        });
        this.beginValue = null;
        this.deltaValue = null;
        this.options = null;
        this.done = true;
    }
}

class Animation implements IAction {

    done: boolean = false;
    immediate: boolean = false;
    elapsed: number = 0;
    count: number = 0;
    frameIndex: number = 0;
    interval: number;
    frameList: Texture[];
    repetitions: number;

    constructor(frameList: Texture[], frameRate: number, repetitions?: number) {
        this.frameList = frameList;
        this.repetitions = repetitions;
        this.interval = 1 / frameRate;
    }

    step(deltaTime: number, target: any) {
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
    }

    end() {
        this.frameList = null;
        this.done = true;
    }
}

class ActionListener implements IActionListener {

    private _resolved: boolean = false;
    private _callbacks: { any?: Array<Function>; all?: Array<Function> } = {};
    private _actions: Array<Action>

    constructor(actions: Array<Action>) {
        this._actions = actions;
    }

    all(callback: Function): ActionListener {
        if (this._resolved) {
            callback();
        }
        else {
            if (!this._callbacks.all) {
                this._callbacks.all = [];
            }
            Util.addArrayItem(this._callbacks.all, callback);
        }

        return this;
    }

    any(callback: Function): ActionListener {
        if (this._resolved) {
            callback();
        }
        else {
            if (!this._callbacks.any) {
                this._callbacks.any = [];
            }
            Util.addArrayItem(this._callbacks.any, callback);
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

        if (anyDone && this._callbacks.any) {
            this._callbacks.any.forEach(callback => callback());
            this._callbacks.any = null;
        }

        if (allDone && this._callbacks.all) {
            this._callbacks.all.forEach(callback => callback());
            Util.removeArrayItem(Action._listenerList, this);
            this._resolved = true;
        }
    }
}

/**
 * Action manager
 */
export default class Action {

    static _actionList: Array<Action> = [];
    static _listenerList: Array<IActionListener> = [];

    private _queue: Array<IAction> = [];

    _done: boolean = false;

    /**
     * Action running state
     */
    isRunning: boolean = false;
    target: any;

    constructor(target: any) {
        this.target = target;
    }

    /**
     * Stop action by target
     */
    static stop(target: any) {
        Action._actionList.slice().forEach((action) => {
            if (action.target === target) {
                action.stop();
            }
        });
    }

    /**
     * Listen a action list, when all actions are done then publish to listener
     */
    static listen(actions: Array<Action>): IActionListener {
        var listener = new ActionListener(actions);
        Action._listenerList.push(listener);
        return listener;
    }

    static step(deltaTime: number): void {
        Action._actionList.slice().forEach(action => {
            action._step(deltaTime);

            if (action._done) {
                Util.removeArrayItem(Action._actionList, action);
            }
        });

        Action._listenerList.slice().forEach((listener) => {
            (listener as ActionListener)._step();
        });
    }

    private _step(deltaTime: number): void {
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
    }

    /**
     * Add a callback, it will exec after previous action is done.
     */
    then(callback: Function): Action {
        this._queue.push(new Callback(callback));
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
        anim.step(anim.interval, this.target);
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
        if (!this.isRunning) {
            Util.addArrayItem(Action._actionList, this);
            this.isRunning = true;
        }
        return this;
    }

    /**
     * Stop the action
     */
    stop() {
        this._done = true;
        this.isRunning = false;
        this._queue.length = 0;

        Util.removeArrayItem(Action._actionList, this);
    }
}