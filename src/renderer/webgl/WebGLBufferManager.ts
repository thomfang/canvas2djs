export class WebGLBufferManager {

    private bufferInfoById: { [id: number]: BufferInfo } = {};
    private bufferInfoList: BufferInfo[] = [];

    constructor(public gl: WebGLRenderingContext) {

    }

    getBuffer(id: number) {
        let bufferInfo = this.bufferInfoById[id];
        return bufferInfo ? bufferInfo.buffer : null;
    }

    createBuffer(id: number) {
        let info: BufferInfo;
        for (let i = 0; info = this.bufferInfoList[i]; i++) {
            if (info.isIdle) {
                break;
            }
        }
        if (!info) {
            info = {
                buffer: this.gl.createBuffer(),
                isIdle: false,
            };
            this.bufferInfoList.push(info);
        }
        this.bufferInfoById[id] = info;
        return info.buffer;
    }

    removeBuffer(id: number) {
        let bufferInfo = this.bufferInfoById[id];
        if (!bufferInfo) {
            return;
        }
        bufferInfo.isIdle = true;
        delete this.bufferInfoById[id];
    }
}

type BufferInfo = {
    buffer: WebGLBuffer;
    isIdle: boolean;
}