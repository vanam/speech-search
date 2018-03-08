function addSource(name, type, dataPath) {
    var sourceMp3 = document.querySelector('source[id=\"' + name + '\"]');
    sourceMp3.setAttribute('src', dataPath + type);
};

/*
 var exampleSegments = [{
        startTime: 0,
        endTime: 3,
        color: '#333',
        labelText: 'word1'
    }, {
        startTime: 5,
        endTime: 6.2,
        color: '#666',
        labelText: 'word2'
    }];
*/


(function(Peaks) {
    
    // initialization visualiser container 
    // var dataPath = '/test_data/sample';
    // addSource('mp3-source', '.mp3', dataPath);

    var myAudioContext = new AudioContext();
    var options = {
        container: document.getElementById('waveform-visualiser-container'),
        mediaElement: document.querySelector('audio'),

        audioContext: myAudioContext,
        keyboard: true,
        pointMarkerColor: '#006eb0',
        showPlayheadTime: true,
    };

    var peaksInstance = Peaks.init(options);



    /*segments definition*/
    peaksInstance.on('peaks.ready', function() {
        console.log('peaks.ready');

        renderSegments(peaksInstance.segments.getSegments());

    });

    //============================

    // buttons actions
    document.querySelector('[data-action="zoom-in"]').addEventListener('click', function() {
        peaksInstance.zoom.zoomIn();
    });

    document.querySelector('[data-action="zoom-out"]').addEventListener('click', function() {
        peaksInstance.zoom.zoomOut();
    });

    document.querySelector('button[data-action="add-segment"]').addEventListener('click', function() {
       
        addSegement(peaksInstance.segments,
                    peaksInstance.player.getCurrentTime(),  
                   peaksInstance.player.getCurrentTime()+1,
                   "word" + peaksInstance.segments.getSegments().length);
        
        renderSegments(peaksInstance.segments.getSegments());
    });


    document.querySelector('button[data-action="seek"]').addEventListener('click', function(event) {
       
        var time = document.getElementById('seek-time').value;
        var seconds = parseFloat(time);
        
        if (!Number.isNaN(seconds)) {
            peaksInstance.player.seek(seconds);
        }
    });

    document.querySelector('body').addEventListener('click', function(event) {
        var element = event.target;
        var action = element.getAttribute('data-action');
        var id = element.getAttribute('data-id');

        if (action === 'play-segment') {
            var segment = peaksInstance.segments.getSegment(id);
            peaksInstance.player.playSegment(segment);
            
        } else if (action === 'remove-segment') {
            peaksInstance.segments.removeById(id);
            renderSegments(peaksInstance.segments.getSegments());

        }
    });


    // Points mouse events

    peaksInstance.on('points.mouseenter', function(point) {
        console.log('points.mouseenter:', point);
    });

    peaksInstance.on('points.mouseleave', function(point) {
        console.log('points.mouseleave:', point);
    });

    peaksInstance.on('points.dblclick', function(point) {
        console.log('points.dblclick:', point);
    });

    peaksInstance.on('points.dragged', function(point) {
        console.log('points.dragged:', point);
    });




    //=======================    
})(peaks);


/* insert segment */
var addSegement = function(segments, startTime, endTime, word){
    segments.add({
            startTime: startTime,
            endTime: endTime,
            labelText: word,
            editable: true
    });
};

// segments render
var renderSegments = function(segments) {
    var segmentsContainer = document.getElementById('segments');

    var html = '';

    console.log('segments: ' + segments.length);
    for (var i = 0; i < segments.length; i++) {
        var segment = segments[i];

        var row = '<tr>' +
            '<td>' + segment.id + '</td>' +
            '<td>' + segment.labelText + '</td>' +
            '<td>' + segment.startTime + '</td>' +
            '<td>' + segment.endTime + '</td>' +
            '<td>' + '<a href="#' + segment.id + '" data-action="play-segment" data-id="' + segment.id + '">Play</a>' + '</td>' +
            '<td>' + '<a href="#' + segment.id + '" data-action="remove-segment" data-id="' + segment.id + '">Remove</a>' + '</td>' + '</tr>';

        html += row;
    }

    segmentsContainer.querySelector('tbody').innerHTML = html;

    if (html.length) {
        segmentsContainer.classList = '';
    }
};