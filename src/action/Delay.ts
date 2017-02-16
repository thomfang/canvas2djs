import { IAction } from './Action';

export class Delay implements IAction {

    duration: number;
    done: boolean = false;
    elapsed: number = 0;
    immediate: boolean = true;

    constructor(duration: number) {
        this.duration = duration;
    }

    step(deltaTime: number): void {
        this.elapsed += deltaTime;
        if (this.elapsed >= this.duration) {
            this.done = true;
        }
    }

    end(): void {
    }
}