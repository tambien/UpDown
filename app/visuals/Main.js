define(["visuals/Bass", "visuals/Voice", "visuals/Pictures", "visuals/Piano", 
	"visuals/Kick", "visuals/Snare", "visuals/Arp", "visuals/HighHat"], 
function(BassVisuals, VoiceVisuals, Pictures, PianoVisuals, 
	KickVisuals, SnareVisuals, ArpVisuals, HighHatVisuals){
	
	var bassVis = new BassVisuals(); 

	var voiceVis = new VoiceVisuals();

	var pianoVis = new PianoVisuals();

	var kickVis = new KickVisuals();

	var snareVis = new SnareVisuals();

	var arpVis = new ArpVisuals();

	var pics = new Pictures();

	var hhVis = new HighHatVisuals();
});