export { Keys } from './Keys';
export { Tween, EasingFunc } from './Tween';
export { Texture, Rect } from './Texture';
export { Action, ActionType } from './action/Action';
export { Stage, ScaleMode, VisibleRect } from './Stage';
export { EventEmitter } from './EventEmitter';
export { Sound } from './sound/Sound';
export { UIEvent } from './UIEvent';
export { TextLabel } from './sprite/TextLabel';
export { BMFontLabel } from './sprite/BMFontLabel';
import { Sprite, AlignType, RAD_PER_DEG } from './sprite/Sprite';
import { createSprite, ActionProps, StageProps, SpriteProps, TextProps, BMFontProps, SpriteClass, Ref } from './createSprite';
export { Sprite, AlignType, RAD_PER_DEG, createSprite, ActionProps, StageProps, SpriteProps, TextProps, BMFontProps, SpriteClass, Ref };
declare global  {
    namespace JSX {
        interface Element extends Sprite<any> {
        }
        interface ElementAttributesProperty {
            _props: {};
        }
        interface IntrinsicClassAttributes<T> extends Ref<T> {
        }
        interface IntrinsicElements {
            sprite: SpriteProps;
            text: TextProps;
            bmfont: BMFontProps;
            stage: StageProps;
        }
    }
}

export as namespace canvas2d;
