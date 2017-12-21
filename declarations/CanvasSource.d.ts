export declare class CanvasSource {
    private static instanceList;
    private static activeCount;
    static create(): CanvasSource;
    private isIdle;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    width: number;
    height: number;
    constructor();
    setSize(width: number, height: number): void;
    clear(): void;
    recycle(): void;
}
