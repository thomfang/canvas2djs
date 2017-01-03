import Sprite, { ISprite } from './Sprite';
import TextLabel, { ITextLabel } from './TextLabel';
import BMFontLabel, { IBMFontLabel } from './BMFontLabel';
import Stage, { ScaleMode } from './Stage';
import { ActionQueue } from './Action';
export interface Ref<T> {
    ref?(instance: T): any;
}
export declare type ActionProps = {
    actions?: ActionQueue[];
};
export declare type SpriteProps = ISprite & Ref<Sprite<{}>> & ActionProps;
export declare type TextProps = ITextLabel & Ref<TextLabel> & ActionProps;
export declare type BMFontProps = IBMFontLabel & Ref<BMFontLabel> & ActionProps;
export declare type SpriteClass<T, U> = new (attrs?: T & ISprite) => U;
export declare type StageProps = {
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
declare function createSprite<T, U>(type: "sprite", props: SpriteProps, ...children: any[]): Sprite<{}>;
declare function createSprite<T, U>(type: "text", props: TextProps, ...children: any[]): TextLabel;
declare function createSprite<T, U>(type: "bmfont", props: BMFontProps, ...children: any[]): BMFontLabel;
declare function createSprite<T, U>(type: "stage", props: StageProps, ...children: any[]): Stage;
declare function createSprite<T, U>(type: SpriteClass<T, U>, props: T & SpriteProps, ...children: any[]): U;
export default createSprite;
