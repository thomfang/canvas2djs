import { Action } from './Action';
export interface IActionListener {
    all(callback: Function): IActionListener;
    any(callback: Function): IActionListener;
}
export declare class ActionListener implements IActionListener {
    private _resolved;
    private _callbacks;
    private _actions;
    constructor(actions: Array<Action>);
    all(callback: Function): ActionListener;
    any(callback: Function): ActionListener;
    _step(): void;
}
