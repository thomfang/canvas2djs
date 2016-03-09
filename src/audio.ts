/// <reference path="./eventemitter.ts" />

namespace canvas2d {

    var AudioCtx = window['AudioContext'] || window['webkitAudioContext'];
    var context: AudioContext = AudioCtx ? new AudioCtx() : null;

    /**
     * WebAudio
     */
    export class WebAudio extends EventEmitter {

        static isSupported: boolean = AudioCtx != null;

        private static _initialized: boolean = false;
        private static _enabled: boolean = false;

        static set enabled(enabled: boolean) {
            if (enabled && this.isSupported && !this._initialized) {
                let source = context.createBufferSource();
                source.buffer = context.createBuffer(1, 1, 22050);
                source.connect(context.destination);
                source.start ? source.start(0, 0, 0) : source['noteOn'](0, 0, 0);
                this._initialized = true;
            }
            this._enabled = enabled;
        }
        static get enabled() {
            return this._enabled;
        }

        private _gainNode: GainNode;
        private _audioNode: AudioBufferSourceNode;
        private _buffer: AudioBuffer;
        private _startTime: number = 0;
        private _isLoading: boolean;

        src: string;
        loop: boolean = false;
        muted: boolean = false;
        loaded: boolean = false;
        volume: number = 1;
        playing: boolean = false;
        autoplay: boolean = false;
        duration: number = 0;
        currentTime: number = 0;

        constructor(src: string) {
            super();

            this.src = src;
            this._handleEvent = this._handleEvent.bind(this);
            this._gainNode = context.createGain ? context.createGain() : context['createGainNode']();
            this._gainNode.connect(context.destination);
        }

        load() {
            if (this._isLoading || this.loaded) {
                return;
            }

            let request = new XMLHttpRequest();
            request.onprogress = request.onload = request.onerror = this._handleEvent;
            request.open('GET', this.src, true);
            request.responseType = 'arraybuffer';
            request.send();

            this._isLoading = true;
        }

        play() {
            if (!WebAudio.enabled) {
                return;
            }

            if (this.playing) {
                this.stop();
            }

            if (this.loaded) {
                this._play();
            }
            else if (!this._buffer) {
                this.autoplay = true;
                this.load();
            }
        }

        pause() {
            if (this.playing) {
                this._audioNode.stop();
                this.currentTime += context.currentTime - this._startTime;
                this.playing = false;
            }
        }

        resume() {
            if (!this.playing && WebAudio.enabled) {
                this._play();
            }
        }

        stop() {
            if (this.playing) {
                this._audioNode.stop(0);
                this._audioNode.disconnect();
                this.currentTime = 0;
                this.playing = false;
            }
        }

        setMute(muted: boolean) {
            if (this.muted != muted) {
                this.muted = muted;
                this._gainNode.gain.value = muted ? 0 : this.volume;
            }
        }

        setVolume(volume: number) {
            if (this.volume != volume) {
                this.volume = volume;
                this._gainNode.gain.value = volume;
            }
        }

        clone() {
            let cloned = new WebAudio(this.src);

            if (this._isLoading) {
                cloned._isLoading = true;
                this.once('load', () => {
                    cloned._onDecodeCompleted(this._buffer);
                });
            }
            else if (this.loaded) {
                cloned._onDecodeCompleted(this._buffer);
            }

            return cloned;
        }

        private _handleEvent(e: Event) {
            let type = e.type;
            switch (type) {
                case 'load':
                    let request: XMLHttpRequest = <any>e.target;
                    request.onload = request.onprogress = request.onerror = null;
                    context.decodeAudioData(request.response, (buffer) => this._onDecodeCompleted(buffer), () => this.emit('error'));
                    request = null;
                    break;
                case 'ended':
                    if (this.playing) {
                        // play ended, not paused
                        this.currentTime = 0;
                        this.playing = false;
                        this.emit('ended');
                        if (this.loop) {
                            this.play();
                        }
                    }
                    break;
                default:
                    this.emit(type, e);
                    break;
            }
        }

