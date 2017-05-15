import { Texture } from '../Texture';
import { BaseAction } from './BaseAction';
export declare class Animation extends BaseAction {
    interval: number;
    protected elapsed: number;
    protected count: number;
    protected frameIndex: number;
    protected frameList: Array<Texture | string>;
    protected repetitions: number;
    constructor(frameList: Array<Texture | string>, frameRate: number, repetitions?: number);
    step(deltaTime: number, target: any): void;
    end(): void;
    reset(): void;
    reverse(): void;
    destroy(): void;
}
