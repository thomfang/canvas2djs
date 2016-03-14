/// <reference path="./audio.ts" />

namespace canvas2d {

    export interface ISoundResource {
        name: string;
        channels?: number;
    }

    var enabled: boolean = false;
    var extension: string = ".mp3";
    var supportedType = {
        mp3: false,
        mp4: false,
        wav: false,
        ogg: false
    };
    var audioesCache: { [index: string]: Array<WebAudio | HTMLAudio> } = {};
    var pausedAudioes: { [id: number]: WebAudio | HTMLAudio } = {};

    /**
     * Get paused audio instance by resource name.
     */
    function getAudio(name: string): WebAudio | HTMLAudio;
    function getAudio(name: string, returnList: boolean): Array<WebAudio | HTMLAudio>;
    function getAudio(name: string, returnList?: boolean): any {
        var list = audioesCache[name];

        if (!list || !list.length) {
            return returnList ? [] : null;
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

    export const Sound = {

        get enabled() {
            return enabled;
        },

        set enabled(value: boolean) {
            if (value == enabled) {
                return;
            }

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
                Object.keys(audioesCache).forEach(name => {
                    audioesCache[name].forEach(audio => {
                        if (audio.playing) {
                            audio.pause();
                            pausedAudioes[util.uuid(audio)] = audio;
                        }
                    });
                });
            }

            enabled = value;
        },

        get supportedType(): { mp3: boolean; mp4: boolean; wav: boolean; ogg: boolean;　} {
            return Object.create(supportedType);
        },

        get extension() {
            return extension;
        },

        set extension(value: string) {
            extension = value;
        },

        get getAudio() {
            return getAudio;
        },

        get _cache(): { [index: string]: Array<WebAudio | HTMLAudio> } {
            return Object.create(audioesCache);
        },


        /**
         * Load a sound resource
         */
        load(basePath: string, name: string, onComplete: () => any, channels = 1) {
            var src: string = basePath + name + extension;
            var audio = WebAudio.isSupported ? new WebAudio(src) : new HTMLAudio(src);

            audio.once('load', () => {
                if (onComplete) {
                    onComplete();
                }

                var cloned;
                while (--channels > 0) {
                    cloned = audio.clone();
                    audioesCache[name].push(cloned);
                }
            });
            audio.once('error', (e: ErrorEvent) => {
                console.warn("canvas2d.Sound.load() Error: " + src + " could not be loaded.");
                util.removeArrayItem(audioesCache[name], audio);
            });

            if (!audioesCache[name]) {
                audioesCache[name] = [];
            }
            audioesCache[name].push(audio);

            audio.load();
        },

        /**
         * Load multiple sound resources
         */
        loadList(basePath: string, resources: Array<ISoundResource>, onAllCompleted?: () => any, onProgress?: (percent: number) => any) {
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

            resources.forEach(res => Sound.load(basePath, res.name, onCompleted, res.channels));
        },

        /**
         * Get all audioes by name
         */
        getAllAudioes(name: string): Array<WebAudio | HTMLAudio> {
            return audioesCache[name] && audioesCache[name].slice();
        },

        /**
         * Play sound by name
         */
        play(name: string, loop: boolean = false): WebAudio | HTMLAudio {
            var audio = enabled && getAudio(name);

            if (audio) {
                audio.loop = loop;
                audio.play();
            }
            return audio;
        },

        /**
         * Pause sound by name
         */
        pause(name: string): void {
            let list = getAudio(name, true);

            if (list) {
                list.forEach(audio => audio.pause());
            }
        },

        /**
         * Stop sound by name
         */
        stop(name: string): void {
            let list = audioesCache[name];

            if (list) {
                list.forEach(audio => audio.stop());
            }
        },

        /**
         * Resume audio by name
         */
        resume(name: string): void {
            let list = audioesCache[name];
            if (list) {
                list.forEach(audio => !audio.playing && audio.currentTime > 0 && audio.resume());
            }
        },
    };

    detectSupportedType();
}
