export declare class TransformData {
    matrix3: number[];
    options: TransformOptions;
    isIdle: boolean;
    init(): void;
    updateMatrix(options: TransformOptions & {
        flippedX: boolean;
        flippedY: boolean;
    }): number[];
    private static transformDataMap;
    private static transformDataList;
    static getTransformData(id: number): TransformData;
    static removeTransformData(id: number): void;
}
export declare type TransformOptions = {
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    rotation: number;
};
