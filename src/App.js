import React, {Component} from 'react';
import { Segment, Button, Input, Table, Icon } from 'semantic-ui-react'

// visualization singleton
import visualizationService from './services/Visualization'
// IBM SpeechToTextService singleton
import speechToTextService from './services/SpeechToTextService'

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            uploadedAudioURL: null,
            recordingEntered: false,
            voiceRecording: false,
            recordingWaiting: false,
            playTime: '00:00:00',
            duration: '00:00:00',
            segments: [],
            recordings: [],
            keywords: [],
            transcripts: []
        };
        // DOM elements
        this.inputFieldELM = null;
        this.keywordInputELM = null;
        // helper variables
        this.activeRecording = 0;
        this.recorder = null;
        this.audioChunks = [];
    }

    componentDidMount() {
        this.inputFieldELM = document.getElementById('file-input-field');
        this.keywordInputELM = document.getElementById('new-keyword-input');

        visualizationService.init(this.updateTimeCallback, this.updateDurationCallback);
        speechToTextService.init(this.displayFoundKeywordsCallback);
    };

    triggerUpload = () => {
        this.inputFieldELM.click();
    };

    _addNewRecording = (recording) => {
        let duration = visualizationService.load(recording);

        this.setState((prevState) => {
            prevState.recordings.push(recording);
            prevState.keywords.push([]);
            prevState.segments.push([]);
            prevState.transcripts.push([]);
            this.activeRecording = (prevState.recordings.length - 1);

            return {
                duration: duration,
                recordingEntered: true,
                recordings: prevState.recordings,
                keywords: prevState.keywords,
                segments: prevState.segments,
                transcripts: prevState.transcripts
            };
        });
    };

    showFile = (e) => {
        this._addNewRecording(e.target.files[0]);
        e.target.value = '';
    };

    __dataAvailable = (e) => {
        this.audioChunks.push(e.data);
        if (this.recorder.state === "inactive") {
            let blob = new Blob(this.audioChunks,{type:'audio/x-mpeg-3'});
            blob.name = 'voice_' + this.state.recordings.length;
            this.setState({recordingEntered: true, voiceRecording: false});
            this._addNewRecording(blob);
        }
    };

    triggerMicRecording = () => {
        let handleSuccess = function(stream) {
            this.recorder = new MediaRecorder(stream);
            this.audioChunks = [];
            this.recorder.start();
            this.recorder.ondataavailable = this.__dataAvailable;

            setTimeout(function(){ this.setState({recordingWaiting: false}); }.bind(this), 5000);
            this.setState({voiceRecording: true, recordingWaiting: true});
        }.bind(this);

        navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(handleSuccess).catch(e => console.log(e));
    };

    updateTimeCallback = (newTime) => {
        this.setState({playTime: newTime});
    };

    updateDurationCallback = (duration) => {
        this.setState({duration: duration});
    };

    displayFoundKeywordsCallback = (results) => {
        if (results.result === 'error') {
            alert(results.data);
        } else {
            if (results.data.length === 0) {
                alert("No match for entered keywords.");
            } else {
                this.setState((prevState) => {
                    prevState.segments[this.activeRecording] = results.data;
                    prevState.transcripts[this.activeRecording] = results.transcripts;
                    return {
                        segments: prevState.segments,
                        transcripts: prevState.transcripts
                    };
                });
            }
        }
    };

    stopMicRecording = () => {
        this.recorder.stop();
    };

    playTape = () => {
        visualizationService.play();
    };

    pauseTape = () => {
        visualizationService.pause();
    };

    zoomInVis = () => {
        visualizationService.zoomIn();
    };

    zoomOutVis = () => {
        visualizationService.zoomOut();
    };

    seekVis = (e) => {
        e.target.value = Math.round(visualizationService.seek(e.target.value));
    };

    playSegment = (startTime, endTime) => {
        visualizationService.playSegment(startTime, endTime);
    };

    removeSegment = (segmentID) => {
        this.setState((prevState) => {
            prevState.segments[this.activeRecording].splice(segmentID, 1);
            return { segments: prevState.segments};
        });
    };

    removeKeyword = (index) => {
        this.setState((prevState) => {
            prevState.keywords[this.activeRecording].splice(index, 1);
            return { keywords: prevState.keywords};
        });
    };

    addKeyword = () => {
        this.setState((prevState) => {
            prevState.keywords[this.activeRecording].push(this.keywordInputELM.value);
            this.keywordInputELM.value = '';
            return {
                keywords: prevState.keywords
            };
        });
    };

    removeRecording = (index) => {
        this.setState((prevState) => {
            if (this.activeRecording === index) {
                this.activeRecording = 0; // reset to 0
                if (prevState.recordings.length > 0) {
                    visualizationService.load(prevState.recordings[0]);
                } else {
                    prevState.recordingEntered = false;
                    visualizationService.clear();
                }
            } else if (this.activeRecording > index) {
                this.activeRecording--;
            }

            prevState.recordings.splice(index, 1);
            prevState.keywords.splice(index, 1);
            prevState.segments.splice(index, 1);
            prevState.transcripts.splice(index, 1);
            return {
                recordingEntered: prevState.recordingEntered,
                recordings: prevState.recordings,
                keywords: prevState.keywords,
                segments: prevState.segments,
                transcripts: prevState.transcripts,
            };
        });
        this.forceUpdate();
    };

    setActiveRecording = (index) => {
        visualizationService.load(this.state.recordings[index]);
        this.activeRecording = index;
        this.forceUpdate();
    };

    searchForKeywords = () => {
        if (this.state.keywords[this.activeRecording].length === 0) {
            alert('Please enter some keyword');
            return true;
        }
        speechToTextService.searchForKeywords(this.state.recordings[this.activeRecording],
            this.state.keywords[this.activeRecording]);
    };

    render() {
        let recordingLength = this.state.recordings.length;

        const row = (segment, index) => (
            <Table.Row key={index}>
                <Table.Cell>{segment[0]}</Table.Cell>
                <Table.Cell>{segment[1]}</Table.Cell>
                <Table.Cell>{segment[2]}</Table.Cell>
                <Table.Cell>{segment[3]}</Table.Cell>
                <Table.Cell>{segment[4]}</Table.Cell>
                <Table.Cell><Button size='mini' color='green' onClick={this.playSegment.bind(this, segment[3], segment[4])}>Play</Button></Table.Cell>
                <Table.Cell><Button size='mini' color='red' onClick={this.removeSegment.bind(this, index)}>Remove</Button></Table.Cell>
            </Table.Row>
        );

        const file = (fileOrBlob, index) => (
            <span key={index} className={((this.activeRecording === index) ? 'recording active' : 'recording')} onClick={this.setActiveRecording.bind(this, index)}>
                <Icon name='remove' onClick={this.removeRecording.bind(this, index)}/>
                {fileOrBlob.name}
            </span>
        );

        const keyword = (keyword, index) => (
            <span key={index} className="keyword">
                <Icon name='remove' onClick={this.removeKeyword.bind(this, index)}/>
                {keyword}
            </span>
        );

        const keywords = () => (
            <Segment color="brown" id="keywords-list">
                { this.state.keywords[this.activeRecording].map(keyword) }
            </Segment>
        );

        const transcript = (tranObj, index) => (
            <div key={index}>
                <h5>Confidence: {(tranObj.confidence * 100) + " %"}</h5>
                <p>{tranObj.transcript}</p>
            </div>
        );

        return (
            <div className="App">
                <header><h1>Integration project</h1></header>
                <Segment.Group id="int-wrapper">
                    <Segment.Group id="user-input">
                        <Segment>
                            <h2 style={{display: (this.state.voiceRecording) ? 'none' : 'block-inline'}}>Please enter your recording</h2>
                            <h2 style={{display: (this.state.voiceRecording) ? 'block-inline' : 'none'}}>Recording...</h2>
                        </Segment>
                        <Segment  color="grey" loading={this.state.recordingWaiting}>
                            <Button.Group size='medium' color="brown" style={{display: (this.state.voiceRecording) ? 'none' : 'inline-flex'}}>
                                <Button onClick={this.triggerUpload}>Upload file</Button>
                                <Button.Or />
                                <Button onClick={this.triggerMicRecording}>Record voice</Button>
                            </Button.Group>
                            <Button size='medium' color="brown" onClick={this.stopMicRecording} style={{display: ((this.state.voiceRecording) ? 'block' : 'none'), margin: '0 auto'}}>Stop recording</Button>
                            <input type="file" id="file-input-field" style={{display: 'none'}} onChange={this.showFile}/>
                        </Segment>
                    </Segment.Group>
                    <Segment.Group id="visualization-wrapper" style={{display: (this.state.recordingEntered) ? 'block' : 'none'}}>
                        <Segment color="grey">
                            <h2>Player</h2>
                        </Segment>
                        <Segment id="waveform" color="brown"/>
                        <Segment id="vis-controls" color="brown">
                            <div className="vis-control-left-group">
                                <Button icon size='mini' onClick={this.playTape} color="green" labelPosition='left'><Icon name='play'/>Play</Button>
                                <Button icon size='mini' onClick={this.pauseTape} labelPosition='left'><Icon name='pause' />Pause</Button>
                                <span id="play-time">{this.state.playTime}/{this.state.duration}</span>
                            </div>
                            <div className="vis-control-right-group">
                                <Button size='mini' color="brown" onClick={this.zoomInVis}>Zoom in</Button>
                                <Button size='mini' color="brown" onClick={this.zoomOutVis}>Zoom out</Button>
                                <Input size='mini' color="brown" label='Seek' id="seek-input" defaultValue={0.0} type="number" onChange={this.seekVis}/>
                            </div>
                        </Segment>

                        <Segment.Group style={{display: (recordingLength > 0) ? 'block' : 'none'}}>
                            <Segment>
                                <h3>Recordings</h3>
                            </Segment>
                            <Segment id="files" color="brown">
                                { this.state.recordings.map(file) }
                            </Segment>
                        </Segment.Group>

                        <Segment.Group style={{display: (recordingLength > 0) ? 'block' : 'none'}} id="keywords-search">
                            <Segment>
                                <h3>Keywords</h3>
                            </Segment>
                            {((recordingLength > 0 && this.state.keywords[this.activeRecording].length > 0) ? keywords() : '')}
                            <Segment color="brown">
                                <Input type='text' placeholder='Keyword' size='mini'>
                                    <input id="new-keyword-input"/>
                                    <Button id="new-keyword-button" type='submit' onClick={this.addKeyword} size='mini'>Add</Button>
                                </Input>
                                <Button icon size='mini' id="search-keywords-button" onClick={this.searchForKeywords} labelPosition='left' ><Icon name='search'/>Search for keywords</Button>
                            </Segment>
                            <Segment color="brown" style={{display: (recordingLength > 0 && this.state.segments[this.activeRecording].length > 0) ? 'block' : 'none'}}>
                                <Table celled>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Original keyword</Table.HeaderCell>
                                            <Table.HeaderCell>Normalized Text</Table.HeaderCell>
                                            <Table.HeaderCell>Confidence</Table.HeaderCell>
                                            <Table.HeaderCell>Start Time</Table.HeaderCell>
                                            <Table.HeaderCell>End Time</Table.HeaderCell>
                                            <Table.HeaderCell>Play</Table.HeaderCell>
                                            <Table.HeaderCell>Remove</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        { (recordingLength > 0 && this.state.segments[this.activeRecording].length > 0) ? this.state.segments[this.activeRecording].map(row) : ( <Table.Row></Table.Row>) }
                                    </Table.Body>
                                </Table>
                            </Segment>
                            <Segment style={{display: (recordingLength > 0 && this.state.segments[this.activeRecording].length > 0) ? 'block' : 'none'}}>
                                <h3>Transcripts</h3>
                            </Segment>
                            <Segment color="brown" style={{display: (recordingLength > 0 && this.state.segments[this.activeRecording].length > 0) ? 'block' : 'none'}}>
                                {(recordingLength > 0 && this.state.segments[this.activeRecording].length > 0 && this.state.transcripts[this.activeRecording].length > 0) ? this.state.transcripts[this.activeRecording].map(transcript) : ''}
                            </Segment>
                        </Segment.Group>
                    </Segment.Group>
                </Segment.Group>
            </div>
        );
    }
}

export default App;
