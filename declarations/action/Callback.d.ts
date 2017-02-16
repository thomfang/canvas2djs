import { IAction } from './Action';
export declare class Callback implements IAction {
    func: Function;
    done: boolean;
    immediate: boolean;
    constructor(func: Function);
    step(): void;
    end(): void;
}
