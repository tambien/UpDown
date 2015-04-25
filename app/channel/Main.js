define(["channel/Bass", "channel/Piano", "channel/Voice", "channel/HighHat", "channel/Kick", 
	"interface/GUI", "channel/Snare", "channel/Arp", "util/Config"], 
function(Bass, Piano, Voice, HH, Kick, GUI, Snare, Arp, Config){

	var volumes = {
		Bass : -8,
		Piano : -30,
		Voice : 2,
		HH : -24,
		Kick : -14,
		Snare : -10,
		Arp : -36
	};

	Bass.volume.value = volumes.Bass;
	// Bass.volume.value = -Infinity;

	Piano.volume.value = volumes.Piano;
	// Piano.volume.value = -Infinity;

	Voice.volume.value = volumes.Voice;
	// Voice.volume.value = -Infinity;

	HH.volume.value = volumes.HH;
	// HH.volume.value = -Infinity;
	
	Kick.volume.value = volumes.Kick;
	// Kick.volume.value = -Infinity;

	Snare.volume.value = volumes.Snare;
	// Snare.volume.value = -Infinity;

	if (!Config.MOBILE){
		Arp.volume.value = volumes.Arp;

		if (Config.GUI){
			var folder = GUI.getFolder("Levels (db)");
			GUI.addVolumeSlider(folder, "Bass Volume", Bass.volume);
			GUI.addVolumeSlider(folder, "Piano Volume", Piano.volume);
			GUI.addVolumeSlider(folder, "Voice Volume", Voice.volume);
			GUI.addVolumeSlider(folder, "HH Volume", HH.volume);
			GUI.addVolumeSlider(folder, "Kick Volume", Kick.volume);
			GUI.addVolumeSlider(folder, "Snare Volume", Snare.volume);	
			GUI.addVolumeSlider(folder, "Arp Volume", Arp.volume, -80, -30);	
		}
	}

});