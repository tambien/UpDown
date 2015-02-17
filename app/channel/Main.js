define(["channel/Bass", "channel/Piano", "channel/Voice", "channel/HighHat", "channel/Kick", 
	"interface/GUI", "channel/Snare"], 
function(Bass, Piano, Voice, HH, Kick, GUI, Snare){

	var volumes = {
		Bass : -11.6,
		Piano : -26,
		Voice : -8,
		HH : -21,
		Kick : -15,
		Snare : -5,
	};

	Bass.volume.value = volumes.Bass;
	Piano.volume.value = volumes.Piano;
	Voice.volume.value = volumes.Voice;
	HH.volume.value = volumes.HH;
	Kick.volume.value = volumes.Kick;
	Snare.volume.value = volumes.Snare;

	if (USE_GUI){
		var folder = GUI.getFolder("Levels (db)");
		GUI.addVolumeSlider(folder, "Bass Volume", Bass.volume);
		GUI.addVolumeSlider(folder, "Piano Volume", Piano.volume);
		GUI.addVolumeSlider(folder, "Voice Volume", Voice.volume);
		GUI.addVolumeSlider(folder, "HH Volume", HH.volume);
		GUI.addVolumeSlider(folder, "Kick Volume", Kick.volume);
		GUI.addVolumeSlider(folder, "Snare Volume", Snare.volume);	
	}
});