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
            width: 100,
            height: 40,
            bgColor: 'red',
            alignX: canvas2d.AlignType.CENTER,
            y: 200,
            onclick: function () {
                console.log('clicked');
            }
        });
        var label = new canvas2d.TextLabel({
            text: 'canvas2djs',
            fontName: 'arial',
            fontSize: 18,
            fontColor: '#fff',
            stroke: {
                color: '#000',
                width: 2
            },
            alignX: canvas2d.AlignType.CENTER,
            alignY: canvas2d.AlignType.CENTER
        });
        container.addChild(label);
        stage.addChild(container);
    }
    function createSanta() {
        var santa = new canvas2d.Sprite({
            alignX: canvas2d.AlignType.CENTER,
            alignY: canvas2d.AlignType.CENTER,
            onclick: function () {
                new canvas2d.Action(this).by({ y: -200 }, 0.3).by({ y: 200 }, 0.3).start();
            }
        });
        stage.addChild(santa);
        var frameRate = 20; // frame per second
        var frameList = [];
        for (var i = 0; i < 11; i++) {
            frameList.push(new canvas2d.Texture("img/Run_" + i + ".png"));
        }
        new canvas2d.Action(santa).animate(frameList, frameRate).start();
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
            console.log('This is a callback action');
        })
            .by({ x: 100 }, 0.5).by({ x: -100 }, 0.5)
            .to({ y: ball.y - 100 }, 0.5)
            .by({ x: 100 }, 0.5).by({ x: -100 }, 0.5).start();
    }
    createStage();
    createTextLabel();
    createSanta();
    // createBallWithAction();
})(demo || (demo = {}));
//# sourceMappingURL=main.js.map