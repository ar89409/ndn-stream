var face = new Face({ host: '163.22.21.46', port: '9696' });

function onData(interest, data) {
	var data = data.getContent().buf();
	console.log(data);
}

function onTimeout(interest) {
	console.log('Time out for interest' + interest.getName());
}

var name = new Name('/ndn/edu/NCNU/ndn-stream');
face.expressInterest(name, onData, onTimeout);

