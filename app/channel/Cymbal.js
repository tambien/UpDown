define(["Tone/source/Noise", "Tone/core/Master", "controller/Mediator", "Tone/component/Envelope"],
function(Noise, Master, Mediator, Envelope){

	var noise = new Noise("white").toMaster();
	noise.start();

	var envelope = new Envelope(0.01, "2n", 0).connect(noise.volume);
	
	Mediator.route("B", function(time){
		// envelope.triggerAttack(time);
	});

	return {
		
	};
});