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
    var stateLabel;
    var stageProps = {
        width: 960,
        height: 640,
        scaleMode: canvas2d.ScaleMode.SHOW_ALL,
        autoAdjustCanvasSize: true,
        touchEnabled: true,
        mouseEnabled: true,
        canvas: canvas,
        orientation: canvas2d.Orientation.LANDSCAPE2,
        useExternalTimer: true,
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
        fontSize: 24,
        fontColor: 0xfff,
        strokeWidth: 2,
        strokeColor: 0x00f,
        // percentWidth: 0.7,
        width: 450,
        lineHeight: 50,
        // bgColor: 0xfff,
        // textFlow: [
        //     {
        //         text: "欢迎来到"
        //     },
        //     {
        //         text: "天天坦克大战", fontColor: 0x0f0,
        //     },
        //     {
        //         text: "，现在战火连天，快烧到你的屁股上了，你准备好了吗？加入战斗，给他一炮！"
        //     }
        // ],
        textFlow: [
            { text: "canvas2d" },
            { text: "JS\n", fontColor: 0xf00, strokeColor: 0xfff, fontSize: 40, },
            { text: "--  " },
            { text: "Todd Fon", fontColor: 0xff0, fontWeight: "bold" }
        ]
    };
    var tipProps = {
        autoResizeWidth: true,
        fontSize: 26,
        bgColor: 0xf00,
        fontColor: 0xfff,
        alignX: canvas2d.AlignType.CENTER,
        top: 10,
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
        wordWrap: false,
    };
    var stateProps = {
        fontColor: 0xf00,
        fontSize: 20,
        left: 20,
        top: 20,
        width: 200,
        textAlign: "left",
        ref: function (e) { return stateLabel = e; },
    };
    var textureMap = {
        0: "img/0.png",
        1: "img/1.png",
        2: "img/2.png",
        3: "img/3.png",
        4: "img/4.png",
        5: "img/5.png",
        6: "img/6.png",
        7: "img/7.png",
        8: "img/8.png",
        9: "img/9.png",
    };
    var santaFrames = [];
    for (var i = 0; i < 11; i++) {
        santaFrames.push("img/Run_" + i + ".png");
    }
    demo.santaProps = {
        alignX: canvas2d.AlignType.CENTER,
        alignY: canvas2d.AlignType.CENTER,
        // texture: "img/Run_0.png",
        actions: [
            {
                queue: [{
                        type: canvas2d.ActionType.ANIM,
                        frameList: santaFrames,
                        frameRate: 20,
                        repetitions: 1,
                    }],
                repeatMode: canvas2d.ActionRepeatMode.REVERSE_REPEAT,
            }
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
                canvas2d.createSprite("text", __assign({}, jumpBtnLabelProps), "Jump!")),
            canvas2d.createSprite("text", __assign({}, titleProps)),
            canvas2d.createSprite("text", __assign({}, stateProps, { update: function () {
                    stateLabel.textFlow = [{ text: "FPS:" + demo.stage.currFPS + "\nRender:" + demo.stage.renderCostTime + "\nCompute:" + demo.stage.computeCostTime + "\nAction:" + canvas2d.Action.scheduleCostTime }];
                } })),
            canvas2d.createSprite("bmfont", { textureMap: textureMap, text: "10086", percentWidth: 1, lineHeight: 80, fontSize: 46, alignX: canvas2d.AlignType.CENTER, bottom: 30 })));
    // stage.on(canvas2d.UIEvent.TOUCH_MOVED, (helpers, event) => {
    //     console.log(helpers[0].target)
    // });
    // stage.on(canvas2d.UIEvent.CLICK, (helper) => {
    //     console.log(helper.target);
    // });
    // new canvas2d.Action(ball).by({y: 100}, 0.5).start().setRepeatMode(canvas2d.ActionRepeatMode.REVERSE_REPEAT);
    var lastUpdateTime = Date.now();
    function loop() {
        requestAnimationFrame(function () {
            loop();
            var now = Date.now();
            var dt = (now - lastUpdateTime) / 1000;
            lastUpdateTime = now;
            canvas2d.Action.schedule(dt);
            demo.stage.step(dt);
            demo.stage.render();
        });
    }
    loop();
})(demo || (demo = {}));
//# sourceMappingURL=main.js.map