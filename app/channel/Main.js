define(["channel/Bass", "channel/Piano", "channel/Voice", "channel/HighHat", "channel/Kick", 
	"interface/GUI", "channel/Snare", "channel/Arp", "util/Config"], 
function(Bass, Piano, Voice, HH, Kick, GUI, Snare, Arp, Config){

	var volumes = {
		Bass : -10,
		Piano : -32,
		Voice : -2,
		HH : -23,
		Kick : -16,
		Snare : -8,
		Arp : -52
	};

	Bass.volume.value = volumes.Bass;
	Piano.volume.value = volumes.Piano;
	Voice.volume.value = volumes.Voice;
	HH.volume.value = volumes.HH;
	Kick.volume.value = volumes.Kick;
	Snare.volume.value = volumes.Snare;

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