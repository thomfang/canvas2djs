import { IAction } from './Action';
import { Texture } from '../Texture';
export declare class Animation implements IAction {
    done: boolean;
    immediate: boolean;
    elapsed: number;
    count: number;
    frameIndex: number;
    interval: number;
    frameList: Array<Texture | string>;
    repetitions: number;
    constructor(frameList: Array<Texture | string>, frameRate: number, repetitions?: number);
    step(deltaTime: number, target: any): void;
    end(): void;
}
