import * as Util from './Util';

var counter = 0;
var prefix = '__CANVAS2D_ONCE__';

export interface IEventListener {
    (...args: any[]): any;
}

/**
 * EventEmitter
 */
export default class EventEmitter {

    private static _cache: { [id: number]: { [type: string]: IEventListener[] } } = {};

    addListener(type: string, listener: IEventListener) {
        let id = Util.uid(this);
        if (!EventEmitter._cache[id]) {
            EventEmitter._cache[id] = {};
        }
        if (!EventEmitter._cache[id][type]) {
            EventEmitter._cache[id][type] = [];
        }

        Util.addArrayItem(EventEmitter._cache[id][type], listener);
        return this;
    }

    on(type: string, listener: IEventListener) {
        return this.addListener(type, listener);
    }

    once(type: string, listener: IEventListener) {
        listener[prefix + Util.uid(this)] = true;
        return this.addListener(type, listener);
    }

    removeListener(type: string, listener: IEventListener) {
        let cache = EventEmitter._cache[Util.uid(this)];

        if (cache && cache[type]) {
            Util.removeArrayItem(cache[type], listener);
            if (!cache[type].length) {
                delete cache[type];
            }
        }
        return this;
    }

    removeAllListeners(type?: string) {
        let id = Util.uid(this);
        let cache = EventEmitter._cache[id];

        if (cache) {
            if (type == null) {
                EventEmitter[id] = null;
            }
            else {
                delete cache[type];
            }
        }
        return this;
    }

    emit(type: string, ...args: any[]) {
        let id = Util.uid(this);
        let cache = EventEmitter._cache[id];
        let onceKey = prefix + id;

        if (cache && cache[type]) {
            cache[type].slice().forEach(listener => {
                listener.apply(this, args);
                if (listener[onceKey]) {
                    this.removeListener(type, listener);
                    listener[onceKey] = null;
                }
            });
        }
        return this;
    }
}