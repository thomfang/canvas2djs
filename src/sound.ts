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
    export function load(basePath: string, name: string, onComplete: Function, channels = 1) {
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
    export function loadList(basePath: string, resList: Array<ISoundResource>, callback?: Function) {
        var counter = resList.length;

        function onCompleted() {
            counter--;

            if (counter === 0 && callback) {
                callback();
            }
        }

        resList.forEach((res) => {
            load(basePath, res.name, onCompleted, res.channels);
        });
    }

    /**
     * Get audio instance by resource name, when isGetList param is true, return all the instance list.
     */
    export function getAudio(name: string, isGetList = false): any {
        var list: any = audios[name];

        if (isGetList) {
            return list;
        }

        if (!list || !list.length) {
            return null;
        }

        var i: number = 0;
        var audio: HTMLAudioElement;

        for (; audio = list[i]; i++) {
            if (audio.ended || audio.paused) {
                break;
            }
        }

        audio = audio || list[0];

        if (audio.ended) {
            audio.currentTime = 0;
        }

        return audio;
    }

    /**
     * Play sound by name
     */
    export function play(name: string, loop?: boolean): any {
        var audio = enabled && getAudio(name);

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
        var audio = getAudio(name);

        if (audio) {
            audio.pause();
            if (reset) {
                audio.currentTime = 0;
            }
        }
    }

    /**
     * Stop the looping sound by name
     */
    export function stopLoop(name: string): void {
        var audio = getAudio(name);

        if (audio) {
            audio.removeEventListener("ended", replay, false);
            audio.loop = false;
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
