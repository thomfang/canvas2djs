import { uid, addArrayItem, removeArrayItem } from './Util';

var counter = 0;
var eventCache: { [id: number]: { [type: string]: EventListener[] } } = {};

export type EventListener = (...args: any[]) => any;

export class EventEmitter {

    addListener(type: string, listener: EventListener) {
        let id = uid(this);
        if (!eventCache[id]) {
            eventCache[id] = {};
        }
        if (!eventCache[id][type]) {
            eventCache[id][type] = [];
        }

        addArrayItem(eventCache[id][type], listener);
        return this;
    }

    on(type: string, listener: EventListener) {
        return this.addListener(type, listener);
    }

    removeListener(type: string, listener: EventListener) {
        let cache = eventCache[uid(this)];

        if (cache && cache[type]) {
            removeArrayItem(cache[type], listener);
            if (!cache[type].length) {
                delete cache[type];
            }
        }
        return this;
    }

    removeAllListeners(type?: string) {
        let id = uid(this);
        let cache = eventCache[id];

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
        let id = uid(this);
        let cache = eventCache[id];

        if (cache && cache[type]) {
            cache[type].slice().forEach(listener => {
                listener.apply(this, args);
            });
        }
        return this;
    }
}