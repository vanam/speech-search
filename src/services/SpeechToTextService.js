// import SpeechToTextV1 from 'watson-developer-cloud/speech-to-text/v1'

class SpeechToTextService {

    constructor() {
        // TODO Michal
        // let speech_to_text = new SpeechToTextV1 ({
        //     username: 'bd7dedba-211e-46e0-ba43-70df9bc166e3',
        //     password: 'dqJ5TnT7jMfb',
        //     headers: {
        //         'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
        //     }
        // });
        // let params = {
        //     model_id: 'en-US_BroadbandModel'
        // };
        // speech_to_text.getModel(params, function(error, model) {
        //     if (error)
        //         console.log('Error:', error);
        //     else
        //         console.log(JSON.stringify(model, null, 2));
        // });
    }
}

const speechToTextService = new SpeechToTextService();
export default speechToTextService;