import { Sprite, ISprite } from './sprite/Sprite';
import { TextLabel, ITextLabel } from './sprite/TextLabel';
import { BMFontLabel, IBMFontLabel } from './sprite/BMFontLabel';
import { Stage, ScaleMode } from './Stage';
import { ActionQueue } from './action/Action';
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
export declare function createSprite<T, U>(type: "sprite", props: SpriteProps, ...children: any[]): Sprite<{}>;
export declare function createSprite<T, U>(type: "text", props: TextProps, ...children: any[]): TextLabel;
export declare function createSprite<T, U>(type: "bmfont", props: BMFontProps, ...children: any[]): BMFontLabel;
export declare function createSprite<T, U>(type: "stage", props: StageProps, ...children: any[]): Stage;
export declare function createSprite<T, U>(type: SpriteClass<T, U>, props: T & SpriteProps, ...children: any[]): U;
