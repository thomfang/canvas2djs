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
        scaleMode: canvas2d.ScaleMode.SHOW_ALL,
        autoAdjustCanvasSize: true,
        touchEnabled: true,
        mouseEnabled: true,
        canvas: canvas,
        orientation: canvas2d.Orientation.LANDSCAPE2
    };
    var sceneProps = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        bgColor: 0x333
    };
    var titleProps = {
        top: 30,
        alignX: canvas2d.AlignType.CENTER,
        fontName: 'Arial',
        fontSize: 30,
        fontColor: 0xfff,
        strokeWidth: 2,
        strokeColor: 0x00f,
        percentWidth: 1,
        lineHeight: 50,
    };
    var jumpBtnProps = {
        bgColor: 0xf00,
        alignX: canvas2d.AlignType.CENTER,
        alignY: canvas2d.AlignType.CENTER,
        percentHeight: 0.1,
        percentWidth: 0.1,
    };
    var jumpBtnLabelProps = {
        alignX: canvas2d.AlignType.CENTER,
        alignY: canvas2d.AlignType.CENTER,
        percentWidth: 1,
        fontColor: 0xfff,
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
        canvas2d.createSprite("sprite", { width: 100, height: 100, bgColor: 0xfff, alignY: canvas2d.AlignType.CENTER, left: 50, onClick: function () { console.log("Click white box"); } }),
        canvas2d.createSprite("sprite", { width: 100, height: 100, bgColor: 0x0f0, alignY: canvas2d.AlignType.CENTER, right: 50, onClick: function () {
                setTimeout(function () {
                    demo.stage.orientation = demo.stage.orientation === canvas2d.Orientation.LANDSCAPE ?
                        canvas2d.Orientation.LANDSCAPE2 : canvas2d.Orientation.LANDSCAPE;
                }, 100);
            } }),
    ];
    canvas2d.createSprite("stage", __assign({}, stageProps, { ref: function (e) { return demo.stage = e; } }),
        canvas2d.createSprite("sprite", __assign({}, sceneProps),
            canvas2d.createSprite("sprite", __assign({}, demo.santaProps, { ref: function (e) { return demo.santa = e; } })),
            sprites,
            canvas2d.createSprite("sprite", __assign({ ref: function (e) { return demo.btn = e; }, onClick: santaJump }, jumpBtnProps),
                canvas2d.createSprite("text", __assign({}, jumpBtnLabelProps), "Jump")),
            canvas2d.createSprite("text", __assign({}, titleProps, { textFlow: [
                    { text: "canvas2d" },
                    { text: "JS\n", fontColor: 0xf00, strokeColor: 0xfff, fontSize: 40, },
                    { text: "--  " },
                    { text: "Todd Fon", fontColor: 0xff0, fontWeight: "bold" }
                ] }))));
    // stage.on(canvas2d.UIEvent.TOUCH_MOVED, (helpers, event) => {
    //     console.log(helpers[0].target)
    // });
    // stage.on(canvas2d.UIEvent.CLICK, (helper) => {
    //     console.log(helper.target);
    // });
    // new canvas2d.Action(ball).by({y: 100}, 0.5).start().setRepeatMode(canvas2d.ActionRepeatMode.REVERSE_REPEAT);
    function loadImage(src, onCompleted) {
        var img = new Image();
        img.onload = function () {
            onCompleted(img);
        };
        img.src = src;
    }
    var numSources = [
        "img/0.png",
        "img/1.png",
        "img/2.png",
        "img/3.png",
        "img/4.png",
        "img/5.png",
        "img/6.png",
        "img/7.png",
        "img/8.png",
        "img/9.png",
    ];
    var loaded = 0;
    var textureMap = {};
    numSources.forEach(function (src, i) {
        loadImage(src, function (img) {
            textureMap[i] = canvas2d.Texture.create(img);
            if (++loaded === numSources.length) {
                demo.stage.addChild(canvas2d.createSprite("bmfont", { textureMap: textureMap, text: "10086", percentWidth: 1, lineHeight: 80, fontSize: 46, alignX: canvas2d.AlignType.CENTER, bottom: 30 }));
            }
        });
    });
})(demo || (demo = {}));
//# sourceMappingURL=main.js.map