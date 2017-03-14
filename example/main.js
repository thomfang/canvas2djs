var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
/// <reference path="../declarations/canvas2d.d.ts" />
var demo;
(function (demo) {
    var canvas = document.querySelector('canvas');
    var stageProps = {
        width: window.innerWidth,
        height: window.innerHeight,
        scaleMode: canvas2d.ScaleMode.SHOW_ALL,
        autoAdjustCanvasSize: true,
        touchEnabled: true,
        mouseEnabled: true,
        canvas: canvas,
    };
    var sceneProps = {
        width: stageProps.width,
        height: stageProps.height,
        alignX: canvas2d.AlignType.CENTER,
        alignY: canvas2d.AlignType.CENTER,
    };
    var titleProps = {
        y: 30,
        alignX: canvas2d.AlignType.CENTER,
        fontName: 'Arial',
        fontSize: 30,
        fontColor: 0xfff,
        strokeWidth: 2,
        strokeColor: 0x00f
    };
    var santaFrames = [];
    for (var i = 0; i < 11; i++) {
        santaFrames.push("img/Run_" + i + ".png");
    }
    demo.santaProps = {
        alignX: canvas2d.AlignType.CENTER,
        alignY: canvas2d.AlignType.CENTER,
        actions: [
            [{
                    type: canvas2d.ActionType.ANIM,
                    frameList: santaFrames,
                    frameRate: 20
                }]
        ]
    };
    var action;
    function santaJump() {
        if (action) {
            return;
        }
        action = new canvas2d.Action(demo.santa)
            .by({
            y: {
                value: -200,
                easing: canvas2d.Tween.easeOutQuad
            }
        }, 0.3)
            .to({
            y: demo.santa.y
        }, 0.2)
            .then(function () { return action = null; })
            .start();
    }
    canvas2d.createSprite("stage", __assign({}, stageProps, { ref: function (e) { return demo.stage = e; } }),
        canvas2d.createSprite("sprite", __assign({}, sceneProps),
            canvas2d.createSprite("text", __assign({}, titleProps), "canvas2djs"),
            canvas2d.createSprite("sprite", __assign({}, demo.santaProps, { ref: function (e) { return demo.santa = e; }, onClick: santaJump })),
            canvas2d.createSprite("sprite", null)));
})(demo || (demo = {}));
//# sourceMappingURL=main.js.map