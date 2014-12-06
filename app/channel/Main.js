define(["channel/Bass", "channel/Piano", "channel/Voice", "channel/HighHat", "channel/Kick", "interface/GUI"], 
function(Bass, Piano, Voice, HH, Kick, GUI){

	var volumes = {
		Bass : -34,
		Piano : -18,
		Voice : 0,
		HH : -62,
		Kick : -12
	};

	Bass.output.setVolume(volumes.Bass);
	Piano.output.setVolume(volumes.Piano);
	Voice.output.setVolume(volumes.Voice);
	HH.output.setVolume(volumes.HH);
	Kick.output.setVolume(volumes.Kick);

	GUI.addSlider("Channels", "Bass Volume", volumes.Bass, -100, 0, function(val){
		Bass.output.setVolume(val);
	});

	GUI.addSlider("Channels", "Piano Volume", volumes.Piano, -100, 0, function(val){
		Piano.output.setVolume(val);
	});

	GUI.addSlider("Channels", "Voice Volume",volumes.Voice, -100, 0, function(val){
		Voice.output.setVolume(val);
	});

	GUI.addSlider("Channels", "HH Volume", volumes.HH, -100, 0, function(val){
		HH.output.setVolume(val);
	});

	GUI.addSlider("Channels", "Kick Volume", volumes.Kick, -100, 0, function(val){
		Kick.output.setVolume(val);
	});
	
});