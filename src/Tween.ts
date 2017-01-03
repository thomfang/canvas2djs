export interface IEasingFunction {
    (percent: number, ...args: any[]): number;
}

export default {
    easeInQuad(pos) {
        return Math.pow(pos, 2);
    },

    easeOutQuad(pos) {
        return -(Math.pow((pos - 1), 2) - 1);
    },

    easeInOutQuad(pos) {
        if ((pos /= 0.5) < 1) {
            return 0.5 * Math.pow(pos, 2);
        }
        return -0.5 * ((pos -= 2) * pos - 2);
    },

    easeInCubic(pos) {
        return Math.pow(pos, 3);
    },

    easeOutCubic(pos) {
        return (Math.pow((pos - 1), 3) + 1);
    },

    easeInOutCubic(pos) {
        if ((pos /= 0.5) < 1) {
            return 0.5 * Math.pow(pos, 3);
        }
        return 0.5 * (Math.pow((pos - 2), 3) + 2);
    },

    easeInQuart(pos) {
        return Math.pow(pos, 4);
    },

    easeOutQuart(pos) {
        return -(Math.pow((pos - 1), 4) - 1)
    },

    easeInOutQuart(pos) {
        if ((pos /= 0.5) < 1)
            return 0.5 * Math.pow(pos, 4);
        return -0.5 * ((pos -= 2) * Math.pow(pos, 3) - 2);
    },

    easeInQuint(pos) {
        return Math.pow(pos, 5);
    },

    easeOutQuint(pos) {
        return (Math.pow((pos - 1), 5) + 1);
    },

    easeInOutQuint(pos) {
        if ((pos /= 0.5) < 1) {
            return 0.5 * Math.pow(pos, 5);
        }
        return 0.5 * (Math.pow((pos - 2), 5) + 2);
    },

    easeInSine(pos) {
        return -Math.cos(pos * (Math.PI / 2)) + 1;
    },

    easeOutSine(pos) {
        return Math.sin(pos * (Math.PI / 2));
    },

    easeInOutSine(pos) {
        return (-.5 * (Math.cos(Math.PI * pos) - 1));
    },

    easeInExpo(pos) {
        return (pos == 0) ? 0 : Math.pow(2, 10 * (pos - 1));
    },

    easeOutExpo(pos) {
        return (pos == 1) ? 1 : -Math.pow(2, -10 * pos) + 1;
    },

    easeInOutExpo(pos) {
        if (pos == 0)
            return 0;
        if (pos == 1)
            return 1;
        if ((pos /= 0.5) < 1)
            return 0.5 * Math.pow(2, 10 * (pos - 1));
        return 0.5 * (-Math.pow(2, -10 * --pos) + 2);
    },

    easeInCirc(pos) {
        return -(Math.sqrt(1 - (pos * pos)) - 1);
    },

    easeOutCirc(pos) {
        return Math.sqrt(1 - Math.pow((pos - 1), 2))
    },

    easeInOutCirc(pos) {
        if ((pos /= 0.5) < 1)
            return -0.5 * (Math.sqrt(1 - pos * pos) - 1);
        return 0.5 * (Math.sqrt(1 - (pos -= 2) * pos) + 1);
    },

    easeOutBounce(pos) {
        if ((pos) < (1 / 2.75)) {
            return (7.5625 * pos * pos);
        }
        else if (pos < (2 / 2.75)) {
            return (7.5625 * (pos -= (1.5 / 2.75)) * pos + .75);
        }
        else if (pos < (2.5 / 2.75)) {
            return (7.5625 * (pos -= (2.25 / 2.75)) * pos + .9375);
        }
        else {
            return (7.5625 * (pos -= (2.625 / 2.75)) * pos + .984375);
        }
    },

    easeInBack(pos) {
        var s = 1.70158;
        return (pos) * pos * ((s + 1) * pos - s);
    },

    easeOutBack(pos) {
        var s = 1.70158;
        return (pos = pos - 1) * pos * ((s + 1) * pos + s) + 1;
    },

    easeInOutBack(pos) {
        var s = 1.70158;
        if ((pos /= 0.5) < 1)
            return 0.5 * (pos * pos * (((s *= (1.525)) + 1) * pos - s));
        return 0.5 * ((pos -= 2) * pos * (((s *= (1.525)) + 1) * pos + s) + 2);
    },

    elastic(pos) {
        return -1 * Math.pow(4, -8 * pos) * Math.sin((pos * 6 - 1) * (2 * Math.PI) / 2) + 1;
    },

    swingFromTo(pos) {
        var s = 1.70158;
        return ((pos /= 0.5) < 1) ? 0.5 * (pos * pos * (((s *= (1.525)) + 1) * pos - s)) :
            0.5 * ((pos -= 2) * pos * (((s *= (1.525)) + 1) * pos + s) + 2);
    },

    swingFrom(pos) {
        var s = 1.70158;
        return pos * pos * ((s + 1) * pos - s);
    },

    swingTo(pos) {
        var s = 1.70158;
        return (pos -= 1) * pos * ((s + 1) * pos + s) + 1;
    },

    bounce(pos) {
        if (pos < (1 / 2.75)) {
            return (7.5625 * pos * pos);
        }
        else if (pos < (2 / 2.75)) {
            return (7.5625 * (pos -= (1.5 / 2.75)) * pos + .75);
        }
        else if (pos < (2.5 / 2.75)) {
            return (7.5625 * (pos -= (2.25 / 2.75)) * pos + .9375);
        }
        else {
            return (7.5625 * (pos -= (2.625 / 2.75)) * pos + .984375);
        }
    },

    bouncePast(pos) {
        if (pos < (1 / 2.75)) {
            return (7.5625 * pos * pos);
        }
        else if (pos < (2 / 2.75)) {
            return 2 - (7.5625 * (pos -= (1.5 / 2.75)) * pos + .75);
        }
        else if (pos < (2.5 / 2.75)) {
            return 2 - (7.5625 * (pos -= (2.25 / 2.75)) * pos + .9375);
        }
        else {
            return 2 - (7.5625 * (pos -= (2.625 / 2.75)) * pos + .984375);
        }
    },

    easeFromTo(pos) {
        if ((pos /= 0.5) < 1)
            return 0.5 * Math.pow(pos, 4);
        return -0.5 * ((pos -= 2) * Math.pow(pos, 3) - 2);
    },

    easeFrom(pos) {
        return Math.pow(pos, 4);
    },

    easeTo(pos) {
        return Math.pow(pos, 0.25);
    },

    linear(pos) {
        return pos
    },

    sinusoidal(pos) {
        return (-Math.cos(pos * Math.PI) / 2) + 0.5;
    },

    reverse(pos) {
        return 1 - pos;
    },

    mirror(pos, transition) {
        transition = transition || this.sinusoidal;
        if (pos < 0.5)
            return transition(pos * 2);
        else
            return transition(1 - (pos - 0.5) * 2);
    },

    flicker(pos) {
        var pos = pos + (Math.random() - 0.5) / 5;
        return this.sinusoidal(pos < 0 ? 0 : pos > 1 ? 1 : pos);
    },

    wobble(pos) {
        return (-Math.cos(pos * Math.PI * (9 * pos)) / 2) + 0.5;
    },

    pulse(pos, pulses) {
        return (-Math.cos((pos * ((pulses || 5) - .5) * 2) * Math.PI) / 2) + .5;
    },

    blink(pos, blinks) {
        return Math.round(pos * (blinks || 5)) % 2;
    },

    spring(pos) {
        return 1 - (Math.cos(pos * 4.5 * Math.PI) * Math.exp(-pos * 6));
    },

    none(pos) {
        return 0
    },

    full(pos) {
        return 1
    }
}