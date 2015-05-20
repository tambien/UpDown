define(["Tone/core/Bus", "interface/GUI", "Tone/effect/PingPongDelay", "Tone/core/Transport", 
	"controller/Mediator", "util/Config"], 
	function(Bus, GUI, PingPongDelay, Transport, Mediator, Config){

/*	if (!Config.MOBILE){
		var delayTime = "16n";
		var pingPong = new PingPongDelay(delayTime, 0.2).toMaster();
		pingPong.receive("delay");

		Mediator.route("scroll", function(position){
			pingPong.delayTime.rampTo("16n", Config.SLOW_UPDATE);
		});

		if (Config.GUI){
			var effectFolder = GUI.getFolder("Effect");
			GUI.addTone2(effectFolder, "Delay", pingPong, ["feedback"]);
		}
	}*/
});