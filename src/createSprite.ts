import Sprite, { ISprite } from './Sprite';
import TextLabel, { ITextLabel } from './TextLabel';
import BMFontLabel, { IBMFontLabel } from './BMFontLabel';
import Stage, { ScaleMode } from './Stage';

export interface Ref<T> {
    ref?(instance: T): any;
}

export type SpriteProps = ISprite & Ref<Sprite<{}>>;
export type TextProps = ITextLabel & Ref<TextLabel>;
export type BMFontProps = IBMFontLabel & Ref<BMFontLabel>;
export type SpriteClass<T, U> = new (attrs?: T & ISprite) => U;
export type StageProps = {
    width: number;
    height: number;
    canvas: HTMLCanvasElement;
    scaleMode: ScaleMode;
    autoAdjustCanvasSize?: boolean;
    touchEnabled?: boolean;
    mouseEnabled?: boolean;
    keyboardEnabled?: boolean;
    useExternalTimer?: boolean;
} & Ref<Stage>;

function createSprite<T, U>(type: "sprite", props: SpriteProps, ...children: any[]): Sprite<{}>;
function createSprite<T, U>(type: "text", props: TextProps, ...children: any[]): TextLabel;
function createSprite<T, U>(type: "bmfont", props: BMFontProps, ...children: any[]): BMFontLabel;
function createSprite<T, U>(type: "stage", props: StageProps, ...children: any[]): Stage;
function createSprite<T, U>(type: SpriteClass<T, U>, props: T & SpriteProps, ...children: any[]): U;
function createSprite<T, U>(type: any, props: any, ...children: any[]): any {
    let sprite: any;
    let {ref, ...options} = props;

    if (typeof type === 'function') {
        sprite = new type(options);
    }
    else {
        switch (type) {
            case "sprite":
                sprite = new Sprite(options);
                if (children.length) {
                    children.forEach(child => child && sprite.addChild(child));
                }
                break;
            case "text":
                sprite = new TextLabel(options);
                if (children.length && ensureString(children)) {
                    sprite.text = children.join('');
                }
                break;
            case "bmfont":
                sprite = new BMFontLabel(options);
                if (children.length && ensureString(children)) {
                    sprite.text = children.join('');
                }
                break;
            case 'stage':
                let {canvas, width, height, scaleMode, autoAdjustCanvasSize, useExternalTimer, touchEnabled, mouseEnabled, keyboardEnabled} = options as StageProps;
                let stage = sprite = new Stage(canvas, width, height, scaleMode, autoAdjustCanvasSize);

                stage.touchEnabled = touchEnabled;
                stage.mouseEnabled = mouseEnabled;
                stage.keyboardEnabled = keyboardEnabled;
                stage.start(useExternalTimer);

                if (children.length) {
                    children.forEach(child => child && stage.addChild(child));
                }
                break;
        }
    }

    if (sprite == null) {
        console.error(`canvas2d.createSprite: unknown type`, type);
    }

    if (ref) {
        ref.call(undefined, sprite);
    }

    return sprite;
}

function ensureString(list: any[]) {
    let isString = list.every(item => typeof item === 'string');
    if (!isString) {
        throw new Error(`canvas2d: <text> only can add string children`);
    }
    return true;
}

export default createSprite;