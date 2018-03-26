var AudioProducer = function AudioProducer(websocketFace, mediaData) {
	this.keyChain = websocketFace.keyChain;
	this.certificateName = websocketFace.certificateName;
	this.face = websocketFace.face;
	this.mediaData = mediaData;
};

AudioProducer.prototype.onInterest = function(prefix, interest, face, interestFilterId, filter) {
	console.log('Register successfully');
	var data = new Data();
	
	if(this.mediaData == null) {
		this.mediaData = 'No media data';
	}
	
	data.setContent(this.mediaData);
	
	this.keyChain.sign(data, this.certificateName, function() {
		try {
			this.face.putData(data);
		} catch(error) {
			console.log('Error when sending data');
		}
	});
};

AudioProducer.prototype.onRegisterFailed = function(error) {
	console.log('Error when registing');
};

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
		var blobData = new Blob(u8InputData);
		var audioProducer = new AudioProducer(websocketFace,blobData);
		var prefix = new Name("/ndn/edu/NCNU/ndn-stream/");
		websocketFace.face.registerPrefix(
			prefix,
			audioProducer.onInterest.bind(audioProducer),
			audioProducer.onRegisterFailed.bind(audioProducer)
		);
	}
}
