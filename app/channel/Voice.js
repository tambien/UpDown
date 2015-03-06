define(["Tone/instrument/Sampler", "controller/Mediator",
 "preset/Voice", "controller/Conductor", "Tone/core/Master", 
 "effect/Main", "interface/GUI", "Tone/instrument/PolySynth", "Tone/signal/Signal"], 
function(Sampler, Mediator, Preset, Conductor, Master, Effects, GUI, PolySynth, Signal){

	var audioFolder = "./audio/";

	var multiSamler = new PolySynth(3, Sampler, {
		"A" : {
			"down" : {
				"some" : audioFolder+"down/some.mp3",
				"times" : audioFolder+"down/times.mp3",
				"i" : audioFolder+"down/i.mp3",
				"look" : audioFolder+"down/look.mp3",
				"down" : audioFolder+"down/down.mp3",
			},
			"up" : {
				"some" : audioFolder+"up/some.mp3",
				"times" : audioFolder+"up/times.mp3",
				"i" : audioFolder+"up/i.mp3",
				"look" : audioFolder+"up/look.mp3",
				"up" : audioFolder+"up/up.mp3",
			}
		},
	}, {
		"filter" : {
			"type" : "lowpass",
			"rolloff" : -48,
		},
		"filterEnvelope" : {
			"exponent" : 2
		}
	});

	// SETUP //

	//set special loop points for the somes
	

	var loopPoints = {
		"A.down.some" : 0.804,
		"A.down.times" : 0.536,
		"A.down.i" : 0.188,
		"A.down.look" : 0.107,
		"A.down.down" : 1.179,
		"A.up.some" : 0.777,
		"A.up.times" : 0.375,
		"A.up.i" : 0.536,
		"A.up.look" : 0.268,
		"A.up.up" : 0.723,
	};
	// multiSamler.samples.some_down.player.setLoopPoints(0.804, "0.804+"+sampleDuration);
	// multiSamler.samples.times_down.player.setLoopPoints(0.536, "0.536+"+sampleDuration);
	// multiSamler.samples.i_down.player.setLoopPoints(0.188, "0.188+"+sampleDuration);
	// multiSamler.samples.look_down.player.setLoopPoints(0.107, "0.107+"+sampleDuration);
	// multiSamler.samples.down_down.player.setLoopPoints(1.179, "01.179+"+sampleDuration);
	// //up
	// multiSamler.samples.some_up.player.setLoopPoints(0.777, "0.777+"+sampleDuration);
	// multiSamler.samples.times_up.player.setLoopPoints(0.375, "0.375+"+sampleDuration);
	// multiSamler.samples.i_up.player.setLoopPoints(0.536, "0.536+"+sampleDuration);
	// multiSamler.samples.look_up.player.setLoopPoints(0.268, "0.268+"+sampleDuration);
	// multiSamler.samples.up_up.player.setLoopPoints(0.723, "0.723+"+sampleDuration);

	function setLoopPoints(time){
		var sampleDuration = "+32n";
		multiSamler.set({
			"player" : {
				"loopStart" : time,
				"loopEnd" : time + sampleDuration
			}
		});
	}


	// CONECTIONS //

	multiSamler.toMaster();

	// EFFECTS //

	var effectLevels = {
		"reverb" : -10,
		"delay" : -10
	};

	var reverbAmount = multiSamler.send("reverb");
	var reverbControl = new Signal(reverbAmount.gain, Signal.Units.Decibels);
	reverbControl.value = effectLevels.reverb; 

	var delayAmount = multiSamler.send("delay");
	var delayControl = new Signal(delayAmount.gain, Signal.Units.Decibels);
	delayControl.value = effectLevels.delay; 

	//GUI
	if (USE_GUI){
		var voiceFolder = GUI.getFolder("Voice");
		voiceFolder.add(reverbControl, "value", -100, 1).name("reverb");
		voiceFolder.add(delayControl, "value", -100, 1).name("delay");
	}
	
	return {
		triggerAttackRelease : function(name, duration, time){
			var section = "A.";
			if (Conductor.hasVoice()){
				Preset.update(function(pre){
					multiSamler.set(pre);
				});
				var noteDur = multiSamler.toSeconds(duration);
				//set the loop points
				setLoopPoints(loopPoints[section+name]);

				multiSamler.triggerAttackRelease(section+name,  
					noteDur - multiSamler.toSeconds("16n"), 
					time);
				if (name === "down.some" || name === "up.some"){
					setTimeout(function(){
						Mediator.deferSend("voice", name, noteDur);
					}, 400);
				} else if (name === "down.down"){
					setTimeout(function(){
						Mediator.deferSend("voice", name, noteDur);
					}, 200);
				} else {
					Mediator.deferSend("voice", name, noteDur);
				}
			}
		},
		volume : multiSamler.volume
	};
});