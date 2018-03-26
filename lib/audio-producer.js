navigator.mediaDevices.getUserMedia({audio: true}).then(gotStream)
.catch(function(error) {
	console.log('Error getUserMedia :' + error);
});

function gotStream(stream) {
	var audioCtx = new window.AudioContext();

	var source = audioCtx.createMediaStreamSource(stream);

	var analyser = audioCtx.createScriptProcessor(1024, 1, 1);

	source.connect(analyser);
	
	var websocketFace = new WebSocketFace();
	analyser.onaudioprocess = function(event) {
		var inputData = event.inputBuffer.getChannelData(0);
		var u8InputData = new Uint8Array(inputData.buffer);
		var audioProducer = new AudioProducer(websocketFace,u8InputData);
		var prefix = new Name("/ndn/edu/ncnu/stream");
		
		websocketFace.face.registerPrefix(
			prefix,
			audioProducer.onInterest.bind(audioProducer),
			audioProducer.onRegisterFailed.bind(audioProducer)
		);
		console.log('Register');
		console.log(u8InputData);
	}

}
