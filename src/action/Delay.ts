import { BaseAction } from './BaseAction';

export class Delay extends BaseAction {

    protected duration: number;
    protected elapsed: number = 0;

    constructor(duration: number) {
        super();
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

    reset() {
        this.elapsed = 0;
        this.done = false;
    }

    reverse() {
        this.done = false;
        this.elapsed = 0;
    }

    destroy() {
    }
}