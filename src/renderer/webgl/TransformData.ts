import { Matrix3 } from "./Matrix3";

export class TransformData {

    matrix3: number[];
    options: TransformOptions;
    isIdle: boolean;

    init() {
        this.matrix3 = Matrix3.makeIdentity();
        this.options = {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            rotation: 0
        };
        this.isIdle = false;
    }

    updateMatrix(options: TransformOptions & { flippedX: boolean; flippedY: boolean; }) {
        let needUpdate: boolean;
        let sx = options.scaleX * (options.flippedX ? -1 : 1);
        let sy = options.scaleY * (options.flippedY ? -1 : 1);
        let rotationInDegree = options.rotation % 360;

        if (sx !== this.options.scaleX || sy !== this.options.scaleY) {
            this.options.scaleX = sx;
            this.options.scaleY = sy;
            needUpdate = true;
        }
        if (rotationInDegree !== this.options.rotation % 360) {
            this.options.rotation = options.rotation;
            needUpdate = true;
        }
        if (options.x !== this.options.x || options.y !== this.options.y) {
            this.options.x = options.x;
            this.options.y = options.y;
            needUpdate = true;
        }
        if (!needUpdate) {
            return this.matrix3;
        }

        let m33: number[] = Matrix3.makeIdentity();
        if (sx !== 1 || sy !== 1) {
            m33 = Matrix3.matrixMultiply(m33, Matrix3.makeScale(sx, sy))
        }
        if (rotationInDegree !== 0) {
            m33 = Matrix3.matrixMultiply(m33, Matrix3.makeRotationInDegree(-rotationInDegree))
        }
        if (options.x !== 0 || options.y !== 0) {
            m33 = Matrix3.matrixMultiply(m33, Matrix3.makeTranslation(options.x, options.y))
        }

        this.matrix3 = m33;
        return m33;
    }

    private static transformDataMap: { [id: number]: TransformData } = {};
    private static transformDataList: TransformData[] = [];

    public static getTransformData(id: number) {
        let transformData = this.transformDataMap[id];
        if (!transformData) {
            for (let i = 0; transformData = this.transformDataList[i]; i++) {
                if (transformData.isIdle) {
                    break;
                }
            }
            if (!transformData) {
                transformData = new TransformData();
                this.transformDataList.push(transformData);
            }
            transformData.init();
            this.transformDataMap[id] = transformData;
        }
        return transformData;
    }

    public static removeTransformData(id: number) {
        let transformData = this.transformDataMap[id];
        if (transformData) {
            transformData.isIdle = true;
            delete this.transformDataMap[id];
        }
    }
}

export type TransformOptions = {
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    rotation: number;
}