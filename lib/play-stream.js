var media = document.querySelector("#media");
var getStream = document.querySelector("#getStream");

var face = new Face( {host: "10.21.21.222", port: "9696"} );

function onData(interest,data) {
	
	// u8 = uint8array, ab = arraybuffer
	var u8 = data.getContent().buf();
	var ab = u8.buffer;
	var blob = new Blob([ab], {type: "audio/ogg"});
	console.log(blob);
	
	media.src = URL.createObjectURL(blob);
}

function onTimeout(interest) {
	
	console.log("Time out for interest " + interest.getName());

}

getStream.onclick = function() {
	function loopPlay(count) {
		if (count < 25) {
			setTimeout(function() {
				var name = new Name("/ndn/edu/NCNU/audio-stream/" + count);
				face.expressInterest(name, onData, onTimeout);
				count++;
				loopPlay(count);
			}, 500);
		}
	}
	
	loopPlay(1);
}

