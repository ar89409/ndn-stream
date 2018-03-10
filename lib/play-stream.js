var media = document.querySelector("#media");
var getStream = document.querySelector("#getStream");

var face = new Face( {host: "memoria.ndn.ucla.edu", port: "9696"} );
total_blobs = [];

function onData(interest,data) {
	
	// u8 = uint8array, ab = arraybuffer
	var u8 = data.getContent().buf();
	var ab = u8.buffer;
	var blob = new Blob([ab]);
	console.log(blob);
	total_blobs.push(blob);

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

		else if (count == 25) {
			ConcatenateBlobs(total_blobs, "audio/ogg", function(resultBlob) {
				console.log(resultBlob);
			});
	
			media.src = URL.createObjectURL(total_blobs);
		}
	}
	
	loopPlay(1);
	
}

