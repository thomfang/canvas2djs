import { IEasingFunction } from './Tween';
import Texture from './Texture';
export interface IActionListener {
    all(callback: Function): IActionListener;
    any(callback: Function): IActionListener;
}
export declare type TransitionToAttrs = {
    [name: string]: number | {
        dest: number;
        easing: IEasingFunction;
    };
};
export declare type TransitionByAttrs = {
    [name: string]: number | {
        value: number;
        easing: IEasingFunction;
    };
};
export declare enum ActionType {
    TO = 0,
    BY = 1,
    ANIM = 2,
    WAIT = 3,
    CALLBACK = 4,
}
export declare type ActionQueue = Array<{
    type: ActionType.TO;
    options: TransitionToAttrs;
    duration: number;
} | {
    type: ActionType.BY;
    options: TransitionByAttrs;
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
/**
 * Action manager
 */
export default class Action {
    /**
     * Stop action by target
     */
    static stop(target: any): void;
    /**
     * Listen a action list, when all actions are done then publish to listener
     */
    static listen(actions: Array<Action>): IActionListener;
    static step(deltaTime: number): void;
    static _actionList: Array<Action>;
    static _listenerList: Array<IActionListener>;
    private _queue;
    _done: boolean;
    /**
     * Action running state
     */
    isRunning: boolean;
    target: any;
    constructor(target: any);
    queue(actions: ActionQueue): this;
    /**
     * Add a callback, it will exec after previous action is done.
     */
    then(callback: Function): Action;
    /**
     * Add a delay action.
     */
    wait(time: number): Action;
    /**
     * Add a animation action
     */
    animate(frameList: Array<Texture | string>, frameRate: number, repetitions?: number): Action;
    /**
     * TransitionTo action
     */
    to(attrs: TransitionToAttrs, duration: number): Action;
    /**
     * TransitionBy action
     */
    by(attrs: TransitionByAttrs, duration: number): Action;
    /**
     * Start the action
     */
    start(): Action;
    /**
     * Stop the action
     */
    stop(): void;
    private _step(deltaTime);
}
