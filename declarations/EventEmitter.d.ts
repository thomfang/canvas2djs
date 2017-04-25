export declare type EventListener = (...args: any[]) => any;
export declare class EventEmitter {
    private static _eventCache;
    addListener(type: string, listener: EventListener): this;
    on(type: string, listener: EventListener): this;
    once(type: string, listener: EventListener): this;
    removeListener(type: string, listener: EventListener): this;
    removeAllListeners(type?: string): this;
    emit(type: string, ...args: any[]): this;
}
