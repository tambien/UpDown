define(["Tone/instrument/Sampler", "controller/Mediator",
 "preset/Voice", "controller/Conductor", "Tone/core/Master", 
 "effect/Main", "interface/GUI", "Tone/instrument/PolySynth", 
 "Tone/signal/Signal", "Tone/component/Volume", "util/Config", 
 "Tone/core/Transport", "TERP", "preset/VoiceB"], 
function(Sampler, Mediator, Preset, Conductor, Master, Effects, 
	GUI, PolySynth, Signal, Volume, Config, Transport, TERP, PresetB){

	var audioFolder = "./audio/";

	var volume = new Volume().connect(Master);

	var samplerA = new Sampler({
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
		}
	}, {
		"filter" : {
			"type" : "lowpass",
			"rolloff" : -48,
		},
		"filterEnvelope" : {
			"exponent" : 2
		}
	}).connect(volume);

	var samplerB = new Sampler({
		"B" : {
			"down" : {
				"some" : audioFolder+"B/G/some.mp3",
				"times" : audioFolder+"B/G/times.mp3",
				"i" : audioFolder+"B/G/i.mp3",
				"look" : audioFolder+"B/G/look.mp3",
				"down" : audioFolder+"B/G/down.mp3",
				"up" : audioFolder+"B/G/up.mp3",
			},
			"up" : {
				"some" : audioFolder+"B/F/some.mp3",
				"times" : audioFolder+"B/F/times.mp3",
				"i" : audioFolder+"B/F/i.mp3",
				"look" : audioFolder+"B/F/look.mp3",
				"up" : audioFolder+"B/F/up.mp3",
				"down" : audioFolder+"B/F/down.mp3",
			}
		},
		"C" : {
			"down" : {
				"some" : audioFolder+"B/F/some.mp3",
				"times" : audioFolder+"B/F/times.mp3",
				"i" : audioFolder+"B/F/i.mp3",
				"look" : audioFolder+"B/F/look.mp3",
				"down" : audioFolder+"B/F/down.mp3",
			},
			"up" : {
				"some" : audioFolder+"B/G/some.mp3",
				"times" : audioFolder+"B/G/times.mp3",
				"i" : audioFolder+"B/G/i.mp3",
				"look" : audioFolder+"B/G/look.mp3",
				"up" : audioFolder+"B/G/up.mp3",
			},
		},
	}, {
		"filter" : {
			"type" : "lowpass",
			"rolloff" : -12,
		},
		"filterEnvelope" : {
			"exponent" : 2
		}
	}).connect(volume);

	/*//repitch the sampler for the C section
	Mediator.route("replay", function(){
		samplerB.pitch = 0;
		samplerB.volume.value = -5;
	});*/

	// window.VoiceBVolume = samplerB.volume;

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
		//B
		"B.down.some" : 0.912,
		"B.down.times" : 0.429,
		"B.down.i" : 0.321,
		"B.down.look" : 0.080,
		"B.down.down" : 0.985,
		"B.up.some" : 0.612,
		"B.up.times" : 0.549,
		"B.up.i" : 0.429,
		"B.up.look" : 0.020,
		"B.up.up" : 0.670,
		//C
		"C.up.some" : 0.912,
		"C.up.times" : 0.429,
		"C.up.i" : 0.321,
		"C.up.look" : 0.080,
		"C.up.up" : 0.763,
		"C.down.some" : 0.612,
		"C.down.times" : 0.549,
		"C.down.i" : 0.429,
		"C.down.look" : 0.020,
		"C.down.down" : 1.365,
	};

	function setLoopPoints(sampler, time){
		var sampleDuration = "+32n";
		var startTime = time;
		var endTime = time + sampleDuration;
		if (Conductor.getMovement() === 1){
			/*startTime = sampler.player.buffer.duration;
			console.log(startTime);
			endTime = startTime + sampleDuration;
			// sampler.player.offset = startTime;
			sampler.player.loop = true;*/
		} else {
			// sampler.player.offset = 0;
		}
		sampler.player.set({
			"loopStart" : startTime,
			"loopEnd" : endTime
		});
	}


	// EFFECTS //

	var effectLevels = {
		"A" : {
			"reverb" : 0,
			"delay" : -7,
		},
		"B" : {
			"reverb" : 4,
			"delay" : 0,
		}
	};

	var reverbAmount = volume.send("reverb", effectLevels.A.reverb);
	var delayAmount = volume.send("delay", effectLevels.A.delay);

	//GUI
	if (Config.GUI){
		var reverbControl = new Signal(reverbAmount.gain, Signal.Units.Decibels);
		reverbControl.value = effectLevels.A.reverb;
		var delayControl = new Signal(delayAmount.gain, Signal.Units.Decibels);
		delayControl.value = effectLevels.A.delay;
		var voiceFolder = GUI.getFolder("Voice");
		voiceFolder.add(reverbControl, "value", -100, 6).name("reverb");
		voiceFolder.add(delayControl, "value", -100, 6).name("delay");
		voiceFolder.add(samplerB.volume, "value", -100, 10).name("samplerB");
		// voiceFolder.addTone2(filter, "value", -100, 1).name("reverb");
	}


	Mediator.route("B", function(){
		samplerB.volume.value = 4;
		samplerB.pitch = 0;
		reverbAmount.gain.value = samplerB.dbToGain(effectLevels.B.reverb);
		delayAmount.gain.value = samplerB.dbToGain(effectLevels.B.delay);
		samplerB.filter.type = "bandpass";
	});

	//repitch the sampler for the C section
	Mediator.route("C", function(){
		samplerB.pitch = 12;
		samplerB.volume.value = -11;
		samplerB.filter.type = "lowpass";
		reverbAmount.gain.value = samplerB.dbToGain(effectLevels.A.reverb);
		delayAmount.gain.value = samplerB.dbToGain(effectLevels.A.delay);
	});

	var interval = -1;

	function shuffleLoopPosition(duration, startPosition){
		var progress = Conductor.getBProgress();
		startPosition = Math.max(startPosition + TERP.scale(Math.random(), -0.1, 0.1), 0);
		var grainSize = TERP.map(progress, 0.1, 0.03, 0.5);
		if (isFinite(grainSize) && isFinite(startPosition)){
			samplerB.player.set({
				"loopStart" : startPosition,
				"loopEnd" : startPosition + grainSize,
			});
		}
	}

	var vocalRound = 0;
	
	return {
		triggerAttackRelease : function(name, duration, time){
			if (name === "up.down" || name === "down.up"){
				return;
			}
			var section, noteDur;
			if (Conductor.getMovement() !== 1){
				Preset.update(function(pre){
					samplerA.set(pre);
					samplerB.set(pre);
				});
				section = "A.";
				noteDur = samplerA.toSeconds(duration);
				// setLoopPoints(samplerA, loopPoints[section+name]);
				samplerA.triggerAttackRelease(section + name,
					noteDur - samplerA.toSeconds("16n"), 
					time);
				if (Conductor.getMovement() === 2){
					section = "C.";
					// setLoopPoints(samplerB, loopPoints[section+name]);
					samplerB.player.loop = false;
					if (name === "down.some" || name === "up.some"){
						time  = time + " + 8n";
					}
					samplerB.triggerAttackRelease(section + name,
						noteDur - samplerB.toSeconds("16n"), 
						time);
				} 
			} else {
				PresetB.update(function(pre){
					samplerB.set(pre);
				});
				section = "B.";
				noteDur = samplerB.toSeconds(duration);
				var noteName = section + name;
				var startPosition = loopPoints[section+name];
				var bufferDuration = samplerB._buffers[noteName].duration;

				shuffleLoopPosition(bufferDuration, startPosition);
				samplerB.player.loop = true;
				samplerB.triggerAttackRelease(noteName,
					noteDur - samplerB.toSeconds("16n"), 
					time);
			}
			//set the loop points
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
		},
		volume : volume.volume
	};
});