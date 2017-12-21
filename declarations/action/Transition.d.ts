import { EasingFunc } from '../Tween';
import { BaseAction } from './BaseAction';
export declare type TransToProps = {
    [name: string]: number | {
        dest: number;
        easing: EasingFunc;
    };
};
export declare type TransByProps = {
    [name: string]: number | {
        value: number;
        easing: EasingFunc;
    };
};
export declare type TransOption = {
    name: string;
    dest: number;
    easing: EasingFunc;
};
export declare class Transition extends BaseAction {
    static defaultEasingFunc: (pos: any) => number;
    static setDefaultEasingFunc(func: EasingFunc): void;
    protected elapsed: number;
    protected duration: number;
    protected isTransitionBy: boolean;
    protected options: TransOption[];
    protected beginValue: {
        [name: string]: number;
    };
    protected deltaValue: {
        [name: string]: number;
    };
    constructor(options: any, duration: number, isTransitionBy?: boolean);
    private _initAsTransitionTo(options);
    private _initAsTransitionBy(options);
    private _initBeginValue(target);
    step(deltaTime: number, target: any): void;
    end(target: any): void;
    destroy(): void;
    reset(): void;
    reverse(): void;
}
