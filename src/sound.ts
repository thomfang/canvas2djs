module canvas2d.Sound {

    var audios: {[index: string]: Array<HTMLAudioElement>} = {};

    export var enabled: boolean = true;
    export var extention: string = ".mp3";
    export var supportedType: { [index: string]: boolean } = {};

    interface Resource {
        name: string;
        channels?: number;
    }

    export function load(basePath: string, name: string, onComplete: Function, channels = 1) {
        var path : string           = basePath + name + extention;
        var audio: HTMLAudioElement = document.createElement("audio");

        function onCanPlayThrough() {
            this.removeEventListener('canplaythrough', onCanPlayThrough, false);

            if (onComplete) {
                onComplete();
            }
            console.log("Loaded: " + path);
        }

        function onError(e: ErrorEvent) {
            console.warn("Error: " + path + " could not be loaded.");
            audios[name] = null;
        }

        audio.addEventListener('canplaythrough', onCanPlayThrough, false);
        audio.addEventListener('error',          onError,          false);

        audio.preload    = "auto";
        audio.autobuffer = true;
        audio.src        = path;

        audio.load();

        console.log("Start to load: ", path);

        audios[name] = [audio];

        var clone;

        while (--channels > 0) {
            clone = audio.cloneNode(true);
            audios[name].push(clone);
        }
    }

    export function loadList(basePath: string, resList: Array<Resource>, callback: Function) {
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

    export function play(name: string, loop?: boolean): any {
        var audio = enabled && getAudio(name);

        if (audio) {
            if (loop) {
                audio.loop = true;
                audio.addEventListener("ended", replay, false);
            } else {
                audio.loop = false;
                audio.removeEventListener("ended", replay, false);
            }
            audio.play();
        }
        return audio;
    }

    export function pause(name: string, reset?: boolean): void {
        var audio = getAudio(name);

        if (audio) {
            audio.pause();
            if (reset) {
                audio.currentTime = 0;
            }
        }
    }

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