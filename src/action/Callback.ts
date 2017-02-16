import { IAction } from './Action';

export class Callback implements IAction {

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