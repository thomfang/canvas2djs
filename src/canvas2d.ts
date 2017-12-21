export * from './Keys';
export * from './Tween';
export * from './Texture';
export * from './action/Action';
export * from './Stage';
export * from './createSprite';
export * from './EventEmitter';
export * from './UIEvent';
export * from './Util';
export * from './ReleasePool';
export * from './CanvasSource';
export * from './sound/Sound';
export * from './sound/HTMLAudio';
export * from './sound/WebAudio';
export * from './sprite/Sprite';
export * from './sprite/BMFontLabel';
export * from './sprite/TextLabel';

import { Sprite } from './sprite/Sprite';
import { Ref, SpriteProps, TextProps, BMFontProps, StageProps } from './createSprite';

declare global {
    namespace JSX {
        interface Element extends Sprite<{}> { }
        interface ElementAttributesProperty { _props: {}; }
        interface IntrinsicClassAttributes<T> extends Ref<T> { }
        interface IntrinsicElements {
            sprite: SpriteProps;
            text: TextProps;
            bmfont: BMFontProps;
            stage: StageProps;
        }
    }
}