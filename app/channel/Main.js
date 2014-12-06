define(["channel/Bass", "channel/Piano", "channel/Voice", "channel/HighHat", "channel/Kick", "interface/GUI"], 
function(Bass, Piano, Voice, HH, Kick, GUI){

	var volumes = {
		Bass : -34,
		Piano : -18,
		Voice : -3,
		HH : -15,
		Kick : -12
	};

	Bass.output.setVolume(volumes.Bass);
	Piano.output.setVolume(volumes.Piano);
	Voice.output.setVolume(volumes.Voice);
	HH.output.setVolume(volumes.HH);
	Kick.output.setVolume(volumes.Kick);

	var folderName = "Levels (db)";

	GUI.addVolumeSlider(folderName, "Bass Volume", Bass.output);

	GUI.addVolumeSlider(folderName, "Piano Volume", Piano.output);

	GUI.addVolumeSlider(folderName, "Voice Volume", Voice.output);

	GUI.addVolumeSlider(folderName, "HH Volume", HH.output);

	GUI.addVolumeSlider(folderName, "Kick Volume", Kick.output);

	// GUI.addButton(folderName)
	
});