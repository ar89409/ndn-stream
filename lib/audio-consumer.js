var face = new Face({ host: '163.22.21.46', port: '9696' });

function onData(interest, data) {
	var data = data.getContent().buf();
	console.log(data);
}

function onTimeout(interest) {
	console.log(interest);
	console.log('Time out for interest ' + interest.getName());
}

var prefix = new Name("/ndn/edu/ncnu/stream");
face.expressInterest(prefix, onData, onTimeout);

