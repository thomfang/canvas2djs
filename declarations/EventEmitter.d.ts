export interface IEventListener {
    (...args: any[]): any;
}
/**
 * EventEmitter
 */
export default class EventEmitter {
    private static _cache;
    addListener(type: string, listener: IEventListener): this;
    on(type: string, listener: IEventListener): this;
    once(type: string, listener: IEventListener): this;
    removeListener(type: string, listener: IEventListener): this;
    removeAllListeners(type?: string): this;
    emit(type: string, ...args: any[]): this;
}
