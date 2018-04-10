var btnStart = document.querySelector('Button#btnStart');
var btnConnect = document.querySelector('Button#btnConnect');

var face = null;
btnConnect.onclick = function() {
	face = new Face( {host: '163.22.21.46', port: '9696'} );
};

btnStart.onclick = AudioConsumer;

function AudioConsumer() {
	function onData(interest, data) {	
		console.log(data.getContent().buf());	

		/*
		var audioCtx = new window.AudioContext();
		var data = data.getContent().buf();
		var audioData = new Float32Array(data.buffer);
		
		var source = audioCtx.createBufferSource();

		var audioBuffer = audioCtx.createBuffer(1, 2048, 44100);
		
		var nowBuffer = audioBuffer.getChannelData(0);
		for (var i = 0; i < audioBuffer.length; i++) {
			nowBuffer[i] = audioData[i];
		}
		
		source.buffer = audioBuffer;
		
		source.connect(audioCtx.destination);
		source.start(); 
		*/
	}

	function onTimeout(interest) {
		console.log('Timeout');
	}
		
	var prefix = new Name('/ndn/edu/ncnu/stream');
	
	function playLoop() {
		setTimeout(function() {	
			face.expressInterest(prefix, onData, onTimeout);
			playLoop();
		}, 1000/(44100/2048));
	}

	playLoop();
}

// Testing End */
