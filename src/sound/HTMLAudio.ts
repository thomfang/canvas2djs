import { EventEmitter } from '../EventEmitter';

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