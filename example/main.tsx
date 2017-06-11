/// <reference path="../declarations/canvas2d.d.ts" />

namespace demo {

    var canvas = document.querySelector('canvas');

    export var stage: canvas2d.Stage;
    export var santa: canvas2d.Sprite<any>;
    export var btn: canvas2d.Sprite<any>;

    var ball: canvas2d.Sprite<any>;

    var stageProps: canvas2d.StageProps = {
        width: 960,
        height: 640,
        scaleMode: canvas2d.ScaleMode.NO_BORDER,
        autoAdjustCanvasSize: true,
        touchEnabled: true,
        mouseEnabled: true,
        canvas,
    };
    var sceneProps: canvas2d.SpriteProps = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        bgColor: 0x333
    };
    var titleProps: canvas2d.TextProps = {
        y: 30,
        alignX: canvas2d.AlignType.CENTER,
        fontName: 'Arial',
        fontSize: 30,
        fontColor: 0xfff,
        strokeWidth: 2,
        strokeColor: 0x00f
    };

    var santaFrames = [];

    for (let i = 0; i < 11; i++) {
        santaFrames.push(`img/Run_${i}.png`);
    }

    export var santaProps: canvas2d.SpriteProps = {
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
        <sprite width={100} height={100} bgColor={0xf00} alignY={canvas2d.AlignType.CENTER} x={100} />,
        <sprite width={100} height={100} bgColor={0xf00} alignY={canvas2d.AlignType.CENTER} x={400} />,
    ];

    <stage {...stageProps} ref={e => stage = e} >
        <sprite {...sceneProps}>
            {/*<text {...titleProps}>
                canvas2djs
            </text>
            <sprite {...santaProps} ref={e => santa = e} />
            {...sprites}
            <sprite
                ref={e => btn = e}
                onClick={santaJump}
                bgColor={0xf00}
                alignX={canvas2d.AlignType.CENTER}
                alignY={canvas2d.AlignType.CENTER}
                percentHeight={0.1}
                percentWidth={0.1}>
                <text alignX={canvas2d.AlignType.CENTER} alignY={canvas2d.AlignType.CENTER}>Jump</text>
            </sprite>*/}
            <sprite radius={50} bgColor={0xfff} alignX={canvas2d.AlignType.CENTER} y={300} ref={e => ball = e} onClick={e => console.log("white circle")} clipOverflow>
                <sprite width={50} height={50} bgColor={0xf00} onClick={(e) => {
                    console.log("red box");
                    {/*e.stopPropagation();*/}
                }} />
            </sprite>
            {/*<sprite touchEnabled={false} left={10} right={10} top={10} bottom={10} grid={[20,20,20,20]} texture="img/roundrect-bg.png" />*/}
        </sprite>
    </stage>;

    stage.on(canvas2d.UIEvent.TOUCH_MOVED, (helpers, event) => {
        console.log(helpers[0].target)
    });
    stage.on(canvas2d.UIEvent.CLICK, (helper) => {
        console.log(helper.target);
    });

    // new canvas2d.Action(ball).by({y: 100}, 0.5).start().setRepeatMode(canvas2d.ActionRepeatMode.REVERSE_REPEAT);
}
