export declare class VertexData {
    vertexs: Float32Array;
    vertexsRawData: number[];
    texCoords: Float32Array;
    texCoordsRawData: number[];
    alphaRawData: number;
    alpha: Float32Array;
    isIdle: boolean;
    init(): void;
    /**
     *
     * @param vertexsRawData [x, y, w, h]
     */
    updateVertexs(x: number, y: number, w: number, h: number): boolean;
    /**
     * @param texCoordsRawData [imgWidth, imgHeight, sx, sy, sw, sh]
     */
    updateAlpha(alpha: number): boolean;
    private static vertexDataMap;
    private static vertexDataList;
    static getVertexData(id: number): VertexData;
    static removeVertexData(id: number): void;
}
