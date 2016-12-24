var releasePool: Object[] = [];
var timerId: number;

export default function addToReleasePool(obj: Object) {
    releasePool.push(obj);

    if (timerId != null) {
        return;
    }

    timerId = setTimeout(release, 0);
}

function release() {
    releasePool.forEach(obj => {
        for (let key in obj) {
            delete obj[key];
        }
    });

    timerId = null;
    releasePool.length = 0;
}