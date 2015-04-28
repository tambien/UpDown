define(["visuals/Bass", "visuals/Voice", "visuals/Pictures", "visuals/Piano", 
	"visuals/Kick", "visuals/Snare", "visuals/Arp", "visuals/HighHat", "util/Config", 
	"interface/Scroll", "visuals/Frame", "visuals/BackgroundImages"], 
function(BassVisuals, VoiceVisuals, Pictures, PianoVisuals, 
	KickVisuals, SnareVisuals, ArpVisuals, HighHatVisuals, Config, 
	Scroll, FrameVisuals, BackgroundImages){

	var bassVis = new BassVisuals(); 

	var voiceVis = new VoiceVisuals();

	var pianoVis = new PianoVisuals();

	var arpVis = new ArpVisuals();

	var hhVis = new HighHatVisuals();
	
	var pics = new Pictures();

	if (!Config.MOBILE){
		
		var frameVis = new FrameVisuals();

		var backgroundImages = new BackgroundImages();

		var kickVis = new KickVisuals();

		var snareVis = new SnareVisuals();
	}
});