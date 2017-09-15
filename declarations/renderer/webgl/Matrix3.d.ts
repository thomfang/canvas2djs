export declare namespace Matrix3 {
    function makeIdentity(): number[];
    function makeTranslation(x: number, y: number): number[];
    function makeScale(sx: number, sy: number): number[];
    function makeRotationInRadians(rotationInRadians: number): number[];
    function makeRotationInDegree(rotationInDegree: number): number[];
    function vectorMultiplyMatrix(vec3: number[], mat33: number[]): any[];
    function matrixMultiply(mat1: number[], mat2: number[]): any[];
    function make2DProjection(width: number, height: number): number[];
}
