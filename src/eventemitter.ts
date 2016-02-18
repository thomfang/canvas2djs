namespace canvas2d {

    export interface IEventListener {
        (...args: any[]): any;
    }
    
    var counter = 0;
    
    /**
     * EventEmitter
     */
    export class EventEmitter {

        protected _eventCache: { [type: string]: IEventListener[] };
        protected _onceMarkKey: string;
        
        constructor() {
            this._onceMarkKey = '__CANVAS2D_ONCE__' + counter++;
        }

        addListener(type: string, listener: IEventListener) {
            if (!this._eventCache) {
                this._eventCache = {};
            }
            if (!this._eventCache[type]) {
                this._eventCache[type] = [];
            }
            if (this._eventCache[type].indexOf(listener) === -1) {
                this._eventCache[type].push(listener);
            }
            return this;
        }
        
        on(type: string, listener: IEventListener) {
            return this.addListener(type, listener);
        }
        
        once(type: string, listener: IEventListener) {
            listener[this._onceMarkKey] = true;
            return this.addListener(type, listener);
        }

        removeListener(type: string, listener: IEventListener) {
            if (this._eventCache && this._eventCache[type]) {
                let index = this._eventCache[type].indexOf(listener);
                if (index > -1) {
                    this._eventCache[type].splice(index, 1);
                }
                if (!this._eventCache[type].length) {
                    delete this._eventCache[type];
                }
            }
            return this;
        }

        removeAllListeners(type?: string) {
            if (this._eventCache) {
                if (type == null) {
                    this._eventCache = null;
                }
                else {
                    delete this._eventCache[type];
                }
            }
            return this;
        }

        emit(type: string, ...args: any[]) {
            if (this._eventCache && this._eventCache[type]) {
                this._eventCache[type].slice().forEach(listener => {
                    listener.apply(this, args);
                    if (listener[this._onceMarkKey]) {
                        this.removeListener(type, listener);
                        listener[this._onceMarkKey] = null;
                    }
                });
            }
            return this;
        }
    }
}