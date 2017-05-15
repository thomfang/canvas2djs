import { BaseAction } from './BaseAction';
export declare class Delay extends BaseAction {
    protected duration: number;
    protected elapsed: number;
    constructor(duration: number);
    step(deltaTime: number): void;
    end(): void;
    reset(): void;
    reverse(): void;
    destroy(): void;
}
