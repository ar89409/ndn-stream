var btnConnect = document.querySelector('Button#btnConnect');
var btnStart = document.querySelector('Button#btnStart');

navigator.mediaDevices.getUserMedia({audio: true}).then(gotStream)
.catch(function(error) {
	console.log('Error getUserMedia :' + error);
});

var websocketFace;
var prefix = new Name("/ndn/edu/ncnu/stream");

btnConnect.onclick = function() {
	websocketFace = new WebSocketFace();
}

function gotStream(stream) {
	btnStart.onclick = function() {
		var audioCtx = new window.AudioContext();
		var source = audioCtx.createMediaStreamSource(stream);

		var analyser = audioCtx.createScriptProcessor(4096, 1, 1);

		source.connect(analyser);
		
		analyser.onaudioprocess = function(event) {
			var inputData = event.inputBuffer.getChannelData(0);
			u8InputData = new Uint8Array(inputData.buffer);
			
			var audioProducer = new AudioProducer(websocketFace, u8InputData);

			websocketFace.face.registerPrefix(
				prefix,
				audioProducer.onInterest.bind(audioProducer),
				audioProducer.onRegisterFailed.bind(audioProducer)
			);
		
			console.log(inputData);

			/* output Channel
			var outputData = event.outputBuffer.getChannelData(0);
			for(var i = 0; i < inputData.length; i++) {
				outputData[i] = inputData[i];
			}

			analyser.connect(audioCtx.destination);
			End */
		}
	}
}
