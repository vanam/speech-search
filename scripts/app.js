// Based on https://developers.google.com/web/fundamentals/codelabs/your-first-pwapp/
(function() {
  'use strict';

  var app = {
    isLoading: true,
    spinner: document.querySelector('.loader'),
    cardTemplate: document.querySelector('.cardTemplate'),
    container: document.querySelector('.main'),
    recordDialog: document.querySelector('#dialRecord'),
    uploadDialog: document.querySelector('#dialUpload'),
    mediaRecorder: null,
    chunks: []
  };


  /*****************************************************************************
   *
   * Event listeners for UI elements
   *
   ****************************************************************************/

   document.getElementById('butRecord').addEventListener('click', function() {
     /*****************************************************************************
      *
      * Check browser capabilities
      *
      ****************************************************************************/
     // https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API/Using_the_MediaStream_Recording_API
     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log('getUserMedia supported.');
        navigator.mediaDevices.getUserMedia (
           // constraints - only audio needed for this app
           {
              audio: true
           })

           // Success callback
           .then(function(stream) {
               console.log('We can record audio now :)');
               app.chunks = [];

               app.mediaRecorder = new MediaRecorder(stream);
               app.mediaRecorder.ondataavailable = function(e) {
                 console.log("Pushing chunks of data");
                 app.chunks.push(e.data);
               };

               // Open/show the record dialog
               app.toggleRecordDialog(true);
           })

           // Error callback
           .catch(function(err) {
              console.log('The following gUM error occured: ' + err);
           }
        );
     } else {
        console.log('getUserMedia not supported on your browser!');
     }


   });

   document.getElementById('butRecordCancel').addEventListener('click', function() {
     // Close the record dialog
     app.toggleRecordDialog(false);
     if (app.mediaRecorder.state !== "inactive") {
       app.mediaRecorder.stop();
     }
   });

   document.getElementById('butRecordStart').addEventListener('click', function() {
     if (app.mediaRecorder !== null) {
       app.mediaRecorder.start();
       console.log(app.mediaRecorder.state);
       console.log("recorder started");

       document.getElementById('butRecordStart').setAttribute('hidden', true);
       document.getElementById('butRecordPause').removeAttribute('hidden');
       document.getElementById('butRecordStop').removeAttribute('hidden');
     }
   });

   document.getElementById('butRecordPause').addEventListener('click', function() {
     if (app.mediaRecorder !== null) {
       app.mediaRecorder.pause();
       console.log(app.mediaRecorder.state);
       console.log("recorder paused");

       document.getElementById('butRecordPause').setAttribute('hidden', true);
       document.getElementById('butRecordResume').removeAttribute('hidden');
     }
   });

    document.getElementById('butRecordResume').addEventListener('click', function() {
      if (app.mediaRecorder !== null) {
        app.mediaRecorder.resume();
        console.log(app.mediaRecorder.state);
        console.log("recorder resumed");

        document.getElementById('butRecordResume').setAttribute('hidden', true);
        document.getElementById('butRecordPause').removeAttribute('hidden');
      }
    });

   document.getElementById('butRecordStop').addEventListener('click', function() {
     if (app.mediaRecorder !== null) {
       if (app.mediaRecorder.state !== "inactive") {
         app.mediaRecorder.stop();
       }
       console.log(app.mediaRecorder.state);
       console.log("recorder stopped");

       document.getElementById('butRecordPause').setAttribute('hidden', true);
       document.getElementById('butRecordStop').setAttribute('hidden', true);
       document.getElementById('butRecordStart').removeAttribute('hidden');
       document.getElementById('butRecordSubmit').removeAttribute('hidden');
     }
   });

   document.getElementById('butRecordSubmit').addEventListener('click', function() {
     if (app.chunks.length == 0) {
       console.log("Nothing was recorded");
     } else {
       var blob = new Blob(app.chunks, { 'type' : 'audio/ogg; codecs=opus' });
       app.chunks = [];
       var audioURL = window.URL.createObjectURL(blob);
       console.log(blob);
       console.log(audioURL);

       document.getElementById('recordingControls').setAttribute('hidden', true);
       var audio = document.getElementById('recorded');
       audio.removeAttribute('hidden');
       audio.src = audioURL;

       // Tip: Use Indexed DB for file storage
       // https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
       // https://github.com/localForage/localForage - library
     }
   });


   document.getElementById('butUpload').addEventListener('click', function() {
    // Open/show the upload dialog
    app.toggleUploadDialog(true);
  });


  document.getElementById('butUploadSubmit').addEventListener('click', function() {
    var files = document.getElementById('inpUpload').files;
    console.log(files);
    if (files.length > 0) {
      var file = files[0];
      console.log("Validate and process audio file");
      console.log(file);
      // Tip: Use Indexed DB for file storage
      // https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
      // https://github.com/localForage/localForage - library

      // Close the upload dialog
      app.toggleUploadDialog(false);
    }
  });

  document.getElementById('butUploadCancel').addEventListener('click', function() {
    // Close the upload dialog
    app.toggleUploadDialog(false);
    document.getElementById('recordingControls').removeAttribute('hidden');
    document.getElementById('recorded').setAttribute('hidden', true);
  });

  /*****************************************************************************
   *
   * Methods to update/refresh the UI
   *
   ****************************************************************************/

  // Toggles the visibility of the record dialog.
  app.toggleRecordDialog = function(visible) {
    if (visible) {
      app.recordDialog.classList.add('dialog-container--visible');
    } else {
      app.recordDialog.classList.remove('dialog-container--visible');
    }
  };

  // Toggles the visibility of the upload dialog.
  app.toggleUploadDialog = function(visible) {
    if (visible) {
      app.uploadDialog.classList.add('dialog-container--visible');
    } else {
      app.uploadDialog.classList.remove('dialog-container--visible');
    }
  };

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Turn of spinner after loading is done
  setTimeout(function(){ // Add 2 second delay
    if (app.isLoading) {
      app.spinner.setAttribute('hidden', true);
      app.container.removeAttribute('hidden');
      app.isLoading = false;
    }
  }, 100);

  // Add service worker code
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
  }
})();
