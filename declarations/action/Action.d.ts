import { Texture } from '../Texture';
import { IActionListener } from './ActionListener';
import { TransByProps, TransToProps } from './Transition';
import { BaseAction } from './BaseAction';
export declare enum ActionType {
    TO = 0,
    BY = 1,
    ANIM = 2,
    WAIT = 3,
    CALLBACK = 4,
}
export declare type TransToAction = {
    type: ActionType.TO;
    options: TransToProps;
    duration: number;
};
export declare type TransByAction = {
    type: ActionType.BY;
    options: TransByProps;
    duration: number;
};
export declare type AnimationAction = {
    type: ActionType.ANIM;
    frameList: Array<Texture | string>;
    frameRate: number;
    repetitions?: number;
};
export declare type WaitAction = {
    type: ActionType.WAIT;
    duration: number;
};
export declare type CallbackAction = {
    type: ActionType.CALLBACK;
    callback: Function;
};
export declare type ActionQueue = Array<TransToAction | TransByAction | AnimationAction | WaitAction | CallbackAction>;
export declare enum ActionRepeatMode {
    NONE = 0,
    REPEAT = 1,
    REVERSE_REPEAT = 2,
}
export declare class Action {
    private static _actionList;
    private static _listenerList;
    private static _scheduleCostTime;
    static readonly scheduleCostTime: number;
    /**
     * Stop action by target
     */
    static stop(target: any): void;
    /**
     * Listen a action list, when all actions are done then publish to listener
     */
    static listen(actions: Array<Action>): IActionListener;
    static removeListener(listener: IActionListener): void;
    static schedule(deltaTime: number): void;
    protected _queue: Array<BaseAction>;
    protected _currentIndex: number;
    protected _done: boolean;
    protected _repeatMode: ActionRepeatMode;
    /**
     * Action running state
     */
    isRunning: boolean;
    target: any;
    constructor(target: any);
    isDone(): boolean;
    setRepeatMode(mode: ActionRepeatMode): this;
    repeatMode: ActionRepeatMode;
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
    to(attrs: TransToProps, duration: number): Action;
    /**
     * TransitionBy action
     */
    by(attrs: TransByProps, duration: number): Action;
    /**
     * Start the action
     */
    start(): Action;
    /**
     * Stop the action
     */
    stop(): void;
    clear(): void;
    protected _step(deltaTime: number): void;
    protected _onAllActionDone(): void;
}
