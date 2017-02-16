import { Texture } from '../Texture';
import { Delay } from './Delay';
import { Callback } from './Callback';
import { Animation } from './Animation';
import { Tween, EasingFunc } from '../Tween';
import { IActionListener, ActionListener } from './ActionListener';
import { TransByProps, TransToProps, Transition } from './Transition';
import { addArrayItem, removeArrayItem } from '../Util';

export enum ActionType {
    TO,
    BY,
    ANIM,
    WAIT,
    CALLBACK,
}

export type ActionQueue = Array<{
    type: ActionType.TO;
    options: TransToProps;
    duration: number;
} | {
        type: ActionType.BY;
        options: TransByProps;
        duration: number;
    } | {
        type: ActionType.ANIM;
        frameList: Array<Texture | string>;
        frameRate: number;
        repetitions?: number;
    } | {
        type: ActionType.WAIT;
        duration: number;
    } | {
        type: ActionType.CALLBACK;
        callback: Function;
    }>;

export interface IAction {
    immediate?: boolean;
    done: boolean;

    step(deltaTime: number, target: any): void;
    end(target: any): void;
}

export class Action {

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

    static schedule(deltaTime: number): void {
        Action._actionList.slice().forEach(action => {
            action._step(deltaTime);

            if (action._done) {
                removeArrayItem(Action._actionList, action);
            }
        });

        Action._listenerList.slice().forEach((listener: ActionListener) => {
            listener._step();
        });
    }

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
        this._done = true;
        this.isRunning = false;
        this._queue.length = 0;

        removeArrayItem(Action._actionList, this);
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
}