        private _onDecodeCompleted(buffer: AudioBuffer) {
            this._buffer = buffer;
            this._isLoading = false;
            this.loaded = true;
            this.duration = buffer.duration;
            this.emit('load');
            if (this.autoplay) {
                this.play();
            }
        }

        private _play() {
            this._clearAudioNode();

            let audioNode = context.createBufferSource();

            if (!audioNode.start) {
                audioNode.start = audioNode['noteOn'];
                audioNode.stop = audioNode['noteOff'];
            }

            this._gainNode.gain.value = this.muted ? 0 : this.volume;

            audioNode.buffer = this._buffer;
            audioNode.onended = this._handleEvent;
            audioNode.connect(this._gainNode);
            audioNode.start(0, this.currentTime);

            this._audioNode = audioNode;
            this._startTime = context.currentTime;
            this.playing = true;
        }

        private _clearAudioNode() {
            let audioNode = this._audioNode;

            if (audioNode) {
                audioNode.onended = null;
                audioNode.disconnect(0);
                this._audioNode = null;
            }
        }
    }

    /**
     * HTMLAudio
     */
    export class HTMLAudio extends EventEmitter {

        static enabled: boolean = false;

        private _audioNode: HTMLAudioElement;
        private _isLoading: boolean;

        src: string;
        loop: boolean = false;
        muted: boolean = false;
        loaded: boolean = false;
        volume: number = 1;
        playing: boolean = false;
        autoplay: boolean = false;
        duration: number = 0;
        currentTime: number = 0;

        constructor(src: string) {
            super();

            this.src = src;
            this._handleEvent = this._handleEvent.bind(this);
        }

        load() {
            if (this.loaded || this._isLoading) {
                return;
            }

            let audioNode = this._audioNode = new Audio();
            audioNode.addEventListener('canplaythrough', this._handleEvent, false);
            audioNode.addEventListener('ended', this._handleEvent, false);
            audioNode.addEventListener('error', this._handleEvent, false);

            audioNode.preload = "auto";
            audioNode['autobuffer'] = true;
            audioNode.setAttribute('src', this.src);
            audioNode.volume = this.volume;
            audioNode.load();
        }

        play() {
            if (!HTMLAudio.enabled) {
                return;
            }
            if (this.playing) {
                this.stop();
            }

            if (this.loaded) {
                this._play();
            }
            else if (!this._isLoading) {
                this.autoplay = true;
                this.load();
            }
        }

        pause() {
            if (this.playing) {
                this._audioNode.pause();
                this.currentTime = this._audioNode.currentTime;
                this.playing = false;
            }
        }

        resume() {
            if (!this.playing && HTMLAudio.enabled) {
                this.play();
            }
        }

        stop() {
            if (this.playing) {
                this._audioNode.pause();
                this._audioNode.currentTime = this.currentTime = 0;
                this.playing = false;
            }
        }

        setMute(muted: boolean) {
            if (this.muted != muted) {
                this.muted = muted;
                if (this._audioNode) {
                    this._audioNode.volume = muted ? 0 : this.volume;
                }
            }
        }

        setVolume(volume: number) {
            if (this.volume != volume) {
                this.volume = volume;
                if (this._audioNode) {
                    this._audioNode.volume = volume;
                }
            }
        }

        clone() {
            let cloned = new HTMLAudio(this.src);

            if (this.loaded) {
                cloned._audioNode = <HTMLAudioElement>this._audioNode.cloneNode(true);
                cloned.loaded = true;
                cloned.duration = this.duration;
            }

            return cloned;
        }

        private _handleEvent(e: Event) {
            let type = e.type;

            switch (type) {
                case 'canplaythrough':
                    e.target.removeEventListener('canplaythrough', this._handleEvent, false);

                    this.loaded = true;
                    this.duration = this._audioNode.duration;
                    this.emit('load');

                    if (this.autoplay) {
                        this.play();
                    }
                    break;
                case 'ended':
                    this.playing = false;
                    this.currentTime = 0;
                    this.emit('ended');

                    if (this.loop) {
                        this.play();
                    }
                    break;
            }
        }

        private _play() {
            if (!this.playing) {
                this._audioNode.volume = this.muted ? 0 : this.volume;
                this._audioNode.play();
                this.playing = true;
            }
        }
    }
}