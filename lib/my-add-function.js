var AudioProducer = function AudioProducer(websocketFace, mediastream) {
	this.keyChain = websocketFace.keyChain;
	this.certificateName = websocketFace.certificateName;
	this.face = websocketFace.face;
	this.mediastream = mediastream;
};

exports.AudioProducer = AudioProducer;

// When receive Interest and response Data
AudioProducer.prototype.onInterest = function (prefix, interest, face, interestFilterId, filter) {
	console.log("Register successfully");
	var data = new Data(interest.getName());
	if (this.mediastream == null)
		this.mediastream = "MediaStream = null";
	data.setContent(this.mediastream);		
	
	this.keyChain.sign(data, this.certificateName, function() {
			
		try {			
			face.putData(data);
		} catch (error) {
			console.log(error);
		}
		
	});
	
};
		
// When register prefix error
AudioProducer.prototype.onRegisterFailed = function(error) {
	console.log("Register failed");
};
