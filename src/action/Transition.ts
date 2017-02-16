import { IAction } from './Action';
import { Tween, EasingFunc } from '../Tween';

export type TransToProps = {
    [name: string]: number | { dest: number; easing: EasingFunc; }
}

export type TransByProps = {
    [name: string]: number | { value: number; easing: EasingFunc; }
}

export class Transition implements IAction {

    private _defaultEasing: EasingFunc = Tween.easeInOutQuad;

    done: boolean = false;
    immediate: boolean = false;
    elapsed: number = 0;
    duration: number;
    isTransitionBy: boolean;

    options: Array<{ name: string; dest: number; easing: EasingFunc; }>;
    beginValue: { [name: string]: number };
    deltaValue: { [name: string]: number };

    constructor(options: any, duration: number, isTransitionBy?: boolean) {
        this.options = [];
        this.deltaValue = {};
        this.duration = duration;
        this.isTransitionBy = isTransitionBy;

        if (isTransitionBy) {
            this._initAsTransitionBy(options);
        }
        else {
            this._initAsTransitionTo(options);
        }
    }

    private _initAsTransitionTo(options: TransToProps) {
        Object.keys(options).forEach(name => {
            let info = options[name];
            let easing: EasingFunc;
            let dest: number;

            if (typeof info === 'number') {
                dest = info;
            }
            else {
                easing = info.easing;
                dest = info.dest;
            }

            this.options.push({ name, dest, easing });
        });
    }

    private _initAsTransitionBy(options: TransByProps) {
        let deltaValue = this.deltaValue;

        Object.keys(options).forEach(name => {
            let info = options[name];
            let easing: EasingFunc;
            let dest: number;

            if (typeof info === 'number') {
                deltaValue[name] = info;
            }
            else {
                easing = info.easing;
                deltaValue[name] = info.value;
            }

            this.options.push({ name, dest, easing });
        });
    }

    private _initBeginValue(target: any) {
        let beginValue = this.beginValue = {};
        let deltaValue = this.deltaValue;

        if (this.isTransitionBy) {
            this.options.forEach(option => {
                beginValue[option.name] = target[option.name];
                option.dest = target[option.name] + deltaValue[option.name];
            });
        }
        else {
            this.options.forEach(option => {
                beginValue[option.name] = target[option.name];
                deltaValue[option.name] = option.dest - target[option.name];
            });
        }
    }

    step(deltaTime: number, target: any): void {
        this.elapsed += deltaTime;

        if (this.beginValue == null) {
            this._initBeginValue(target);
        }

        if (this.elapsed >= this.duration) {
            return this.end(target);
        }

        var percent = this.elapsed / this.duration;
        var beginValue = this.beginValue;
        var deltaValue = this.deltaValue;

        this.options.forEach(({name, dest, easing}) => {
            easing = easing || this._defaultEasing;
            target[name] = beginValue[name] + (easing(percent) * deltaValue[name]);
        });
    }

    end(target: any): void {
        this.options.forEach((attr) => {
            target[attr.name] = attr.dest;
        });
        this.beginValue = null;
        this.deltaValue = null;
        this.options = null;
        this.done = true;
    }
}