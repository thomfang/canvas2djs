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
    var ball;
    var stageProps = {
        width: 960,
        height: 640,
        scaleMode: canvas2d.ScaleMode.EXACTFIT,
        autoAdjustCanvasSize: true,
        touchEnabled: true,
        mouseEnabled: true,
        canvas: canvas,
    };
    var sceneProps = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        bgColor: 0x333
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
        ],
    };
    var action;
    function santaJump() {
        if (!action) {
            action = new canvas2d.Action(demo.santa);
        }
        else {
            action.clear();
        }
        action.by({
            y: {
                value: -200,
                easing: canvas2d.Tween.easeOutQuad
            }
        }, 0.3)
            .to({
            y: demo.santa.y
        }, 0.2)
            .setRepeatMode(canvas2d.ActionRepeatMode.REPEAT)
            .start();
    }
    var sprites = [
        canvas2d.createSprite("sprite", { width: 100, height: 100, bgColor: 0xf00, alignY: canvas2d.AlignType.CENTER, x: 100 }),
        canvas2d.createSprite("sprite", { width: 100, height: 100, bgColor: 0xf00, alignY: canvas2d.AlignType.CENTER, x: 400 }),
    ];
    canvas2d.createSprite("stage", __assign({}, stageProps, { ref: function (e) { return demo.stage = e; } }),
        canvas2d.createSprite("sprite", __assign({}, sceneProps),
            canvas2d.createSprite("text", __assign({}, titleProps), "canvas2djs"),
            canvas2d.createSprite("sprite", __assign({}, demo.santaProps, { ref: function (e) { return demo.santa = e; } })),
            sprites,
            canvas2d.createSprite("sprite", { ref: function (e) { return demo.btn = e; }, onClick: santaJump, bgColor: 0xf00, alignX: canvas2d.AlignType.CENTER, alignY: canvas2d.AlignType.CENTER, percentHeight: 0.1, percentWidth: 0.1 },
                canvas2d.createSprite("text", { alignX: canvas2d.AlignType.CENTER, alignY: canvas2d.AlignType.CENTER }, "Jump")),
            canvas2d.createSprite("sprite", { radius: 50, bgColor: 0xfff, alignX: canvas2d.AlignType.CENTER, y: 300, ref: function (e) { return ball = e; } })));
    demo.stage.on(canvas2d.UIEvent.TOUCH_MOVED, function (helpers, event) {
        console.log(helpers[0].target);
    });
    new canvas2d.Action(ball).by({ y: 100 }, 0.5).start().setRepeatMode(canvas2d.ActionRepeatMode.REVERSE_REPEAT);
})(demo || (demo = {}));
//# sourceMappingURL=main.js.map