namespace canvas2d.util {

    var uuidKey = '__CANVAS2D_UUID__';
    var uuidCounter = 0;

    export function uuid(target: any) {
        if (typeof target[uuidKey] === 'undefined') {
            target[uuidKey] = uuidCounter++;
        }
        return target[uuidKey];
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