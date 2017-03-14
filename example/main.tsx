/// <reference path="../declarations/canvas2d.d.ts" />

namespace demo {

    var canvas = document.querySelector('canvas');

    export var stage: canvas2d.Stage;
    export var santa: canvas2d.Sprite<any>;

    var stageProps: canvas2d.StageProps = {
        width: window.innerWidth,
        height: window.innerHeight,
        scaleMode: canvas2d.ScaleMode.SHOW_ALL,
        autoAdjustCanvasSize: true,
        touchEnabled: true,
        mouseEnabled: true,
        canvas,
    };
    var sceneProps: canvas2d.SpriteProps = {
        width: stageProps.width,
        height: stageProps.height,
        alignX: canvas2d.AlignType.CENTER,
        alignY: canvas2d.AlignType.CENTER,
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
        ]
    };

    var action: canvas2d.Action;

    function santaJump() {
        if (action) {
            return;
        }

        action = new canvas2d.Action(santa)
            .by({
                y: {
                    value: -200,
                    easing: canvas2d.Tween.easeOutQuad
                }
            }, 0.3)
            .to({
                y: santa.y
            }, 0.2)
            .then(() => action = null)
            .start();
    }

    <stage {...stageProps} ref={e => stage = e} >
        <sprite {...sceneProps}>
            <text {...titleProps}>
                canvas2djs
            </text>
            <sprite {...santaProps} ref={e => santa = e} onClick={santaJump} />
            <sprite />
        </sprite>
    </stage>;
}
