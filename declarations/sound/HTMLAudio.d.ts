import { EventEmitter } from '../EventEmitter';
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
