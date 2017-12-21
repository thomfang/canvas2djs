var instance: ReleasePool;

export class ReleasePool {

    private _objs: Object[] = [];
    private _timerId: number;

    add(obj: Object) {
        this._objs.push(obj);
        if (this._timerId != null) {
            return;
        }
        this._timerId = setTimeout(() => this._release(), 0);
    }

    private _release() {
        for (let i = 0, obj; obj = this._objs[i]; i++) {
            for (let key in obj) {
                delete obj[key]
            }
        }
        this._timerId = null;
        this._objs.length = 0;
    }

    static get instance() {
        if (!instance) {
            instance = new ReleasePool();
        }
        return instance;
    }
}