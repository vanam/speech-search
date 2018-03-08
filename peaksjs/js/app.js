function addSource(name, type, dataPath){
     var sourceMp3 = document.querySelector('source[id=\"'+name+'\"]');
     sourceMp3.setAttribute('src', dataPath + type); 
};

(function(Peaks) {
    // initialization visualiser container 
        var dataPath = '/test_data/sample';
     
        addSource('mp3-source', '.mp3', dataPath);
        //addSource('ogg-source', '.ogg', dataPath);
    
        var myAudioContext = new AudioContext();
        var options = {
          container: document.getElementById('waveform-visualiser-container'),
          mediaElement: document.querySelector('audio'),
         
            audioContext: myAudioContext,
          keyboard: true,
          pointMarkerColor: '#006eb0',
          showPlayheadTime: true
        };

        var peaksInstance = Peaks.init(options);

        peaksInstance.on('peaks.ready', function() {
          console.log('peaks.ready');
        });
    
    
   
 
       // segments render
        var renderSegments = function(peaks) {
          var segmentsContainer = document.getElementById('segments');
          var segments = peaks.segments.getSegments();
          var html = '';
            

          for (var i = 0; i < segments.length; i++) {
            var segment = segments[i];

            var row = '<tr>' +
              '<td>' + segment.id + '</td>' +
              '<td>' + segment.labelText + '</td>' +
              '<td>' + segment.startTime + '</td>' +
              '<td>' + segment.endTime + '</td>' +
              '<td>' + '<a href="#' + segment.id + '" data-action="play-segment" data-id="' + segment.id + '">Play</a>' + '</td>' +
              '<td>' + '<a href="#' + segment.id + '" data-action="remove-segment" data-id="' + segment.id + '">Remove</a>' + '</td>' +
              '</tr>';

            html += row;
          }

          segmentsContainer.querySelector('tbody').innerHTML = html;

          if (html.length) {
            segmentsContainer.classList = '';
          }
        }

        //============================
        // points render
        var renderPoints = function(peaks) {
          var pointsContainer = document.getElementById('points');
          var points = peaks.points.getPoints();
          var html = '';

          for (var i = 0; i < points.length; i++) {
            var point = points[i];

            var row = '<tr>' +
              '<td>' + point.id + '</td>' +
              '<td>' + point.labelText + '</td>' +
              '<td>' + point.time + '</td>' +
              '<td>' + '<a href="#' + point.id + '" data-action="remove-point" data-id="' + point.id + '">Remove</a>' + '</td>' +
              '</tr>';

            html += row;
          }

          pointsContainer.querySelector('tbody').innerHTML = html;

          if (html.length) {
            pointsContainer.classList = '';
          }
        };

        // buttons actions
        document.querySelector('[data-action="zoom-in"]').addEventListener('click', function() {
          peaksInstance.zoom.zoomIn();
        });

        document.querySelector('[data-action="zoom-out"]').addEventListener('click', function() {
          peaksInstance.zoom.zoomOut();
        });

        document.querySelector('button[data-action="add-segment"]').addEventListener('click', function() {
          peaksInstance.segments.add({
            startTime: peaksInstance.player.getCurrentTime(),
            endTime: peaksInstance.player.getCurrentTime() + 10,
            labelText: "Test segment",
            editable: true
          });
        });

        document.querySelector('button[data-action="add-point"]').addEventListener('click', function() {
          peaksInstance.points.add({
            time: peaksInstance.player.getCurrentTime(),
            labelText: "Test point",
            editable: true
          });
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
          var action  = element.getAttribute('data-action');
          var id      = element.getAttribute('data-id');

          if (action === 'play-segment') {
            var segment = peaksInstance.segments.getSegment(id);
            peaksInstance.player.playSegment(segment);
          }
          else if (action === 'remove-point') {
            peaksInstance.points.removeById(id);
          }
          else if (action === 'remove-segment') {
            peaksInstance.segments.removeById(id);
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
      })(peaks);