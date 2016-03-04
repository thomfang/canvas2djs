/// <reference path="./eventemitter.ts" />

namespace canvas2d {

    var AudioCtx = window['AudioContext'] || window['webkitAudioContext'];
    var context: AudioContext = AudioCtx ? new AudioCtx() : null;
    
    /**
     * WebAudio
     */
    export class WebAudio extends EventEmitter {

        static isSupported: boolean = AudioCtx != null;
        static enabled: boolean = false;
        static enable() {
            if (!this.enabled && this.isSupported) {
                let source = context.createBufferSource();
                source.buffer = context.createBuffer(1, 1, 22050);
                source.connect(context.destination);
                source.start ? source.start(0, 0, 0) : source['noteOn'](0, 0, 0);
                this.enabled = true;
            }
            return this.enabled;
        }

        private _gainNode: GainNode;
        private _audioNode: AudioBufferSourceNode;
        private _buffer: AudioBuffer;
        private _offset: number = 0;
        private _startTime: number = 0;
        private _isLoading: boolean;

        src: string;
        loop: boolean = false;
        muted: boolean = false;
        loaded: boolean = false;
        volume: number = 0;
        playing: boolean = false;
        autoplay: boolean = false;
        duration: number = 0;

        constructor(src: string) {
            super();

            this.src = src;
            this._gainNode = context.createGain ? context.createGain : context['createGainNode']();
            this._gainNode.connect(context.destination);
        }

        load() {
            if (this._isLoading || this.loaded) {
                return;
            }
            
            let request = new XMLHttpRequest();
            request.onprogress = request.onload = request.onerror = (e) => this._handleEvent(e);
            request.open('GET', this.src, true);
            request.responseText = 'arraybuffer';
            request.send();
            this._isLoading = true;
        }

        play() {
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
                this._audioNode.stop(0);
                this._offset += context.currentTime - this._startTime;
                this.playing = false;
            }
        }

        resume() {
            if (!this.playing) {
                this._play();
            }
        }

        stop() {
            if (this.playing) {
                this._audioNode.stop(0);
                this._audioNode.disconnect();
                this._offset = 0;
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
                    this.playing = false;
                    this.emit('ended');
                    if (this.loop) {
                        this._play();
                    }
                    break;
                default:
                    this.emit(type, e);
                    break;
            }
        }

        private _onDecodeCompleted(buffer: AudioBuffer) {
            this.loaded = true;
            this.duration = buffer.duration;
            this.emit('load');
            if (this.autoplay) {
                this._play();
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
            audioNode.onended = e => this._handleEvent(e);
            audioNode.connect(this._gainNode);
            audioNode.start(0, this._offset);

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
        
        private _audioNode: HTMLAudioElement;
        private _isLoading: boolean;
        
        src: string;
        loop: boolean = false;
        muted: boolean = false;
        loaded: boolean = false;
        volume: number = 0;
        playing: boolean = false;
        autoplay: boolean = false;
        duration: number = 0;
        
        constructor(src: string) {
            super();
            
            this.src = src;
            this.muted = false;
            this._handleEvent = this._handleEvent.bind(this);
        }
        
        load() {
            if (this.loaded || this._isLoading) {
                return;
            }
            
            let audioNode = new Audio();
            audioNode.oncanplaythrough = audioNode.onerror = (e) => this._handleEvent(e);
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
            
        }
        
        pause() {
            
        }
        
        resume() {
            
        }
        
        stop() {
            
        }
        
        clone() {
            
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
                        this._play();
                    }
                    break;
                case 'ended':
                    this.playing = false;
                    this.emit('ended');
                    break;
                default:
                    break;
            }
        }
        
        private _play() {
            
        }
    }
}