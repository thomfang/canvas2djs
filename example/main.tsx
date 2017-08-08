/// <reference path="../declarations/canvas2d.d.ts" />

namespace demo {

    var canvas = document.querySelector('canvas');

    export var stage: canvas2d.Stage;
    export var santa: canvas2d.Sprite<any>;
    export var btn: canvas2d.Sprite<any>;

    var ball: canvas2d.Sprite<any>;
    var stateLabel: canvas2d.TextLabel;

    var stageProps: canvas2d.StageProps = {
        width: 960,
        height: 640,
        scaleMode: canvas2d.ScaleMode.SHOW_ALL,
        autoAdjustCanvasSize: true,
        touchEnabled: true,
        mouseEnabled: true,
        canvas,
        orientation: canvas2d.Orientation.LANDSCAPE2,
        useExternalTimer: true,
    };
    var sceneProps: canvas2d.SpriteProps = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        bgColor: 0x333
    };
    var titleProps: canvas2d.TextProps = {
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
    var tipProps: canvas2d.TextProps = {
        autoResizeWidth: true,
        fontSize: 26,
        bgColor: 0xf00,
        fontColor: 0xfff,
        alignX: canvas2d.AlignType.CENTER,
        top: 10,
    }
    var jumpBtnProps: canvas2d.SpriteProps = {
        bgColor: 0xf00,
        alignX: canvas2d.AlignType.CENTER,
        alignY: canvas2d.AlignType.CENTER,
        percentHeight: 0.1,
        percentWidth: 0.1,
    };
    var jumpBtnLabelProps: canvas2d.TextProps = {
        alignX: canvas2d.AlignType.CENTER,
        alignY: canvas2d.AlignType.CENTER,
        percentWidth: 1,
        fontColor: 0xfff,
        wordWrap: false,
    };
    var stateProps: canvas2d.TextProps = {
        fontColor: 0xf00,
        fontSize: 20,
        left: 20,
        top: 20,
        width: 200,
        textAlign: "left",
        ref: e => stateLabel = e,
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
    }

    var santaFrames = [];

    for (let i = 0; i < 11; i++) {
        santaFrames.push(`img/Run_${i}.png`);
    }

    export var santaProps: canvas2d.SpriteProps = {
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

    var action: canvas2d.Action;

    function santaJump() {
        if (!action) {
            action = new canvas2d.Action(santa)
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
                y: santa.y
            }, 0.2)
            .setRepeatMode(canvas2d.ActionRepeatMode.REPEAT)
            .start();
    }

    var sprites = [
        <sprite width={100} height={100} bgColor={0xfff} alignY={canvas2d.AlignType.CENTER} left={50} onClick={() => { console.log("Click white box") }} />,
        <sprite width={100} height={100} bgColor={0x0f0} alignY={canvas2d.AlignType.CENTER} right={50}
            onClick={() => {
                setTimeout(() => {
                    stage.orientation = stage.orientation === canvas2d.Orientation.LANDSCAPE ?
                        canvas2d.Orientation.LANDSCAPE2 : canvas2d.Orientation.LANDSCAPE;
                }, 100);
            }} />,
    ];

    <stage {...stageProps} ref={e => stage = e} >
        <sprite {...sceneProps}>
            <sprite {...santaProps} ref={e => santa = e} />
            {...sprites}
            <sprite
                ref={e => btn = e}
                onClick={santaJump}
                {...jumpBtnProps}>
                <text {...jumpBtnLabelProps}>Jump!</text>
            </sprite>
            {/*<sprite radius={50} bgColor={0xfff} alignX={canvas2d.AlignType.CENTER} y={300} ref={e => ball = e} onClick={e => console.log("white circle")} clipOverflow>
                <sprite width={50} height={50} bgColor={0xf00} onClick={(e) => {
                    console.log("red box");
                }} />
            </sprite>*/}
            {/*<sprite touchEnabled={false} left={10} right={10} top={10} bottom={10} grid={[20,20,20,20]} texture="img/roundrect-bg.png" />*/}
            <text {...titleProps} />
            {/* <text {...tipProps} text="This is a text with\n autoResizeWidth=true."></text> */}
            <text {...stateProps} update={() => {
                stateLabel.textFlow = [{ text: `FPS:${stage.currFPS}\nRender:${stage.renderCostTime}\nCompute:${stage.computeCostTime}\nAction:${canvas2d.Action.scheduleCostTime}` }]
            }} />
            <bmfont
                textureMap={textureMap}
                text="10086"
                percentWidth={1}
                lineHeight={80}
                fontSize={46}
                alignX={canvas2d.AlignType.CENTER}
                bottom={30} />
        </sprite>
    </stage>;

    // stage.on(canvas2d.UIEvent.TOUCH_MOVED, (helpers, event) => {
    //     console.log(helpers[0].target)
    // });
    // stage.on(canvas2d.UIEvent.CLICK, (helper) => {
    //     console.log(helper.target);
    // });

    // new canvas2d.Action(ball).by({y: 100}, 0.5).start().setRepeatMode(canvas2d.ActionRepeatMode.REVERSE_REPEAT);

    let lastUpdateTime = Date.now();

    function loop() {
        requestAnimationFrame(() => {
            loop();

            let now = Date.now();
            let dt = (now - lastUpdateTime) / 1000;
            lastUpdateTime = now;

            canvas2d.Action.schedule(dt);
            stage.step(dt);
            stage.render();
        });
    }

    loop();
}
