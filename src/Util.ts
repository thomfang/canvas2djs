var key = '__CANVAS2D_UUID__';
var counter = 0;
var cachedColor: { [key: string]: string } = {};

export type Color = string | number;

export function uid(target: any) {
    if (typeof target[key] === 'undefined') {
        Object.defineProperty(target, key, { value: counter++ });
    }
    return target[key];
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

export function normalizeColor(color: string | number): string {
    if (cachedColor[color]) {
        return cachedColor[color];
    }
    if (typeof color === 'string') {
        if (color[0] != '#' || (color.length != 4 && color.length != 7)) {
            throw new Error(`canvas2d: Invalid color string "${color}".`);
        }
        cachedColor[color] = color;
        return color;
    }
    if (typeof color === 'number') {
        let result = color.toString(16);
        while (result.length < 3) {
            result = '0' + result;
        }
        if (result.length !== 3 && result.length !== 6) {
            throw new Error(`canvas2d: Invalid hex color "0x${result}".`);
        }
        result = cachedColor[color] = '#' + result;
        return result;
    }
}