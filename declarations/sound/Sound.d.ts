import { HTMLAudio } from './HTMLAudio';
import { WebAudio } from './WebAudio';
export declare class SoundManager {
    private _ext;
    private _enabled;
    private _pausedAudios;
    private _audioCache;
    private _supportedType;
    enabled: boolean;
    readonly supportedType: {
        mp3: boolean;
        mp4: boolean;
        wav: boolean;
        ogg: boolean;
    };
    ext: ".mp3" | ".mp4" | ".wav" | ".ogg";
    constructor();
    getAudio(name: string): WebAudio | HTMLAudio;
    getAudio(name: string, returnAll: boolean): Array<WebAudio | HTMLAudio>;
    load(baseUri: string, name: string, onComplete: () => any, channels?: number): void;
    /**
     * Load multiple sound resources
     */
    loadList(baseUri: string, resources: {
        name: string;
        channels?: number;
    }[], onAllCompleted?: () => any, onProgress?: (percent: number) => any): void;
    /**
     * Get all audioes by name
     */
    getAllAudioes(name: string): Array<WebAudio | HTMLAudio>;
    /**
     * Play sound by name
     */
    play(name: string, loop?: boolean): WebAudio | HTMLAudio;
    /**
     * Pause sound by name
     */
    pause(name: string): void;
    /**
     * Stop sound by name
     */
    stop(name: string): void;
    /**
     * Resume audio by name
     */
    resume(name: string): void;
    private _setEnabled(value);
    private _detectSupportedType();
}
export declare const Sound: SoundManager;
