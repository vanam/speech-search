const fs = require("fs");
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var speech_to_text = new SpeechToTextV1 ({
    username: 'bd7dedba-211e-46e0-ba43-70df9bc166e3',
    password: 'dqJ5TnT7jMfb'
});

/*speech_to_text.listModels(null, function(error, models) {
    if (error)
        console.log('Error:', error);
    else
        console.log(JSON.stringify(models, null, 2));
});*/


/*****************************************
 * Get a single model.
 ****************************************/
var params = {
    model_id: 'en-US_BroadbandModel'
};
speech_to_text.getModel(params, function(error, model) {
    if (error)
        console.log('Error:', error);
    else
        console.log(JSON.stringify(model, null, 2));
});


var words = ['internet', 'platform', 'microsoft', 'your'];

// parameters of recognition
var params = {
    model: 'en-US_BroadbandModel',
    audio: fs.createReadStream("audio/audio_sample.mp3"),
    object_mode: true,
    content_type: 'audio/mp3',
    timestamps: true,
    interim_results: false,
    word_alternatives_threshold: 0.9,
    keywords: words,
    keywords_threshold: 0.5
};

// returns a JSON with transcript, found keywords and other info
speech_to_text.recognize(params, function(error, transcript) {
    if (error)
        console.log('Error:', error);
    else {
        console.log(JSON.stringify(transcript, null, 2));
        if(transcript.results[0].keywords_result == null){ // found any keywords?
            console.log("No keywords found.");
        } else {
            for(i = 0; i < words.length; i++){ // found keywords are in associative array
                if(transcript.results[0].keywords_result[words[i]]!=null){
                    for(j = 0; j < transcript.results[0].keywords_result[words[i]].length; j++){ // multiple appearances of a keyword
                        var start_time = transcript.results[0].keywords_result[words[i]][j].start_time;
                        var end_time = transcript.results[0].keywords_result[words[i]][j].end_time
                        console.log("Found keyword: " + words[i] + " at " + start_time + " - " + end_time);
                    }
                }
            }
        }
    }
});


