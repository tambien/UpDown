define(["visuals/Bass", "visuals/Voice", "visuals/Pictures", "visuals/Piano", 
	"visuals/Kick", "visuals/Snare", "visuals/Arp", "visuals/HighHat", "util/Config", 
	"interface/Scroll", "visuals/Frame", "visuals/BackgroundImages", "jquery", 
	"controller/Mediator", "controller/Conductor", "interface/Window"], 
function(BassVisuals, VoiceVisuals, Pictures, PianoVisuals, 
	KickVisuals, SnareVisuals, ArpVisuals, HighHatVisuals, Config, 
	Scroll, FrameVisuals, BackgroundImages, $, Mediator, Conductor, Window){

	var bassVis = new BassVisuals(); 

	var voiceVis = new VoiceVisuals();

	var pianoVis = new PianoVisuals();

	var arpVis = new ArpVisuals();

	var hhVis = new HighHatVisuals();
	
	if (!Config.MOBILE){
		
		var frameVis = new FrameVisuals();

		var backgroundImages = new BackgroundImages();

		var kickVis = new KickVisuals();

		var snareVis = new SnareVisuals();
	}
	
	var pics = new Pictures();

	/*var coverAll = $("<div>").attr("id", "CoverAll").appendTo(Window.container);

	Mediator.route("scroll", function(){
		if (Conductor.getMovement() === 2) {
			var endTransition = Conductor.getEndTransitionProgress();
			if (endTransition > 0){
				var opacity = 1 - Math.pow(1 - endTransition, 1.5);
				coverAll.css("opacity", opacity);
			} 
		}
	});*/

});