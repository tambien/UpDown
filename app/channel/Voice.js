define(["Tone/instrument/MultiSampler", "controller/Mediator",
 "preset/Voice", "controller/Conductor", "Tone/core/Master", "effect/Main"], 
function(MultiSampler, Mediator, Preset, Conductor, Master){

	var audioFolder = "./audio/";

	var multiSamler = new MultiSampler({
		"some_down" : audioFolder+"down/some.mp3",
		"times_down" : audioFolder+"down/times.mp3",
		"i_down" : audioFolder+"down/i.mp3",
		"look_down" : audioFolder+"down/look.mp3",
		"down_down" : audioFolder+"down/down.mp3",
		"some_up" : audioFolder+"up/some.mp3",
		"times_up" : audioFolder+"up/times.mp3",
		"i_up" : audioFolder+"up/i.mp3",
		"look_up" : audioFolder+"up/look.mp3",
		"up_up" : audioFolder+"up/up.mp3",
	}, function(){
		console.log("loaded");
	});

	multiSamler.set({
		"filter" : {
			"type" : "lowpass",
			"rolloff" : -48,
		}
	});


	// SETUP //

	//set special loop points for the somes
	var sampleDuration = "32n";
	multiSamler.samples.some_down.player.setLoopPoints(0.804, "0.804+"+sampleDuration);
	multiSamler.samples.times_down.player.setLoopPoints(0.536, "0.536+"+sampleDuration);
	multiSamler.samples.i_down.player.setLoopPoints(0.188, "0.188+"+sampleDuration);
	multiSamler.samples.look_down.player.setLoopPoints(0.107, "0.107+"+sampleDuration);
	multiSamler.samples.down_down.player.setLoopPoints(1.179, "01.179+"+sampleDuration);
	//up
	multiSamler.samples.some_up.player.setLoopPoints(0.777, "0.777+"+sampleDuration);
	multiSamler.samples.times_up.player.setLoopPoints(0.375, "0.375+"+sampleDuration);
	multiSamler.samples.i_up.player.setLoopPoints(0.536, "0.536+"+sampleDuration);
	multiSamler.samples.look_up.player.setLoopPoints(0.268, "0.268+"+sampleDuration);
	multiSamler.samples.up_up.player.setLoopPoints(0.723, "0.723+"+sampleDuration);


	// CONECTIONS //

	multiSamler.toMaster();
	multiSamler.setVolume(0);
	multiSamler.send("reverb", 0.3);

	var hasChanged = false;
	var position = 0.5;
	Mediator.route("scroll", function(pos){
		position = pos;
		hasChanged = true;
	});

	
	return {
		triggerAttackRelease : function(name, duration, time){
			if (hasChanged){
				hasChanged = false;
				multiSamler.set(Preset.stepwise.get(position));
				multiSamler.set(Preset.smooth.get(position));
			}
			var noteDur = multiSamler.toSeconds(duration);
			multiSamler.triggerAttackRelease(name,  
				noteDur - multiSamler.toSeconds("16n"), 
				time);
			if (name === "some_down" || name === "some_up"){
				setTimeout(function(){
					Mediator.deferSend("voice", name, noteDur);
				}, 400);
			} else if (name === "down_down"){
				setTimeout(function(){
					Mediator.deferSend("voice", name, noteDur);
				}, 200);
			} else {
				Mediator.deferSend("voice", name, noteDur);
			}
		},
		output : multiSamler
	};
});