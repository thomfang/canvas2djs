import { uid, addArrayItem, removeArrayItem } from './Util';

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
        if (typeof listener !== 'function') {
            return this;
        }
        let id = uid(this);
        if (!EventEmitter._eventCache[id]) {
            EventEmitter._eventCache[id] = {};
        }
        if (!EventEmitter._eventCache[id][type]) {
            EventEmitter._eventCache[id][type] = [];
        }
        let events = EventEmitter._eventCache[id][type];
        for (let i = 0, ev; ev = events[i]; i++) {
            if (ev.listener === listener && !ev.once) {
                return this;
            }
        }
        events.push({ listener });
        return this;
    }

    on(type: string, listener: EventListener) {
        return this.addListener(type, listener);
    }

    once(type: string, listener: EventListener) {
        if (typeof listener !== 'function') {
            return this;
        }
        let id = uid(this);
        if (!EventEmitter._eventCache[id]) {
            EventEmitter._eventCache[id] = {};
        }
        if (!EventEmitter._eventCache[id][type]) {
            EventEmitter._eventCache[id][type] = [];
        }
        let events = EventEmitter._eventCache[id][type];
        for (let i = 0, ev; ev = events[i]; i++) {
            if (ev.listener === listener && ev.once) {
                return this;
            }
        }
        events.push({ listener, once: true });
        return this;
    }

    removeListener(type: string, listener: EventListener) {
        let cache = EventEmitter._eventCache[uid(this)];

        if (cache && cache[type]) {
            let events = cache[type];
            let temp = events.slice();
            for (let i = 0, l = temp.length; i < l; i++) {
                let ev = temp[i];
                if (ev.listener === listener) {
                    removeArrayItem(events, ev);
                }
            }
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
                EventEmitter._eventCache[id] = null;
            }
            else {
                delete cache[type];
            }
        }
        return this;
    }

    hasListener(type: string) {
        let id = uid(this);
        let eventCache = EventEmitter._eventCache;
        if (!eventCache[id] || !eventCache[id][type] || !eventCache[id][type].length) {
            return false;
        }
        return true;
    }

    emit(type: string, ...args: any[]) {
        let id = uid(this);
        let cache = EventEmitter._eventCache[id];

        if (cache && cache[type]) {
            let events = cache[type];
            let temp = events.slice();
            for (let i = 0, l = temp.length; i < l; i++) {
                let ev = temp[i];
                if (ev) {
                    if (typeof ev.listener === 'function') {
                        ev.listener.apply(this, args);
                    }
                    if (ev.once) {
                        removeArrayItem(events, ev);
                    }
                }
            }
        }
        return this;
    }
}