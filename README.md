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

canvas2djs support 4 base tags: `<stage />`, `<sprite />`, `<text />`, `<bmfont />`, 

```tsx
// index.tsx
/// <reference types="canvas2djs" />
/// <reference path="./Scene.tsx" />

namespace demo {

    const STAGE_WIDTH = window.innerWidth;
    const STAGE_HEIGHT = window.innerHeight;

    var stage: canvas2d.Stage;

    <stage
        canvas={document.querySelector('canvas')}
        width={STAGE_WIDTH}
        height={STAGE_HEIGHT}
        scaleMode={canvas2d.ScaleMode.SHOW_ALL}
        autoAdjustCanvasSize
        touchEnabled
        mouseEnabled
        ref={e => stage = e}>
        <Scene stageWidth={STAGE_WIDTH} stageHeight={STAGE_HEIGHT} />
    </stage>
}
```

```tsx
// Scene.tsx
/// <reference types="canvas2djs" />

namespace demo {
    export type SceneProps = {
        stageWidth: number;
        stageHeight: number;
    }

    export class Scene extends canvas2d.Sprite<SceneProps> {

        private box: canvas2d.Sprite<{}>;
        private text: canvas2d.TextLabel;
        private action: canvas2d.Action;

        constructor(...args: any[]) {
            super(...args);

            this.addChild(
                <sprite
                    originX={0}
                    originY={0}
                    width={this.stageWidth}
                    height={this.stageHeight}
                    bgColor={0x000}>
                    <text
                        alignX={canvas2d.AlignType.CENTER}
                        stroke={{ color: 0x00f, width: 3 }}
                        y={20}
                        fontColor={0xfff}>
                        Hello, canvas2d!
                    </text>

                    <sprite
                        ref={e => this.box = e}
                        width={100}
                        height={100}
                        bgColor={0xf00}
                        alignX={canvas2d.AlignType.CENTER}
                        alignY={canvas2d.AlignType.CENTER}
                        onClick={() => this.toggleColor()}>
                        <text
                            ref={e => this.text = e}
                            alignX={canvas2d.AlignType.CENTER}
                            alignY={canvas2d.AlignType.CENTER}
                            fontColor={0xfff}>
                            Click me!
                        </text>
                    </sprite>
                </sprite>
            );
        }

        toggleColor() {
            this.box.bgColor = this.box.bgColor == 0xf00 ? 0xfff : 0xf00;
            this.text.fontColor = this.text.fontColor == 0xfff ? 0xf00 : 0xfff;

            if (this.action) {
                this.action.stop();
            }
            this.action = new canvas2d.Action(this.box).by({
                rotation: {
                    value: 360,
                    easing: canvas2d.Tween.linear
                }
            }, 0.5).start();
        }
    }
}
```
