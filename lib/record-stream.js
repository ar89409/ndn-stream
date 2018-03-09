'use strict';

// Getting the elements
var start = document.querySelector("#start");
var stop = document.querySelector("#stop");
var media = document.querySelector("#media");

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
			var fr = new FileReader();
			fr.onload = function() {
				var ab =  this.result;
				var u8 = new Uint8Array(ab);
				console.log(ab);
				console.log(u8);
				// Setting the WebSocket Channel to NDN				
				var websocketFace = new WebSocketFace();
				var audioProducer = new AudioProducer(websocketFace, u8);
				var prefix = new Name("/ndn/edu/NCNU/test7");
				console.log(websocketFace.face);
				websocketFace.face.registerPrefix(
					prefix, 
					audioProducer.onInterest.bind(audioProducer),
					audioProducer.onRegisterFailed.bind(audioProducer)
				);
			}

			fr.readAsArrayBuffer(blob);

		});
	
	}

}

function handleError(error) {
	
	console.log("getUserMedia is error: " + error);

}
