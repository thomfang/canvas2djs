canvas2d.ts
===
An HTML5 canvas based game engine.


Install
===

```
npm install canvas2djs
```

Usage
===
Include by script:

```html
<script src="path/to/canvas2d.js"></script>
```

Build tool import:
```javascript
var canvas2d = require('canvas2d');

// or
import * as canvas2d from 'canvas2d';
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
        true // auto adjust canvas size
    );

    stage.mouseEnabled = true;
    stage.touchEnabled = true;
    stage.keyboardEnabled = true;
    stage.start();
    ```

* **Sprite**

    ```typescript
    var ball = new Sprite({
        texture: new canvas2d.Texture('res/img/ball.png'),
        x: stage.width * 0.5,
        y: 100
    });
    var box = new Sprite({
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

    stage.addChild(ball);
    stage.addChild(box);
    ```

* **Action**

    ```typescript
    var action = new canvas2d.Action(ball);
    var destProps = {scaleX: 2, scaleY: 2};
    var duration = 0.5; // second
    action.to(destProps, duration);
    action.start(); // run action
    ```
    
* **Texture**

    ```typescript
    var texture = new canvas2d.Texture('path/to/img/xxx.png');
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
