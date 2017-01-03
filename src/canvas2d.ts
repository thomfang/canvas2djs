import * as Util from './Util';
import Keys from './Keys';
import Tween, { IEasingFunction } from './Tween';
import Action, { ActionType, IActionListener, TransitionByProps, TransitionToProps } from './Action';
import EventEmitter, { IEventListener } from './EventEmitter';
import { HTMLAudio, WebAudio } from './Audio';
import Sound from './Sound';
import Texture from './Texture';
import UIEvent, { IEventHelper } from './UIEvent';
import Sprite, { AlignType, RAD_PER_DEG, ISprite } from './Sprite';
import TextLabel, { ITextLabel } from './TextLabel';
import BMFontLabel, { IBMFontLabel } from './BMFontLabel';
import Stage, { ScaleMode } from './Stage';
import createSprite, { ActionProps, StageProps, SpriteProps, TextProps, BMFontProps, SpriteClass, Ref } from './createSprite';

export {
    Util,
    Keys,
    Tween,
    Action,
    EventEmitter,
    HTMLAudio,
    WebAudio,
    Sound,
    Texture,
    UIEvent,
    Sprite,
    AlignType,
    RAD_PER_DEG,
    TextLabel,
    BMFontLabel,
    createSprite,
    Stage,
    ScaleMode,
    ISprite,
    ITextLabel,
    IEventHelper,
    IEventListener,
    IBMFontLabel,
    IEasingFunction,
    IActionListener,
    ActionType,
    TransitionByProps,
    TransitionToProps,
    StageProps,
    SpriteProps,
    TextProps,
    BMFontProps,
    ActionProps,
    SpriteClass,
    Ref,
}

declare global {
    namespace JSX {
        interface Element extends Sprite<any> { }
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