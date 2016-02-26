/**
 * Simple sound manager
 */
namespace canvas2d.Sound {

    var audios: { [index: string]: Array<HTMLAudioElement> } = {};

    /**
     * Could play sound
     */
    export var enabled: boolean = true;
    
    /**
     * Extension for media type
     */
    export var extension: string = ".mp3";
    
    /**
     *  Supported types of the browser
     */
    export var supportedType: { [index: string]: boolean } = {};

    export interface ISoundResource {
        name: string;
        channels?: number;
    }

    /**
     * Load a sound resource
     */
    export function load(basePath: string, name: string, onComplete: () => any, channels = 1) {
        var path: string = basePath + name + extension;
        var audio: HTMLAudioElement = document.createElement("audio");

        function onCanPlayThrough() {
            this.removeEventListener('canplaythrough', onCanPlayThrough, false);

            if (onComplete) {
                onComplete();
            }

            var clone;
            while (--channels > 0) {
                clone = audio.cloneNode(true);
                audios[name].push(clone);
            }

            console.log("Loaded: " + path);
        }

        function onError(e: ErrorEvent) {
            console.warn("Error: " + path + " could not be loaded.");
            audios[name] = null;
        }

        audio.addEventListener('canplaythrough', onCanPlayThrough, false);
        audio.addEventListener('error', onError, false);

        audio['preload'] = "auto";
        audio['autobuffer'] = true;
        audio.setAttribute('src', path);
        audio.load();
        audios[name] = [audio];

        console.log("Start to load: ", path);
    }

    /**
     * Load multiple sound resources
     */
    export function loadList(basePath: string, resList: Array<ISoundResource>, onAllCompleted?: () => any, onProgress?: (percent: number) => any) {
        let allCount = resList.length;
        let endedCount = 0;

        let onCompleted = () => {
            ++endedCount;
            
            if (onProgress) {
                onProgress(endedCount / allCount);
            }

            if (endedCount === allCount && onAllCompleted) {
                onAllCompleted();
            }
        }

        resList.forEach((res) => {
            load(basePath, res.name, onCompleted, res.channels);
        });
    }

    /**
     * Get paused audio instance by resource name.
     */
    export function getPausedAudio(name: string): HTMLAudioElement;
    export function getPausedAudio(name: string, isGetAll: boolean): HTMLAudioElement[];
    export function getPausedAudio(name: string, isGetAll?: boolean): any {
        var list: any = audios[name];

        if (!list || !list.length) {
            return null;
        }

        var i: number = 0;
        var all: HTMLAudioElement[] = [];
        var audio: HTMLAudioElement;

        for (; audio = list[i]; i++) {
            if (audio.ended || audio.paused) {
                if (audio.ended) {
                    audio.currentTime = 0;
                }
                if (!isGetAll) {
                    return audio;
                }
                all.push(audio);
            }
        }

        return all;
    }
    
    /**
     * Get playing audio instance by resource name.
     */
    export function getPlayingAudio(name: string): HTMLAudioElement;
    export function getPlayingAudio(name: string, isGetAll: boolean): HTMLAudioElement[];
    export function getPlayingAudio(name: string, isGetAll?: boolean): any {
        var list: any = audios[name];

        if (!list || !list.length) {
            return null;
        }

        var i: number = 0;
        var all: HTMLAudioElement[] = [];
        var audio: HTMLAudioElement;

        for (; audio = list[i]; i++) {
            if (!audio.paused) {
                if (!isGetAll) {
                    return audio;
                }
                all.push(audio);
            }
        }

        return all;
    }
    
    /**
     * Get audio list
     */
    export function getAudioListByName(name: string): HTMLAudioElement[] {
        return audios[name];
    }

    /**
     * Play sound by name
     */
    export function play(name: string, loop?: boolean): HTMLAudioElement {
        var audio = enabled && getPausedAudio(name);

        if (audio) {
            if (loop) {
                audio.loop = true;
                audio.addEventListener("ended", replay, false);
            }
            else {
                audio.loop = false;
                audio.removeEventListener("ended", replay, false);
            }
            audio.play();
        }
        return audio;
    }

    /**
     * Pause sound by name
     */
    export function pause(name: string, reset?: boolean): void {
        let list = audios[name];

        if (list) {
            list.forEach(audio => {
                audio.pause();
                if (reset) {
                    audio.currentTime = 0;
                }
            });
        }
    }
    
    /**
     * Resume audio by name
     */
    export function resume(name: string, reset?: boolean): void {
        let list = audios[name];
        if (list) {
            list.forEach(audio => {
                if (!audio.ended && audio.currentTime > 0) {
                    if (reset) {
                        audio.currentTime = 0;
                    }
                    audio.play();
                }
            });
        }
    }
    
    /**
     * Pause all audios
     */
    export function pauseAll(reset?: boolean) {
        Object.keys(audios).forEach(name => {
            pause(name, reset);
        });
    }
    
    /**
     * Resume all played audio
     */
    export function resumeAll(reset?: boolean) {
        Object.keys(audios).forEach(name => {
            resume(name, reset);
        });
    }

    /**
     * Stop the looping sound by name
     */
    export function stopLoop(name: string): void {
        var list = getPlayingAudio(name, true);

        if (list) {
            list.forEach(audio => {
                audio.removeEventListener("ended", replay, false);
                audio.loop = false;
            });
        }
    }

    function replay(): void {
        this.play();
    }

    function detectSupportedType() {
        var aud = new Audio();
        var reg = /maybe|probably/i;
        var mts = {
            mp3: 'audio/mpeg',
            mp4: 'audio/mp4; codecs="mp4a.40.5"',
            wav: 'audio/x-wav',
            ogg: 'audio/ogg; codecs="vorbis"'
        };

        for (var name in mts) {
            supportedType[name] = reg.test(aud.canPlayType(mts[name]));
        }

        aud = null;
    }

    detectSupportedType();
}
