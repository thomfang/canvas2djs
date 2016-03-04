/// <reference path="./audio.ts" />

namespace canvas2d.Sound {

    export interface ISoundResource {
        name: string;
        channels?: number;
    }

    /** Could play sound */
    export var enabled: boolean = false;
    
    /** Extension for media type */
    export var extension: string = ".mp3";
    
    /** Supported types of the browser */
    export var supportedType: { [index: string]: boolean } = {};
    
    /** audio cache */
    export var _audioesCache: { [index: string]: Array<WebAudio | HTMLAudio> } = {};

    var pausedAudioes: { [id: number]: WebAudio | HTMLAudio } = {};
    
    /**
     * Set global sound enabled or not.
     * Call this function in a UI event callback when need to set enabled.
     */
    export function setEnabled(value: boolean) {
        Sound.enabled = value;

        if (value) {
            WebAudio.enabled = true;
            HTMLAudio.enabled = true;
            
            if (pausedAudioes) {
                Object.keys(pausedAudioes).forEach(id => {
                    pausedAudioes[id].resume();
                });
                pausedAudioes = null;
            }
        }
        else {
            WebAudio.enabled = false;
            HTMLAudio.enabled = false;
            
            pausedAudioes = {};
            Object.keys(_audioesCache).forEach(name => {
                _audioesCache[name].forEach(audio => {
                    if (audio.playing) {
                        audio.pause();
                        pausedAudioes[util.uuid(audio)] = audio;
                    }
                });
            });
        }
    }

    /**
     * Load a sound resource
     */
    export function load(basePath: string, name: string, onComplete: () => any, channels = 1) {
        var src: string = basePath + name + extension;
        var audio = WebAudio.isSupported ? new WebAudio(src) : new HTMLAudio(src);

        audio.once('load', () => {
            if (onComplete) {
                onComplete();
            }

            var cloned;
            while (--channels > 0) {
                cloned = audio.clone();
                _audioesCache[name].push(cloned);
            }
        });
        audio.once('error', (e: ErrorEvent) => {
            console.warn("canvas2d.Sound.load() Error: " + src + " could not be loaded.");
            _audioesCache[name] = null;
        });

        if (!_audioesCache[name]) {
            _audioesCache[name] = [];
        }
        _audioesCache[name].push(audio);
    }

    /**
     * Load multiple sound resources
     */
    export function loadList(basePath: string, resources: Array<ISoundResource>, onAllCompleted?: () => any, onProgress?: (percent: number) => any) {
        let totalCount = resources.length;
        let endedCount = 0;

        let onCompleted = () => {
            ++endedCount;

            if (onProgress) {
                onProgress(endedCount / totalCount);
            }
            if (endedCount === totalCount && onAllCompleted) {
                onAllCompleted();
            }
        }

        resources.forEach(res => load(basePath, res.name, onCompleted, res.channels));
    }

    /**
     * Get paused audio instance by resource name.
     */
    export function getAudio(name: string): WebAudio | HTMLAudio;
    export function getAudio(name: string, returnList: boolean): Array<WebAudio | HTMLAudio>;
    export function getAudio(name: string, returnList?: boolean): any {
        var list = _audioesCache[name];

        if (!list || !list.length) {
            return null;
        }

        var i: number = 0;
        var all: Array<WebAudio | HTMLAudio> = [];
        var audio: WebAudio | HTMLAudio;

        for (; audio = list[i]; i++) {
            if (!audio.playing) {
                if (!returnList) {
                    return audio;
                }
                all.push(audio);
            }
        }

        return all;
    }
    
    /**
     * Get all audioes by name
     */
    export function getAllAudioes(name: string): Array<WebAudio | HTMLAudio> {
        return _audioesCache[name] && _audioesCache[name].slice();
    }

    /**
     * Play sound by name
     */
    export function play(name: string, loop: boolean = false): WebAudio | HTMLAudio {
        var audio = enabled && getAudio(name);

        if (audio) {
            audio.loop = loop;
            audio.play();
        }
        return audio;
    }

    /**
     * Pause sound by name
     */
    export function pause(name: string): void {
        let list = getAudio(name, true);

        if (list) {
            list.forEach(audio => audio.pause());
        }
    }
    
    /**
     * Stop sound by name
     */
    export function stop(name: string): void {
        let list = _audioesCache[name];

        if (list) {
            list.forEach(audio => audio.stop());
        }
    }
    
    /**
     * Resume audio by name
     */
    export function resume(name: string): void {
        let list = _audioesCache[name];
        if (list) {
            list.forEach(audio => !audio.playing && audio.currentTime > 0 && audio.resume());
        }
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
