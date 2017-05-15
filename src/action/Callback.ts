import { BaseAction } from './BaseAction';

export class Callback extends BaseAction {

    protected func: Function;
    immediate: boolean = true;

    constructor(func: Function) {
        super();
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

    reset() {
        this.done = false;
    }

    reverse() {
        this.done = false;
    }

    destroy() {
        this.func = null;
    }
}