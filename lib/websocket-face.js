var WebSocketFace = function WebSocketFace() {
	
	// memoria.ndn.ucla.edu is a wshub for websocket forwarding
	this.face = new Face( {host: "memoria.ndn.ucla.edu", port: "9696"} );

	var identityStorage = new MemoryIdentityStorage();
	var privateKeyStorage = new MemoryPrivateKeyStorage();

	var identityManager = new IdentityManager(identityStorage, privateKeyStorage);
	var selfVerifyPolicyManager = new SelfVerifyPolicyManager(identityStorage);
	this.keyChain = new KeyChain(identityManager, selfVerifyPolicyManager);

	var keyName = new Name("/audioProducer/DSK-123");
	this.certificateName = keyName.getSubName(0, keyName.size() - 1)
		.append("KEY")
		.append(keyName.get(-1))
		.append("ID-CERT")
		.append("0");
	
	identityStorage.addKey(
		keyName, 
		KeyType.RSA, 
		new NDN_Blob(DEFAULT_RSA_PUBLIC_KEY_DER, false)
	);
	
	privateKeyStorage.setKeyPairForKeyName(
		keyName, 
		KeyType.RSA, 
		DEFAULT_RSA_PUBLIC_KEY_DER, 
		DEFAULT_RSA_PRIVATE_KEY_DER
	);

	this.face.setCommandSigningInfo(this.keyChain, this.certificateName);
};

exports.WebSocketFace = WebSocketFace;

WebSocketFace.prototype.face = function() {
	return this.face;
};

WebSocketFace.prototype.keyChain = function() {
	return this.keyChain;
};

WebSocketFace.prototype.certificateName = function() {
	return this.certificateName;
};
