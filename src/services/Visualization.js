import Peaks from 'peaks.js';

class VisualizationService {

    constructor() {
        this.peaksInstance = null;
        // peek instance parameters
        this.container = null;
        this.mediaElement = null;
        this.audioContext = null;
    }

    __initPeeks() {
        this.peaksInstance = Peaks.init({
            container: this.container,
            mediaElement: this.mediaElement,
            audioContext: this.audioContext,
            keyboard: true,
            pointMarkerColor: '#006eb0',
            showPlayheadTime: true,
        });
    }

    init(container, mediaElement) {
        // store them for future reloads
        this.audioContext = new AudioContext();
        this.container = container;
        this.mediaElement = mediaElement;
        this.__initPeeks();
    }

    reload() {
        this.peaksInstance.destroy();
        this.__initPeeks();
    }

    zoomIn() {
        this.peaksInstance.zoom.zoomIn();
    }

    zoomOut() {
        this.peaksInstance.zoom.zoomOut();
    }

    seek(time) {
        let seconds = parseFloat(time);
        if (!Number.isNaN(seconds)) {
            this.peaksInstance.player.seek(seconds);
        }
    }

    addSegment() {
        this.peaksInstance.segments.add({
            startTime: this.peaksInstance.player.getCurrentTime(),
            endTime: this.peaksInstance.player.getCurrentTime() + 1,
            labelText: "word " + this.peaksInstance.segments.getSegments().length,
            editable: true
        });
    }

    getSegments() {
        return this.peaksInstance.segments.getSegments();
    }

    removeSegment(segmentID) {
        this.peaksInstance.segments.removeById(segmentID);
    }

    playSegment(segmentID) {
        let segment = this.peaksInstance.segments.getSegment(segmentID);
        this.peaksInstance.player.playSegment(segment);
    }
}

// singleton
const visualizationService = new VisualizationService();
export default visualizationService;