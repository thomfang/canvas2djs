const Key = 'canvas2d.uid';

var counter = 0;
var cachedColor: { [key: string]: string } = {};

export type Color = string | number;

export function uid(target: any) {
    if (typeof target[Key] === 'undefined') {
        Object.defineProperty(target, Key, { value: counter++ });
    }
    return target[Key];
}

export function addArrayItem(array: any[], item: any) {
    if (array.indexOf(item) === -1) {
        array.push(item);
    }
}

export function removeArrayItem(array: any[], item: any) {
    let index = array.indexOf(item);
    if (index > -1) {
        array.splice(index, 1);
    }
}

export function convertColor(color: string | number): string {
    if (typeof color === 'string') {
        return color;
    }
    if (cachedColor[color]) {
        return cachedColor[color];
    }
    if (typeof color === 'number') {
        let result = color.toString(16);
        if (result.length < 3) {
            while (result.length < 3) {
                result = '0' + result;
            }
        }
        else if (result.length > 3 && result.length < 6) {
            while (result.length < 6) {
                result = '0' + result;
            }
        }
        if (result.length !== 3 && result.length !== 6) {
            throw new Error(`canvas2d: Invalid hex color "0x${result}".`);
        }
        result = cachedColor[color] = '#' + result;
        return result;
    }
}


export function hexToRgb(hex: string) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

export function rgbToHex(r: number, g: number, b: number) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

