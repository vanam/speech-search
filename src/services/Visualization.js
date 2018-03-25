import WaveSurfer from 'wavesurfer.js';

class VisualizationService {

    constructor() {
        this.wavesurfer = null;
        this.minPxPerSec = 50;
        this.updateTimeCallback = null;
    }

    init(updateTimeCallback, updateDurationCallback) {
        this.updateTimeCallback = updateTimeCallback;
        this.updateDurationCallback = updateDurationCallback;
        this.wavesurfer = WaveSurfer.create({
            container: '#waveform',
            waveColor: 'violet',
            progressColor: 'purple',
            height: 128,
            scrollParent: true,
            barHeight: 2,
            minPxPerSec: this.minPxPerSec
        });

        this.wavesurfer.on('audioprocess', function(secNum) {
            this.updateTimeCallback(this.formatTime(secNum));
        }.bind(this));

        this.wavesurfer.on('seek', (function(seek) {
            let secNum = this.wavesurfer.getDuration() * seek;
            this.updateTimeCallback(this.formatTime(secNum));
        }).bind(this));

        this.wavesurfer.on('ready', (function() {
            this.updateDurationCallback(this.formatTime(this.wavesurfer.getDuration()));
        }).bind(this))
    }

    formatTime(secNum) {
        let hours   = Math.floor(secNum / 3600);
        let minutes = Math.floor((secNum - (hours * 3600)) / 60);
        let seconds = secNum - (hours * 3600) - (minutes * 60);
        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return hours+':'+minutes+':'+ Math.round(seconds);
    }

    load(blobOrFile) {
        this.wavesurfer.loadBlob(blobOrFile);
    }

    clear() {
        this.wavesurfer.empty();
    }

    play() {
        this.wavesurfer.play();
    }

    pause() {
        this.wavesurfer.pause();
    }

    zoomIn() {
        this.minPxPerSec *= Math.SQRT2;
        this.wavesurfer.zoom(this.minPxPerSec);
    }

    zoomOut() {
        this.minPxPerSec *= Math.SQRT1_2;
        this.wavesurfer.zoom(this.minPxPerSec);
    }

    seek(time) {
        let seconds = parseFloat(time);
        if (!Number.isNaN(seconds)) {
            if (seconds > this.wavesurfer.getDuration()) {
                seconds = this.wavesurfer.getDuration();
            } else if (seconds < 0) {
                seconds = 0
            }
            let jump = seconds / this.wavesurfer.getDuration();
            this.wavesurfer.seekAndCenter(jump);
            return seconds;
        }
    }

    playSegment(startTime, endTime) {
        this.wavesurfer.play(startTime, endTime);
    }
}

// singleton
const visualizationService = new VisualizationService();
export default visualizationService;