export class VertexData {

    vertexs: Float32Array;
    vertexsRawData: number[];

    texCoords: Float32Array;
    texCoordsRawData: number[];

    alphaRawData: number;
    alpha: Float32Array;

    isIdle: boolean;

    init() {
        this.vertexsRawData = [0, 0, 0, 0]; // [x, y, w, h]
        this.vertexs = new Float32Array([
            0, 0,
            1, 0,
            1, 1,
            0, 1,
            0, 0
        ]);

        this.texCoordsRawData = [0, 0, 0, 0, 0, 0]; // [imageWidth, imgHeight, sx, sy, sw, sh]
        this.texCoords = new Float32Array([
            0, 0,
            1, 0,
            1, 1,
            0, 1,
            0, 0
        ]);

        this.alphaRawData = 1;
        this.alpha = new Float32Array([
            1, 1,
            1, 1,
            1, 1,
            1, 1,
            1, 1,
        ]);

        this.isIdle = false;
    }

    /**
     * 
     * @param vertexsRawData [x, y, w, h]
     */
    public updateVertexs(x: number, y: number, w: number, h: number) {
        let data = this.vertexsRawData;
        if (data[0] !== x ||
            data[1] !== y ||
            data[2] !== w ||
            data[3] !== h
        ) {
            let left = x;
            let top = y;
            let right = left + w;
            let bottom = top + h;

            this.vertexs[0] = left; this.vertexs[1] = top; // left top
            this.vertexs[2] = right; this.vertexs[3] = top; // right top
            this.vertexs[4] = right; this.vertexs[5] = bottom; //  right bottom
            this.vertexs[6] = left; this.vertexs[7] = bottom; // left bottom
            this.vertexs[8] = left; this.vertexs[9] = top; // left top, close the rect

            data[0] = x;
            data[1] = y;
            data[2] = w;
            data[3] = h;
            return true;
        }
        return false;
    }

    /**
     * @param texCoordsRawData [imgWidth, imgHeight, sx, sy, sw, sh]
     */
    // public updateTexCoords(imgWidth: number, imgHeight: number, sx: number, sy: number, sw: number, sh: number) {
    //     let data = this.texCoordsRawData;
    //     if (data[0] !== imgWidth ||
    //         data[1] !== imgHeight ||
    //         data[2] !== sx ||
    //         data[3] !== sy ||
    //         data[4] !== sw ||
    //         data[5] !== sh
    //     ) {
    //         let left = sx / imgWidth;
    //         let top = sy / imgHeight;
    //         let right = (sx + sw) / imgWidth;
    //         let bottom = (sy + sh) / imgHeight;

    //         this.texCoords[0] = left; this.texCoords[1] = top;
    //         this.texCoords[2] = right; this.texCoords[3] = top;
    //         this.texCoords[4] = right; this.texCoords[5] = bottom;
    //         this.texCoords[6] = left; this.texCoords[7] = bottom;
    //         this.texCoords[8] = left; this.texCoords[9] = top;

    //         data[0] = imgWidth;
    //         data[1] = imgHeight;
    //         data[2] = sx;
    //         data[3] = sy;
    //         data[4] = sw;
    //         data[5] = sh;
    //         return true;
    //     }
    //     return false;
    // }

    public updateAlpha(alpha: number) {
        if (this.alphaRawData !== alpha) {
            this.alpha[0] = this.alpha[2] = this.alpha[4] = this.alpha[6] = this.alpha[8] = this.alphaRawData = alpha;
            return true;
        }
        return false;
    }

    private static vertexDataMap: { [id: number]: VertexData } = {};
    private static vertexDataList: VertexData[] = [];

    public static getVertexData(id: number) {
        let vertexData = this.vertexDataMap[id];
        if (!vertexData) {
            for (let i = 0; vertexData = this.vertexDataList[i]; i++) {
                if (vertexData.isIdle) {
                    break;
                }
            }
            if (!vertexData) {
                vertexData = new VertexData();
                this.vertexDataList.push(vertexData);
            }
            vertexData.init();
            this.vertexDataMap[id] = vertexData;
        }
        return vertexData;
    }

    public static removeVertexData(id: number) {
        let vertexData = this.vertexDataMap[id];
        if (vertexData) {
            vertexData.isIdle = true;
            delete this.vertexDataMap[id];
        }
    }

}