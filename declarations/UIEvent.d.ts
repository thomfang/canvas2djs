import { Stage } from './Stage';
import { Sprite } from './sprite/Sprite';
export declare type EventHelper = {
    identifier?: number;
    beginX: number;
    beginY: number;
    localX?: number;
    localY?: number;
    stageX?: number;
    stageY?: number;
    _moved?: boolean;
    beginTarget?: Sprite<any>;
    target?: Sprite<any>;
    cancelBubble: boolean;
};
export declare class UIEvent {
    static Event: {
        touchBegin: string;
        touchMoved: string;
        touchEnded: string;
        keyDown: string;
        keyUp: string;
        mouseBegin: string;
        mouseMoved: string;
        mouseEnded: string;
    };
    static supportTouch: boolean;
    private _registered;
    private _touchHelperMap;
    private _mouseBeginHelper;
    private _mouseMovedHelper;
    stage: Stage;
    element: HTMLElement;
    constructor(stage: Stage);
    register(): void;
    unregister(): void;
    release(): void;
    transformLocation(event: any): {
        x: number;
        y: number;
    };
    private _transformTouches(touches, justGet?);
    private _touchBeginHandler;
    private _touchMovedHandler;
    private _touchEndedHandler;
    private _mouseBeginHandler;
    private _mouseMovedHandler;
    private _mouseEndedHandler;
    private _keyDownHandler;
    private _keyUpHandler;
    private _dispatchTouch(sprite, offsetX, offsetY, helpers, event, methodName, needTriggerClick?);
    private _dispatchMouse(sprite, offsetX, offsetY, helper, event, methodName, triggerClick?);
    private _dispatchKeyboard(sprite, keyCode, event, methodName);
}
