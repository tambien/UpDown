define(["visuals/Bass", "visuals/Voice", "visuals/Pictures", "visuals/Piano", 
	"visuals/Kick", "visuals/Snare", "visuals/Arp", "visuals/HighHat", "util/Config", "interface/Scroll"], 
function(BassVisuals, VoiceVisuals, Pictures, PianoVisuals, 
	KickVisuals, SnareVisuals, ArpVisuals, HighHatVisuals, Config, Scroll){

	if (!Config.MOBILE){
		var bassVis = new BassVisuals(); 

		var voiceVis = new VoiceVisuals();

		var pianoVis = new PianoVisuals();

		var kickVis = new KickVisuals();

		var snareVis = new SnareVisuals();

		var arpVis = new ArpVisuals();

		var hhVis = new HighHatVisuals();
	}

	var pics = new Pictures();

});