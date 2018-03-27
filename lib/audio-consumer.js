var count = 1;

function startStream() {
	
	var face = new Face({ host: '163.22.21.46', port: '9696' });

	var startTime;
	var audioCtx = new window.AudioContext();
	var source = audioCtx.createBufferSource();

	function onData(interest, data) {
		var data = data.getContent().buf();
		var audioData = new Float32Array(data.buffer);
		
		var audioBuffer = audioCtx.createBuffer(1, 2048, 44100);
		startTime = audioCtx.currentTime;

		var nowBuffer = audioBuffer.getChannelData(0);
		for (var i = 0; i < audioBuffer.length; i++) {
			nowBuffer[i] = audioData[i];
		}

		count++;
		var playTime = startTime + (count * 0.04);
		playSound(audioBuffer, playTime);
		console.log(audioBuffer);
		console.log(count);
	}

	function playSound(buffer, playTime) {
		source.buffer = buffer;
		source.start(playTime);
		source.connect(audioCtx.destination);
	}

	function onTimeout(interest) {
		console.log(interest);
		console.log('Time out for interest ' + interest.getName());
	}

	var prefix = new Name("/ndn/edu/ncnu/stream/");


	setTimeout(function() {
		face.expressInterest(prefix, onData, onTimeout);
		startStream();
	}, 40)
}

startStream();
