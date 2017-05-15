import { Texture } from '../Texture';
import { BaseAction } from './BaseAction';

export class Animation extends BaseAction {

    interval: number;
    
    protected elapsed: number = 0;
    protected count: number = 0;
    protected frameIndex: number = 0;
    protected frameList: Array<Texture | string>;
    protected repetitions: number;

    constructor(frameList: Array<Texture | string>, frameRate: number, repetitions?: number) {
        super();

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
        this.done = true;
    }

    reset() {
        this.done = false;
        this.frameIndex = 0;
        this.elapsed = 0;
        this.count = 0;
    }

    reverse() {
        this.done = false;
        this.frameIndex = 0;
        this.elapsed = 0;
        this.count = 0;
        this.frameList = this.frameList.slice().reverse();
    }

    destroy() {
        this.frameList = null;
    }
}