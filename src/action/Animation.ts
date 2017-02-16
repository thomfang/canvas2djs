import { IAction } from './Action';
import { Texture } from '../Texture';

export class Animation implements IAction {

    done: boolean = false;
    immediate: boolean = false;
    elapsed: number = 0;
    count: number = 0;
    frameIndex: number = 0;
    interval: number;
    frameList: Array<Texture | string>;
    repetitions: number;

    constructor(frameList: Array<Texture | string>, frameRate: number, repetitions?: number) {
        this.frameList = frameList;
        this.repetitions = repetitions;
        this.interval = 1 / frameRate;
    }

    step(deltaTime: number, target: any) {
        this.elapsed += deltaTime;

        if (this.elapsed >= this.interval) {
            target.texture = this.frameList[this.frameIndex++];

            if (this.frameIndex === this.frameList.length) {
                if (this.repetitions == null || ++this.count < this.repetitions) {
                    this.frameIndex = 0;
                }
                else {
                    this.end();
                }
            }

            this.elapsed = 0;
        }
    }

    end() {
        this.frameList = null;
        this.done = true;
    }
}