define(["Tone/effect/JCReverb", "Tone/core/Bus"], function(JCReverb){

	var reverb = new JCReverb(0.6);
	reverb.receive("reverb");
	reverb.toMaster();

	window.reverb = reverb;
	
});