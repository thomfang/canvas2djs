/// <reference path="../dist/canvas2d.d.ts" />
var demo;
(function (demo) {
    var canvas = document.querySelector('canvas');
    var stage;
    function createStage() {
        stage = new canvas2d.Stage(canvas, window.innerWidth, window.innerHeight, canvas2d.ScaleMode.SHOW_ALL, true);
        stage.mouseEnabled = true;
        stage.touchEnabled = true;
        stage.start();
    }
    function createTextLabel() {
        var container = new canvas2d.Sprite({
            width: 80,
            height: 20,
            bgColor: 'red',
            alignX: canvas2d.AlignType.CENTER,
            y: 200,
            onclick: function () {
                console.log('clicked');
            }
        });
        var label = new canvas2d.TextLabel({
            text: '+20攻击力',
            fontName: 'arial',
            fontSize: 12,
            fontColor: '#0f0',
            stroke: {
                color: '#000',
                width: 1
            },
            alignX: canvas2d.AlignType.CENTER,
            alignY: canvas2d.AlignType.CENTER
        });
        container.addChild(label);
        stage.addChild(container);
    }
    function createBallWithAction() {
        var ball = new canvas2d.Sprite({
            bgColor: 'red',
            x: stage.width * 0.5,
            y: stage.height * 0.5,
            radius: 20
        });
        stage.addChild(ball);
        new canvas2d.Action(ball)
            .by({ x: 100 }, 0.5).by({ x: -100 }, 0.5)
            .by({ x: 100 }, 0.5).by({ x: -100 }, 0.5)
            .by({ x: 100 }, 0.5).by({ x: -100 }, 0.5)
            .by({ x: 100 }, 0.5).by({ x: -100 }, 0.5)
            .then(function () {
            console.log('this is a callback action');
        })
            .by({ x: 100 }, 0.5).by({ x: -100 }, 0.5)
            .to({ y: ball.y - 100 }, 0.5)
            .by({ x: 100 }, 0.5).by({ x: -100 }, 0.5).start();
    }
    createStage();
    createTextLabel();
    createBallWithAction();
})(demo || (demo = {}));
//# sourceMappingURL=main.js.map