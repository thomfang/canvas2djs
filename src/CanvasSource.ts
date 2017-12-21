import { uid } from "./canvas2d";

export class CanvasSource {

    private static instanceList: CanvasSource[] = [];
    private static activeCount: number = 0;

    public static create() {
        let instance: CanvasSource;
        let { instanceList } = this;
        for (let i = 0; instance = instanceList[i]; i++) {
            if (instance.isIdle) {
                instance.isIdle = false;
                this.activeCount += 1;
                return instance;
            }
        }
        if (!instance) {
            instance = new CanvasSource();
            instanceList.push(instance);
        }
        this.activeCount += 1;
        return instance;
    }

    private isIdle: boolean;

    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;

    width: number;
    height: number;

    constructor() {
        this.isIdle = false;
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    setSize(width: number, height: number) {
        this.canvas.width = this.width = width;
        this.canvas.height = this.height = height;
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    recycle() {
        CanvasSource.activeCount -= 1;
        this.setSize(0, 0);
        this.isIdle = true;
    }
}