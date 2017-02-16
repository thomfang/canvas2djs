import { Action } from './Action';
import { addArrayItem, removeArrayItem } from '../Util';

export interface IActionListener {
    all(callback: Function): IActionListener;
    any(callback: Function): IActionListener;
}

export class ActionListener implements IActionListener {

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
            addArrayItem(this._callbacks.all, callback);
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
            addArrayItem(this._callbacks.any, callback);
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
            removeArrayItem(Action._listenerList, this);
            this._resolved = true;
        }
    }
}