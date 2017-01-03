import * as Util from './Util';
import Keys from './Keys';
import Tween, { IEasingFunction } from './Tween';
import Action, { ActionType, IActionListener, TransitionByAttrs, TransitionToAttrs } from './Action';
import EventEmitter, { IEventListener } from './EventEmitter';
import { HTMLAudio, WebAudio } from './Audio';
import Sound from './Sound';
import Texture from './Texture';
import UIEvent, { IEventHelper } from './UIEvent';
import Sprite, { AlignType, RAD_PER_DEG, ISprite } from './Sprite';
import TextLabel, { ITextLabel } from './TextLabel';
import BMFontLabel, { IBMFontLabel } from './BMFontLabel';
import Stage, { ScaleMode } from './Stage';
import createSprite, { ActionProps, StageProps, SpriteProps, TextProps, BMFontProps, Ref } from './createSprite';
export { Util, Keys, Tween, Action, ActionType, TransitionByAttrs, TransitionToAttrs, EventEmitter, HTMLAudio, WebAudio, Sound, Texture, UIEvent, Sprite, AlignType, RAD_PER_DEG, TextLabel, BMFontLabel, createSprite, ActionProps, Stage, StageProps, ScaleMode, SpriteProps, TextProps, ISprite, ITextLabel, IEventHelper, IEventListener, IBMFontLabel, IEasingFunction, IActionListener };
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
