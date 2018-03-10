// Producing 25 sequential blobs

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
		
		var startRecord = function() {
			recorder.startRecording();
		};

		var stopRecord = function(count) {
			recorder.stopRecording(function() {
			
				var blob = this.getBlob();
				var fr = new FileReader();
				
				fr.onload = function() {
					
					var ab =  this.result;
					var u8 = new Uint8Arrat(ab);
					// Setting the WebSocket Channel to NDN				
					var websocketFace = new WebSocketFace();
					var audioProducer = new AudioProducer(websocketFace, u8);
					var prefix = new Name("/ndn/edu/NCNU/audio-stream/" + count);
					console.log(websocketFace.face);
					websocketFace.face.registerPrefix(
						prefix, 
						audioProducer.onInterest.bind(audioProducer),
						audioProducer.onRegisterFailed.bind(audioProducer)
					);

					var n_ab = u8.buffer;
					var n_blob = new Blob([n_ab]);
					console.log(n_ab);
					console.log(n_blob);
				}
				console.log(blob);
				fr.readAsArrayBuffer(blob);
			}); 
		};
	
		function loopRecord (count) {
			if (count < 25) {
				startRecord();
				setTimeout(function() {
					stopRecord(count);
					count++;
					loopRecord(count);
				}, 500);
			}
		}

		loopRecord(1);
	}

	stop.onclick = function() {
	
		start.disabled = false;
		stop.disabled = true;
		
	}

}

function handleError(error) {
	
	console.log("getUserMedia is error: " + error);

}
