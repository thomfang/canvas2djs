canvas2djs
===
canvas2djs is an HTML5 canvas based game engine. Simple API allows you to quickly develop HTML5 games.


Installation
===

```
npm install --save canvas2djs
```

Usage
===
Include by script:

```html
<script src="path/to/canvas2d.js"></script>
```

Or use `import`:
```javascript
import * as canvas2d from 'canvas2djs';
```

Quick start
===

* **Stage**
    
    ```typescript
    var stage = new canvas2d.Stage(
        document.querySelector('canvas'), // HTMLCanvasElement
        window.innerWidth, // canvas width
        window.innerHeight, // canvas height
        canvas2d.ScaleMode.SHOW_ALL, // design resolution scale mode
        true // auto adjust canvas size when window resize
    );

    stage.mouseEnabled = true;
    stage.touchEnabled = true;
    stage.keyboardEnabled = true;
    stage.start();
    ```

* **Sprite**

    ```typescript
    var scene = new canvas2d.Sprite({
        // draw origin will be left-top
        originX: 0, // default to be 0.5
        originY: 0, // default to be 0.5

        width: stage.width,
        height: stage.height
    });
    var ball = new canvas2d.Sprite({
        texture: new canvas2d.Texture('res/img/ball.png'),
        x: stage.width * 0.5,
        y: 100
    });
    var box = new canvas2d.Sprite({
        bgColor: 'black',
        border: {
            width: 1,
            color: 'red'
        },
        width: 100,
        height: 100,
        alignX: canvas2d.AlignType.CENTER,
        alignY: canvas2d.AlignType.CENTER
    });

    scene.addChild(ball);
    scene.addChild(box);
    stage.addChild(scene);
    ```
    
* **Texture**

    ```typescript
    var texture1 = new canvas2d.Texture('path/to/img/sprite.png');
    // as same as:
    var texture1 = canvas2d.Texture.create('path/to/img/sprite.png');

    // clip a texture from sprite sheet
    var clipRect = {x: 0, y: 0, width: 100, height: 100};
    var texture2 = new canvas2d.Texture('path/to/img/spritesheet.png', clipRect);
    ```

* **TextLabel**

    ```typescript
    var title = new canvas2d.TextLabel({
        text: 'canvas2d',
        fontSize: 32,
        fontFamily: 'Arial',
        fontWeight: 'bold',
        x: stage.width * 0.5,
        y: 50
    });

    stage.addChild(title);
    ```

* **Sound**

    ```typescript
    canvas2d.Sound.enabled = true;
    canvas2d.Sound.extension = '.mp3';

    canvas2d.Sound.load('path/to/', 'bgMusic', () => {
        canvas2d.Sound.play('bgMusic');
    });
    ```

* **Action**

    ```typescript
    var redBall = new canvas2d.Sprite({
        x: stage.width * 0.5,
        y: stage.height * 0.5,
        scaleX: 1,
        scaleY: 1,
        bgColor: 'red',
        radius: 50
    });
    stage.addChild(redBall);

    function scale() {
        let action = new canvas2d.Action(redBall);
        let propOptions = {
            scaleX: 2, // will use default easing function
            scaleY: {
                dest: 2,
                easing: canvas2d.Tween.easeInOutQuad
            }
        };
        let duration = 0.5; // second

        action.to(propOptions, duration);
        action.then(() => {
            console.log('Scale action ended, restore action will start');

            // restore action
            restore();
        })
        action.start(); // run action
    }

    function restore() {
        new canvas2d.Action(redBall)
            .by({scaleX: -1, scaleY: -1})
            .then(scale)
            .start();
    }

    scale();
    ```
