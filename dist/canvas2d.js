/**
 * canvas2djs v0.2.7
 * Copyright (c) 2013-present Todd Fon
 * All rights reserved.
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define('canvas2d', factory) :
	(factory());
}(this, (function () { 'use strict';

var Util = require("./Util");
exports.Util = Util;
var Keys_1 = require("./Keys");
exports.Keys = Keys_1.default;
var Tween_1 = require("./Tween");
exports.Tween = Tween_1.default;
var Action_1 = require("./Action");
exports.Action = Action_1.default;
exports.ActionType = Action_1.ActionType;
var EventEmitter_1 = require("./EventEmitter");
exports.EventEmitter = EventEmitter_1.default;
var Audio_1 = require("./Audio");
exports.HTMLAudio = Audio_1.HTMLAudio;
exports.WebAudio = Audio_1.WebAudio;
var Sound_1 = require("./Sound");
exports.Sound = Sound_1.default;
var Texture_1 = require("./Texture");
exports.Texture = Texture_1.default;
var UIEvent_1 = require("./UIEvent");
exports.UIEvent = UIEvent_1.default;
var Sprite_1 = require("./Sprite");
exports.Sprite = Sprite_1.default;
exports.AlignType = Sprite_1.AlignType;
exports.RAD_PER_DEG = Sprite_1.RAD_PER_DEG;
var TextLabel_1 = require("./TextLabel");
exports.TextLabel = TextLabel_1.default;
var BMFontLabel_1 = require("./BMFontLabel");
exports.BMFontLabel = BMFontLabel_1.default;
var Stage_1 = require("./Stage");
exports.Stage = Stage_1.default;
exports.ScaleMode = Stage_1.ScaleMode;
var createSprite_1 = require("./createSprite");
exports.createSprite = createSprite_1.default;

})));
//# sourceMappingURL=canvas2d.js.map
