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

canvas2djs with TypeScript and tsx
===

`tsconfig.json`

```json
{
    "compilerOptions": {
        // ...
        "jsx": "react",
        "jsxFactory": "canvas2d.createSprite"
    }
}
```

Import canvas2djs declaration in .tsx files:

```typescript
// test.tsx

// use ref
/// <reference types="canvas2djs" />


// or import as a module
import * as canvas2d from 'canvas2djs';
```

canvas2djs supports : `<stage />`, `<sprite />`, `<text />`, `<bmfont />`, 

```tsx
// example:
/// <reference types="canvas2djs" />

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
        originX: 0,
        originY: 0,
        width: stageProps.width,
        height: stageProps.height
    };
    var titleProps: canvas2d.TextProps = {
        y: 30,
        alignX: canvas2d.AlignType.CENTER,
        fontName: 'Arial',
        fontSize: 30,
        fontColor: 0xfff,
        strokeWidth: 2,
        strokeColor: 0x00f,
    };

    var santaFrames = [];

    for (let i = 0; i < 11; i++) {
        santaFrames.push(`img/Run_${i}.png`);
    }

    export var santaProps: canvas2d.SpriteProps = {
        alignX: canvas2d.AlignType.CENTER,
        alignY: canvas2d.AlignType.CENTER,
        actions: [{
            queue: [{
                type: canvas2d.ActionType.ANIM,
                frameList: santaFrames,
                frameRate: 20
            }],
            repeatMode: canvas2d.ActionRepeatMode.REVERSE_REPEAT,
        }]
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
        </sprite>
    </stage>;
}

```
