// Test for ConcatenateBlobs

'use strict';

// Getting the elements
var start = document.querySelector("#start");
var stop = document.querySelector("#stop");
var media = document.querySelector("#media");
var allBlobs = [];

// Setting the default
stop.disabled = true;


var constraints = {
	video: false,
	audio: true
};

// Getting the media permission
navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);

function handleSuccess(stream) {

	var recorder = new RecordRTC(stream, {
		type: 'audio',
		recorderType: MediaStreamRecorder
	});

	start.onclick = function() {
	
		start.disabled = true;
		stop.disabled = false;

		recorder.startRecording();
	
	}

	stop.onclick = function() {
	
		start.disabled = false;
		stop.disabled = true;
		
		recorder.stopRecording(function() {
			var blob = this.getBlob();
			
			allBlobs.push(blob);
			console.log(allBlobs);		
			ConcatenateBlobs(allBlobs, 'audio/ogg', function(resultBlobs) {
				console.log(resultBlobs);
				media.src = URL.createObjectURL(resultBlobs);
				media.play();
			});

		});
	
	}

}

function handleError(error) {
	
	console.log("getUserMedia is error: " + error);

}
