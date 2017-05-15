import { BaseAction } from './BaseAction';
export declare class Callback extends BaseAction {
    protected func: Function;
    immediate: boolean;
    constructor(func: Function);
    step(): void;
    end(): void;
    reset(): void;
    reverse(): void;
    destroy(): void;
}
