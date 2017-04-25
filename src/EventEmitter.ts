import { uid, addArrayItem, removeArrayItem } from './Util';

var counter = 0;

export type EventListener = (...args: any[]) => any;

export class EventEmitter {

    private static _eventCache: {
        [id: number]: {
            [type: string]: {
                listener: EventListener;
                once?: boolean;
            }[]
        }
    } = {};

    addListener(type: string, listener: EventListener) {
        let id = uid(this);
        if (!EventEmitter._eventCache[id]) {
            EventEmitter._eventCache[id] = {};
        }
        if (!EventEmitter._eventCache[id][type]) {
            EventEmitter._eventCache[id][type] = [];
        }
        let events = EventEmitter._eventCache[id][type];
        if (events.some(ev => ev.listener === listener && !ev.once)) {
            return this;
        }
        events.push({ listener });
        return this;
    }

    on(type: string, listener: EventListener) {
        return this.addListener(type, listener);
    }

    once(type: string, listener: EventListener) {
        let id = uid(this);
        if (!EventEmitter._eventCache[id]) {
            EventEmitter._eventCache[id] = {};
        }
        if (!EventEmitter._eventCache[id][type]) {
            EventEmitter._eventCache[id][type] = [];
        }
        let events = EventEmitter._eventCache[id][type];
        if (events.some(ev => ev.listener === listener && ev.once)) {
            return this;
        }
        events.push({ listener, once: true });
        return this;
    }

    removeListener(type: string, listener: EventListener) {
        let cache = EventEmitter._eventCache[uid(this)];

        if (cache && cache[type]) {
            let events = cache[type];
            events.slice().forEach((ev, index) => {
                if (ev.listener === listener) { 
                    removeArrayItem(events, ev);
                }
            });
            if (!events.length) {
                delete cache[type];
            }
        }
        return this;
    }

    removeAllListeners(type?: string) {
        let id = uid(this);
        let cache = EventEmitter._eventCache[id];

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
        let cache = EventEmitter._eventCache[id];

        if (cache && cache[type]) {
            let events = cache[type];
            events.slice().forEach(ev => {
                ev.listener.apply(this, args);
                if (ev.once) {
                    removeArrayItem(events, ev);
                }
            });
        }
        return this;
    }
}