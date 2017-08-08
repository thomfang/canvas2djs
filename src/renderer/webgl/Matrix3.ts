export namespace Matrix3 {

    const radPerDeg = Math.PI / 180;
    const degPerRad = 180 / Math.PI;

    export function makeIdentity() {
        return [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ]
    }

    export function makeTranslation(x: number, y: number) {
        return [
            1, 0, 0,
            0, 1, 0,
            x, y, 1,
        ]
    }

    export function makeScale(sx: number, sy: number) {
        return [
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1,
        ];
    }

    export function makeRotationInRadians(rotationInRadians: number) {
        let s = Math.sin(rotationInRadians);
        let c = Math.cos(rotationInRadians);
        return [
            c, -s, 0,
            s, c, 0,
            0, 0, 1,
        ];
    }

    export function makeRotationInDegree(rotationInDegree: number) {
        let radians = rotationInDegree * radPerDeg;
        return makeRotationInRadians(radians);
    }

    export function vectorMultiplyMatrix(vec3: number[], mat33: number[]) {
        let vec = [];

        vec[0] = vec3[0] * mat33[0] + vec3[1] * mat33[3] + vec3[2] * mat33[6];
        vec[1] = vec3[0] * mat33[1] + vec3[1] * mat33[4] + vec3[2] * mat33[7];
        vec[2] = vec3[0] * mat33[2] + vec3[1] * mat33[5] + vec3[2] * mat33[8];

        return vec;
    }

    export function matrixMultiply(mat1: number[], mat2: number[]) {
        let m33 = [];

        m33[0] = mat1[0] * mat2[0] + mat1[1] * mat2[3] + mat1[2] * mat2[6];
        m33[1] = mat1[0] * mat2[1] + mat1[1] * mat2[4] + mat1[2] * mat2[7];
        m33[2] = mat1[0] * mat2[2] + mat1[1] * mat2[5] + mat1[2] * mat2[8];


        m33[3] = mat1[3] * mat2[0] + mat1[4] * mat2[3] + mat1[5] * mat2[6];
        m33[4] = mat1[3] * mat2[1] + mat1[4] * mat2[4] + mat1[5] * mat2[7];
        m33[5] = mat1[3] * mat2[2] + mat1[4] * mat2[5] + mat1[5] * mat2[8];

        m33[6] = mat1[6] * mat2[0] + mat1[7] * mat2[3] + mat1[8] * mat2[6];
        m33[7] = mat1[6] * mat2[1] + mat1[7] * mat2[4] + mat1[8] * mat2[7];
        m33[8] = mat1[6] * mat2[2] + mat1[7] * mat2[5] + mat1[8] * mat2[8];

        return m33;
    }

    export function make2DProjection(width: number, height: number) {
        return [
            2 / width, 0, 0,
            0, -2 / height, 0,
            -1, 1, 1
        ]
    }
}