namespace canvas2d.util {

    var key = '__CANVAS2D_UUID__';
    var counter = 0;

    export function uuid(target: any) {
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
}