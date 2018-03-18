function httpGetToken()
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", 'http://authserver-balanced-rabbit.eu-gb.mybluemix.net/getToken', false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function analyzeFile() {
    var x = document.getElementById("myFile");
    var txt = "";
    var file = x.files[0];
    txt += "name: " + file.name + "<br>";
    txt += "size: " + file.size + " bytes <br>";
    document.getElementById("demo").innerHTML = txt;

    var authToken = httpGetToken();
    console.log("Token: ", authToken);

    var words = ['internet', 'platform', 'microsoft', 'your']; // keywords to find
    var stream = WatsonSpeech.SpeechToText.recognizeFile({
        token: authToken,
        file: file,
        speaker_labels: false,
        model: 'en-US_BroadbandModel',
        word_alternatives_threshold: 0.9,
        keywords: words,
        keywords_threshold: 0.5,
        interim_results: false,
        objectMode: true, // send objects instead of text
        realtime: false, // don't slow down the results if transcription occurs faster than playback
        format: false, // enable resultsBySpeaker when formatting for multiple speakers
        play: false
    });

    stream.on('data', function(data) {
        console.log(JSON.stringify(data));
        if(data.results[0].keywords_result == null){ // found any keywords?
            console.log("No keywords found.");
        } else {
            var keywords="";
            for(i = 0; i < words.length; i++){ // found keywords are in associative array
                if(data.results[0].keywords_result[words[i]]!=null){
                    for(j = 0; j < data.results[0].keywords_result[words[i]].length; j++){ // multiple appearances of a keyword
                        var start_time = data.results[0].keywords_result[words[i]][j].start_time;
                        var end_time = data.results[0].keywords_result[words[i]][j].end_time
                        keywords+="Found keyword: " + words[i] + " at " + start_time + " - " + end_time + "<br>";
                    }
                }
            }
        }
        document.getElementById("file-content").innerHTML = data.results[0].alternatives[0].transcript+"<br>"+keywords;
    });

    stream.on('error', function(err) {
        console.log(err);
    });
}

