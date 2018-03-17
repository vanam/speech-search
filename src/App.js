import React, {Component} from 'react';
import { Segment, Button, Input, Table } from 'semantic-ui-react'

// visualization singleton
import visualizationService from './services/Visualization'
// IBM SpeechToTextService singleton
// import speechToTextService from './services/SpeechToTextService'

// import audio from './data/sample.mp3'

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            inputFieldELM: null,
            audioSourcesELM: null,
            uploadedAudioURL: null,
            recordingEntered: false,
            voiceRecording: false,
            recordingWaiting: false,
            segments: []
        };

        this.recorder = null;
        this.audioChunks = [];
    }

    componentDidMount = () => {
        let audioSources = document.getElementById('audio-sources');
        this.setState({
            audioSourcesELM: audioSources,
            inputFieldELM: document.getElementById('file-input-field'),
        });
        visualizationService.init(document.getElementById('waveform-visualiser-container'), audioSources);
    };

    triggerUpload = () => {
        this.state.inputFieldELM.click();
    };

    showFile = (e) => {
        // load uploaded file
        this.state.audioSourcesELM.src = URL.createObjectURL(e.target.files[0]);
        this.setState({recordingEntered: true});
        // update audio sources
        this.state.audioSourcesELM.load();
        // now re-render visualization
        visualizationService.reload();
    };

    __dataAvailable = (e) => {
        this.audioChunks.push(e.data);
        if (this.recorder.state === "inactive") {
            let blob = new Blob(this.audioChunks,{type:'audio/x-mpeg-3'});
            this.state.audioSourcesELM.src = URL.createObjectURL(blob);
            this.setState({recordingEntered: true, voiceRecording: false}, function() {
                visualizationService.reload();
            });
        }
    };

    triggerMicRecording = () => {
        let handleSuccess = function(stream) {
            this.recorder = new MediaRecorder(stream);
            this.audioChunks = [];
            this.recorder.start();
            this.recorder.ondataavailable = this.__dataAvailable;
            setTimeout(function(){ this.setState({recordingWaiting: false}); }.bind(this), 10000);
            this.setState({voiceRecording: true, recordingWaiting: true});
        }.bind(this);

        navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(handleSuccess).catch(e => console.log(e));
    };

    stopMicRecording = () => {
        this.recorder.stop();
    };

    zoomInVis = () => {
        visualizationService.zoomIn();
    };

    zoomOutVis = () => {
        visualizationService.zoomOut();
    };

    seekVis = (e) => {
        visualizationService.seek(e.target.value);
    };

    addSegmentVis = () => {
        visualizationService.addSegment();
        this.setState({ segments: visualizationService.getSegments() });
    };

    playVisSegment = (segmentID) => {
        visualizationService.playSegment(segmentID);
    };

    removeVisSegment = (segmentID) => {
        visualizationService.removeSegment(segmentID);
        this.setState({ segments: visualizationService.getSegments() });
    };

    render() {
        const row = (segment) => (
            <Table.Row key={segment.id}>
                <Table.Cell>{segment.id}</Table.Cell>
                <Table.Cell>{segment.labelText}</Table.Cell>
                <Table.Cell>{segment.startTime}</Table.Cell>
                <Table.Cell>{segment.endTime}</Table.Cell>
                <Table.Cell><Button size='mini' color='green' onClick={this.playVisSegment.bind(this, segment.id)}>Play</Button></Table.Cell>
                <Table.Cell><Button size='mini' color='red' onClick={this.removeVisSegment.bind(this, segment.id)}>Remove</Button></Table.Cell>
            </Table.Row>
        );

        return (
            <div className="App">
                <header><h1>Integration project</h1></header>
                <Segment.Group id="user-input" style={{display: (this.state.recordingEntered) ? 'none' : 'block'}}>
                    <Segment>
                        <h2 style={{display: (this.state.voiceRecording) ? 'none' : 'initial'}}>Please enter your recording</h2>
                        <h2 style={{display: (this.state.voiceRecording) ? 'initial' : 'none'}}>Recording...</h2>
                    </Segment>
                    <Segment  color="brown" loading={this.state.recordingWaiting}>
                        <Button.Group size='massive' color="brown" style={{display: (this.state.voiceRecording) ? 'none' : 'inline-flex'}}>
                            <Button onClick={this.triggerUpload}>Upload file</Button>
                            <Button.Or />
                            <Button onClick={this.triggerMicRecording}>Record voice</Button>
                        </Button.Group>
                        <Button size='massive' color="brown" onClick={this.stopMicRecording} style={{display: ((this.state.voiceRecording) ? 'block' : 'none'), margin: '0 auto'}}>Stop recording</Button>
                        <input type="file" id="file-input-field" style={{display: 'none'}} onChange={this.showFile}/>
                    </Segment>
                </Segment.Group>

                <Segment.Group id="visualization-wrapper" style={{visibility: (this.state.recordingEntered) ? 'visible' : 'hidden'}}>
                    <Segment>
                        <h2>Recording visualization</h2>
                    </Segment>
                    <Segment id="waveform-visualiser-container" color="brown">
                    </Segment>
                    <Segment id="vis-controls" color="brown">
                        <div className="vis-control-left-group">
                            <audio id="audio-sources" controls>
                                {/*<source src={audio} type="audio/mpeg"/>*/}
                            </audio>
                        </div>
                        <div className="vis-control-right-group">
                            <Button size='mini' color="brown" onClick={this.zoomInVis}>Zoom in</Button>
                            <Button size='mini' color="brown" onClick={this.zoomOutVis}>Zoom out</Button>
                            <Button size='mini' color="brown" onClick={this.addSegmentVis}>Add a Segment at current time</Button>
                            <Input size='mini' color="brown" label='Seek' defaultValue={0.0} type="number" onChange={this.seekVis}/>
                        </div>
                    </Segment>
                    <Segment color="brown" style={{display: (this.state.segments.length > 0) ? 'block' : 'none'}}>
                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Segment ID</Table.HeaderCell>
                                    <Table.HeaderCell>Label Text</Table.HeaderCell>
                                    <Table.HeaderCell>Start Time</Table.HeaderCell>
                                    <Table.HeaderCell>End Time</Table.HeaderCell>
                                    <Table.HeaderCell>Play</Table.HeaderCell>
                                    <Table.HeaderCell>Remove</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                { this.state.segments.map(row) }
                            </Table.Body>
                        </Table>
                    </Segment>
                </Segment.Group>
            </div>
        );
    }
}

export default App;
