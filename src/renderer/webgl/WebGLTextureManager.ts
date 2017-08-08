export class WebGLTextureManager {

    private textureInfoList: TextureInfo[] = [];
    private textureInfoById: { [id: number]: TextureInfo } = {};

    constructor(public gl: WebGLRenderingContext) {

    }

    getTexture(id: number) {
        let textureInfo = this.textureInfoById[id];
        return textureInfo ? textureInfo.texture : null;
    }

    createTexture(id: number) {
        let textureInfo: TextureInfo;
        for (let i = 0; textureInfo = this.textureInfoList[i]; i++) {
            if (textureInfo.isIdle) {
                break;
            }
        }
        if (!textureInfo) {
            textureInfo = {
                isIdle: false,
                texture: this.gl.createTexture()
            };
            this.textureInfoList.push(textureInfo);
        }
        this.textureInfoById[id] = textureInfo;
        return textureInfo.texture;
    }

    removeTexture(id: number) {
        let textureInfo = this.textureInfoById[id];
        if (textureInfo) {
            textureInfo.isIdle = true;
            delete this.textureInfoById[id];
        }
    }
}

type TextureInfo = {
    isIdle: boolean;
    texture: WebGLTexture;
}