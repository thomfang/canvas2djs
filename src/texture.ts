module canvas2d {

    export interface Rect {
        x: number;
        y: number;
        width: number;
        height: number;
    }

    var cache: { [index: string]: Texture } = {};
    var loaded: { [index: string]: boolean } = {};
    var loading: { [index: string]: boolean } = {};

    function getName(source: any, rect?: Rect): any {
        var isStr = typeof source === 'string';

        if (!isStr || !source.src) {
            return null;
        }

        var src = isStr ? source : source.src;
        var str = rect ? [rect.x, rect.y, rect.width, rect.height].join(',') : '';

        return src + str;
    }

    function createCanvas(image: HTMLImageElement, rect: Rect): HTMLCanvasElement {
        var canvas: HTMLCanvasElement = document.createElement("canvas");
        var context: CanvasRenderingContext2D = canvas.getContext('2d');

        canvas.width = rect.width;
        canvas.height = rect.height;

        context.drawImage(image, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);

        return canvas;
    }

    export class Texture {
        ready: boolean = false;
        width: number = 0;
        height: number = 0;
        source: HTMLCanvasElement;

        static create(source: any, rect?: Rect): Texture {
            if (typeof source === 'string' && cache[source] && !rect) {
                return cache[source];
            }
            return new Texture(source, rect);
        }

        constructor(source?: any, rect?: Rect) {
            if (!source) {
                return;
            }

            if (typeof source === 'string') {
                this._createByPath(source, rect);
            }
            else if ((source instanceof HTMLImageElement) || (source instanceof HTMLCanvasElement)) {
                this._createByImage(source, rect);
            }
            else {
                throw new Error("Invalid texture source");
            }

            var name: any = getName(source, rect);

            if (name) {
                cache[name] = this;
            }
        }

        private _createByPath(path: string, rect?: Rect): void {
            var img: HTMLImageElement = new Image();

            img.onload = () => {
                this._createByImage(img, rect);
                img = null;

                if (!loaded[path]) {
                    console.log("Loaded: " + path);
                }
                loaded[path] = true;
            };

            img.onerror = () => {
                img = null;
                console.warn('Texture creating fail by "' + path + '"');
            };

            if (!loading[path]) {
                console.log("Start to load: " + path);
            }

            img.src = path;
            loading[path] = true;
        }

        private _createByImage(image: HTMLImageElement, rect?: Rect): void {
            if (!rect) {
                rect = {
                    x: 0,
                    y: 0,
                    width: image.width,
                    height: image.height
                };
            }

            var source: HTMLCanvasElement = createCanvas(image, rect);

            this.width = source.width;
            this.height = source.height;
            this.source = source;
            this.ready = true;
        }
    }
}