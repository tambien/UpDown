define(["channel/Bass", "channel/Piano", "channel/Voice", "channel/HighHat", "channel/Kick"], 
	function(Bass, Piano, Voice, HH, Kick){

	Bass.output.setVolume(-34);
	Piano.output.setVolume(-18);
	Voice.output.setVolume(0);
	HH.output.setVolume(-70);
	Kick.output.setVolume(-12);
	
});