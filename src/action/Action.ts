import { Texture } from '../Texture';
import { Delay } from './Delay';
import { Callback } from './Callback';
import { Animation } from './Animation';
import { Tween, EasingFunc } from '../Tween';
import { IActionListener, ActionListener } from './ActionListener';
import { TransByProps, TransToProps, Transition } from './Transition';
import { addArrayItem, removeArrayItem } from '../Util';
import { BaseAction } from './BaseAction';

export enum ActionType {
    TO,
    BY,
    ANIM,
    WAIT,
    CALLBACK,
}

export type TransToAction = {
    type: ActionType.TO;
    options: TransToProps;
    duration: number;
};

export type TransByAction = {
    type: ActionType.BY;
    options: TransByProps;
    duration: number;
};

export type AnimationAction = {
    type: ActionType.ANIM;
    frameList: Array<Texture | string>;
    frameRate: number;
    repetitions?: number;
}

export type WaitAction = {
    type: ActionType.WAIT;
    duration: number;
}

export type CallbackAction = {
    type: ActionType.CALLBACK;
    callback: Function;
}

export type ActionQueue = Array<TransToAction | TransByAction | AnimationAction | WaitAction | CallbackAction>;

export enum ActionRepeatMode {
    NONE,
    REPEAT,
    REVERSE_REPEAT,
}

export class Action {

    private static _actionList: Array<Action> = [];
    private static _listenerList: Array<IActionListener> = [];
    private static _scheduleCostTime: number = 0;
    public static get scheduleCostTime() {
        return this._scheduleCostTime;
    }

    /**
     * Stop action by target
     */
    public static stop(target: any, tag?: string) {
        Action._actionList.slice().forEach((action) => {
            if (action.target === target) {
                if (tag == null || action.tag == tag) {
                    action.stop();
                }
            }
        });
    }

    /**
     * Listen a action list, when all actions are done then publish to listener
     */
    public static listen(actions: Array<Action>): IActionListener {
        var listener = new ActionListener(actions);
        Action._listenerList.push(listener);
        return listener;
    }

    public static removeListener(listener: IActionListener) {
        removeArrayItem(this._listenerList, this);
    }

    public static schedule(deltaTime: number): void {
        var startTime = Date.now();

        Action._actionList.slice().forEach(action => {
            action._step(deltaTime);

            if (action._done) {
                removeArrayItem(Action._actionList, action);
            }
        });

        Action._listenerList.slice().forEach((listener: ActionListener) => {
            listener._step();
        });

        Action._scheduleCostTime = Date.now() - startTime;
    }

    protected _queue: Array<BaseAction> = [];
    protected _currentIndex: number = 0;
    protected _done: boolean = false;
    protected _repeatMode: ActionRepeatMode = ActionRepeatMode.NONE;

    /**
     * Action running state
     */
    public isRunning: boolean = false;
    public target: any;
    public tag: string;

    constructor(target: any, tag?: string) {
        this.target = target;
        this.tag = tag;
    }

    isDone() {
        return this._done;
    }

    setRepeatMode(mode: ActionRepeatMode) {
        this._repeatMode = mode;
        return this;
    }

    set repeatMode(mode: ActionRepeatMode) {
        this._repeatMode = mode;
    }

    get repeatMode() {
        return this._repeatMode;
    }

    queue(actions: ActionQueue) {
        actions.forEach(action => {
            switch (action.type) {
                case ActionType.ANIM:
                    this.animate(action.frameList, action.frameRate, action.repetitions);
                    break;
                case ActionType.BY:
                    this.by(action.options, action.duration);
                    break;
                case ActionType.TO:
                    this.to(action.options, action.duration);
                    break;
                case ActionType.WAIT:
                    this.wait(action.duration);
                    break;
                case ActionType.CALLBACK:
                    this.then(action.callback);
                    break;
            }
        });
        return this;
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
    animate(frameList: Array<Texture | string>, frameRate: number, repetitions?: number): Action {
        var anim = new Animation(frameList, frameRate, repetitions);
        this._queue.push(anim);
        anim.step(anim.interval, this.target);
        return this;
    }

    /**
     * TransitionTo action
     */
    to(attrs: TransToProps, duration: number): Action {
        this._queue.push(new Transition(attrs, duration));
        return this;
    }

    /**
     * TransitionBy action
     */
    by(attrs: TransByProps, duration: number): Action {
        this._queue.push(new Transition(attrs, duration, true));
        return this;
    }

    /**
     * Start the action
     */
    start(): Action {
        if (!this.isRunning) {
            addArrayItem(Action._actionList, this);
            this.isRunning = true;
        }
        return this;
    }

    /**
     * Stop the action
     */
    stop() {
        this._queue.forEach(action => action.destroy());

        this._done = true;
        this.isRunning = false;
        this._queue.length = 0;

        removeArrayItem(Action._actionList, this);
    }

    clear() {
        this._queue.forEach(action => action.destroy());

        this._done = false;
        this.isRunning = false;
        this._queue.length = 0;
        this._currentIndex = 0;
        this._repeatMode = ActionRepeatMode.NONE;

        removeArrayItem(Action._actionList, this);
    }

    protected _step(deltaTime: number): void {
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
    }

    protected _onAllActionDone() {
        switch (this._repeatMode) {
            case ActionRepeatMode.REPEAT:
                this._queue.forEach(a => a.reset());
                this._currentIndex = 0;
                break;
            case ActionRepeatMode.REVERSE_REPEAT:
                this._queue.forEach(a => a.reverse());
                this._currentIndex = 0;
                break;
            default:
                this._done = true;
                this.isRunning = false;
                this.target = null;
                this._queue.forEach(a => a.destroy());
                this._queue.length = 0;
                break;
        }
    }
}