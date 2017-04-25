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

