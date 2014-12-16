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

	Bass.output.setVolume(volumes.Bass);
	Piano.output.setVolume(volumes.Piano);
	Voice.output.setVolume(volumes.Voice);
	HH.output.setVolume(volumes.HH);
	Kick.output.setVolume(volumes.Kick);
	Snare.output.setVolume(volumes.Snare);

	var folderName = "Levels (db)";

	GUI.addVolumeSlider(folderName, "Bass Volume", Bass.output);

	GUI.addVolumeSlider(folderName, "Piano Volume", Piano.output);

	GUI.addVolumeSlider(folderName, "Voice Volume", Voice.output);

	GUI.addVolumeSlider(folderName, "HH Volume", HH.output);

	GUI.addVolumeSlider(folderName, "Kick Volume", Kick.output);

	GUI.addVolumeSlider(folderName, "Snare Volume", Snare.output);

	// GUI.addButton(folderName)
	
});