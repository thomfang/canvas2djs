import { WebAudio, HTMLAudio } from './Audio';
declare const Sound: {
    enabled: boolean;
    readonly supportedType: {
        mp3: boolean;
        mp4: boolean;
        wav: boolean;
        ogg: boolean;
    };
    extension: string;
    readonly getAudio: {
        (name: string): WebAudio | HTMLAudio;
        (name: string, returnList: boolean): (WebAudio | HTMLAudio)[];
    };
    readonly _cache: {
        [index: string]: (WebAudio | HTMLAudio)[];
    };
    load(basePath: string, name: string, onComplete: () => any, channels?: number): void;
    loadList(basePath: string, resources: {
        name: string;
        channels?: number;
    }[], onAllCompleted?: () => any, onProgress?: (percent: number) => any): void;
    getAllAudioes(name: string): (WebAudio | HTMLAudio)[];
    play(name: string, loop?: boolean): WebAudio | HTMLAudio;
    pause(name: string): void;
    stop(name: string): void;
    resume(name: string): void;
};
export default Sound;
