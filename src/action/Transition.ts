import { Tween, EasingFunc } from '../Tween';
import { BaseAction } from './BaseAction';

export type TransToProps = {
    [name: string]: number | { dest: number; easing: EasingFunc; }
}

export type TransByProps = {
    [name: string]: number | { value: number; easing: EasingFunc; }
}

export type TransOption = { name: string; dest: number; easing: EasingFunc; };

export class Transition extends BaseAction {

    public static defaultEasingFunc = Tween.easeInOutQuad;

    public static setDefaultEasingFunc(func: EasingFunc) {
        this.defaultEasingFunc = func;
    }

    protected elapsed: number = 0;
    protected duration: number;

    protected isTransitionBy: boolean;

    protected options: TransOption[];
    protected beginValue: { [name: string]: number };
    protected deltaValue: { [name: string]: number };

    constructor(options: any, duration: number, isTransitionBy?: boolean) {
        super();

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
        for (let name in options) {
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
        }
    }

    private _initAsTransitionBy(options: TransByProps) {
        let deltaValue = this.deltaValue;

        for (let name in options) {
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
        }
    }

    private _initBeginValue(target: any) {
        let beginValue = this.beginValue = {};
        let deltaValue = this.deltaValue;

        if (this.isTransitionBy) {
            for (let i = 0, option: TransOption; option = this.options[i]; i++) {
                beginValue[option.name] = target[option.name];
                option.dest = target[option.name] + deltaValue[option.name];
            }
        }
        else {
            for (let i = 0, option: TransOption; option = this.options[i]; i++) {
                beginValue[option.name] = target[option.name];
                deltaValue[option.name] = option.dest - target[option.name];
            }
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

        for (let i = 0, option: TransOption; option = this.options[i]; i++) {
            let { name, dest, easing } = option;
            easing = easing || Transition.defaultEasingFunc;
            target[name] = beginValue[name] + (easing(percent) * deltaValue[name]);
        }
    }

    end(target: any): void {
        for (let i = 0, option: TransOption; option = this.options[i]; i++) {
            target[option.name] = option.dest;
        }
        this.done = true;
    }

    destroy() {
        this.beginValue = null;
        this.deltaValue = null;
        this.options = null;
    }

    reset() {
        this.done = false;
        this.elapsed = 0;
    }

    reverse() {
        this.done = false;
        this.elapsed = 0;

        const { options, beginValue, deltaValue } = this;

        for (let i = 0, option: TransOption; option = options[i]; i++) {
            let dest = beginValue[option.name];
            beginValue[option.name] = option.dest;
            deltaValue[option.name] = -deltaValue[option.name];
            option.dest = dest;
        }
    }
}