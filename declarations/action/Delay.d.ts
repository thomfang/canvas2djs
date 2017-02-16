import { IAction } from './Action';
export declare class Delay implements IAction {
    duration: number;
    done: boolean;
    elapsed: number;
    immediate: boolean;
    constructor(duration: number);
    step(deltaTime: number): void;
    end(): void;
}
