import WatsonSpeech from 'watson-speech'

class SpeechToTextService {

    init(callback) {
        this.searchCallback = callback;
        this.keywords = [];
    }

    static _httpGetToken() {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", 'http://authserver-balanced-rabbit.eu-gb.mybluemix.net/getToken', false); // false for synchronous request
        xmlHttp.send( null );
        return xmlHttp.responseText;
    }

    searchForKeywords(file, keywords) {
        this.keywords = keywords;
        let authToken = SpeechToTextService._httpGetToken();
        let stream = WatsonSpeech.SpeechToText.recognizeFile({
            token: authToken,
            file: file,
            speaker_labels: false,
            model: 'en-US_BroadbandModel',
            word_alternatives_threshold: 0.9,
            keywords: keywords,
            keywords_threshold: 0.5,
            interim_results: false,
            objectMode: true, // send objects instead of text
            realtime: false, // don't slow down the results if transcription occurs faster than playback
            format: false, // enable resultsBySpeaker when formatting for multiple speakers
            play: false
        });

        stream.on('data', function(data) {
            if(data.results[0].keywords_result == null) { // found any keywords?
                console.log("No keywords found.");
                this.searchCallback({result: 'success', data: [], transcripts: []})
            } else {
                let resultData = [];
                for(let i = 0; i < this.keywords.length; i++) {
                    // found keywords are in associative array
                    if (data.results[0].keywords_result[this.keywords[i]] != null) {
                        let results = data.results[0].keywords_result[this.keywords[i]];
                        for(let j = 0; j < results.length; j++) // multiple appearances of a keyword
                            resultData.push([this.keywords[i], results[j].normalized_text, (results[j].confidence * 100) + " %", results[j].start_time, results[j].end_time]);
                    }
                }
                this.searchCallback({result: 'success', data: resultData, transcripts: data.results[0].alternatives})
            }
        }.bind(this));

        stream.on('error', function(err) {
            console.error(err);
            this.searchCallback({result: 'error', data: err})
        }.bind(this));

        // let a = JSON.parse('{"results":[{"word_alternatives":[{"start_time":0.28,"alternatives":[{"confidence":0.9969,"word":"windows"}],"end_time":0.74},{"start_time":2.1,"alternatives":[{"confidence":0.9747,"word":"scale"}],"end_time":2.5},{"start_time":2.5,"alternatives":[{"confidence":0.9705,"word":"cloud"}],"end_time":2.87},{"start_time":2.87,"alternatives":[{"confidence":0.9958,"word":"services"}],"end_time":3.4},{"start_time":3.4,"alternatives":[{"confidence":0.9926,"word":"platform"}],"end_time":4.06},{"start_time":4.09,"alternatives":[{"confidence":0.9957,"word":"hosted"}],"end_time":4.54},{"start_time":4.54,"alternatives":[{"confidence":0.9834,"word":"in"}],"end_time":4.63},{"start_time":4.63,"alternatives":[{"confidence":0.9864,"word":"Microsoft"}],"end_time":5.3},{"start_time":7.86,"alternatives":[{"confidence":0.9083,"word":"business"}],"end_time":8.28},{"start_time":8.31,"alternatives":[{"confidence":0.9955,"word":"are"}],"end_time":8.45},{"start_time":8.45,"alternatives":[{"confidence":0.9905,"word":"protected"}],"end_time":9.09},{"start_time":9.27,"alternatives":[{"confidence":0.975,"word":"by"}],"end_time":9.43},{"start_time":9.43,"alternatives":[{"confidence":0.9603,"word":"H."}],"end_time":9.75},{"start_time":9.75,"alternatives":[{"confidence":0.9363,"word":"B."}],"end_time":9.94},{"start_time":9.94,"alternatives":[{"confidence":0.9471,"word":"security"}],"end_time":10.48},{"start_time":10.48,"alternatives":[{"confidence":0.9453,"word":"technologies"}],"end_time":11.32}],"keywords_result":{"data":[{"normalized_text":"data","start_time":5.3,"confidence":0.812,"end_time":5.54},{"normalized_text":"data","start_time":6.52,"confidence":0.864,"end_time":6.91}]},"alternatives":[{"confidence":0.872,"transcript":"windows as your is an internet scale cloud services platform hosted in Microsoft data centers your data your network in your business are protected by H. B. security technologies "}],"final":true}],"result_index":0}');
        // this.test(a);
    }

    // test(data) {
    //     if(data.results[0].keywords_result == null) { // found any keywords?
    //         console.log("No keywords found.");
    //         this.searchCallback({result: 'success', data: [], transcripts: []})
    //     } else {
    //         let resultData = [];
    //         for(let i = 0; i < this.keywords.length; i++) {
    //             // found keywords are in associative array
    //             if (data.results[0].keywords_result[this.keywords[i]] != null) {
    //                 let results = data.results[0].keywords_result[this.keywords[i]];
    //                 for(let j = 0; j < results.length; j++) // multiple appearances of a keyword
    //                     resultData.push([this.keywords[i], results[j].normalized_text, (results[j].confidence * 100) + " %", results[j].start_time, results[j].end_time]);
    //             }
    //         }
    //         this.searchCallback({result: 'success', data: resultData, transcripts: data.results[0].alternatives})
    //     }
    // }
}

const speechToTextService = new SpeechToTextService();
export default speechToTextService;