import EventEmitter from './EventEmitter';
/**
 * WebAudio
 */
export declare class WebAudio extends EventEmitter {
    static isSupported: boolean;
    private static _initialized;
    private static _enabled;
    static enabled: boolean;
    private _gainNode;
    private _audioNode;
    private _buffer;
    private _startTime;
    private _isLoading;
    src: string;
    loop: boolean;
    muted: boolean;
    loaded: boolean;
    volume: number;
    playing: boolean;
    autoplay: boolean;
    duration: number;
    currentTime: number;
    constructor(src: string);
    load(): void;
    play(): void;
    pause(): void;
    resume(): void;
    stop(): void;
    setMute(muted: boolean): void;
    setVolume(volume: number): void;
    clone(): WebAudio;
    private _handleEvent(e);
    private _onDecodeCompleted(buffer);
    private _play();
    private _clearAudioNode();
}
/**
 * HTMLAudio
 */
export declare class HTMLAudio extends EventEmitter {
    static enabled: boolean;
    private _audioNode;
    private _isLoading;
    src: string;
    loop: boolean;
    muted: boolean;
    loaded: boolean;
    volume: number;
    playing: boolean;
    autoplay: boolean;
    duration: number;
    currentTime: number;
    constructor(src: string);
    load(): void;
    play(): void;
    pause(): void;
    resume(): void;
    stop(): void;
    setMute(muted: boolean): void;
    setVolume(volume: number): void;
    clone(): HTMLAudio;
    private _handleEvent(e);
    private _play();
}
