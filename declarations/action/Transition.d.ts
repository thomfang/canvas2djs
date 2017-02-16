import { IAction } from './Action';
import { EasingFunc } from '../Tween';
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
export declare class Transition implements IAction {
    private _defaultEasing;
    done: boolean;
    immediate: boolean;
    elapsed: number;
    duration: number;
    isTransitionBy: boolean;
    options: Array<{
        name: string;
        dest: number;
        easing: EasingFunc;
    }>;
    beginValue: {
        [name: string]: number;
    };
    deltaValue: {
        [name: string]: number;
    };
    constructor(options: any, duration: number, isTransitionBy?: boolean);
    private _initAsTransitionTo(options);
    private _initAsTransitionBy(options);
    private _initBeginValue(target);
    step(deltaTime: number, target: any): void;
    end(target: any): void;
}
