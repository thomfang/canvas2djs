import { uid, addArrayItem, removeArrayItem, normalizeColor } from './Util';
import Keys from './Keys';
import Tween from './Tween';
import Action, { ActionType } from './Action';
import EventEmitter from './EventEmitter';
import { HTMLAudio, WebAudio } from './Audio';
import Sound from './Sound';
import Texture from './Texture';
import UIEvent from './UIEvent';
import Sprite, { AlignType, RAD_PER_DEG } from './Sprite';
import TextLabel from './TextLabel';
import BMFontLabel from './BMFontLabel';
import Stage, { ScaleMode } from './Stage';
import createSprite from './createSprite';

export default {
    Util: {
        uid: uid,
        addArrayItem: addArrayItem,
        removeArrayItem: removeArrayItem,
        normalizeColor: normalizeColor,
    },
    Keys: Keys,
    Tween: Tween,
    Action: Action,
    ActionType: ActionType,
    EventEmitter: EventEmitter,
    HTMLAudio: HTMLAudio,
    WebAudio: WebAudio,
    Sound: Sound,
    Texture: Texture,
    UIEvent: UIEvent,
    Sprite: Sprite,
    TextLabel: TextLabel,
    BMFontLabel: BMFontLabel,
    Stage: Stage,
    AlignType: AlignType,
    RAD_PER_DEG: RAD_PER_DEG,
    ScaleMode: ScaleMode,
    createSprite: createSprite,
}