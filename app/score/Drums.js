define(["channel/HighHat", "controller/Conductor", "controller/Mediator", 
	"channel/Kick", "channel/Snare", "TERP"], 
function(HighHat, Conductor, Mediator, Kick, Snare, TERP){

	//generate highhat patterns
	var highhat = [];
	var measure, eighth, beat, sixteenth;
	//0-2: tripplets
	for (measure = 0; measure <= 2; measure++){
		for (beat = 0; beat < 4; beat++){
			for (eighth = 0; eighth < 3; eighth++){
				if (beat === 1 && eighth === 0){

				} else {
					highhat.push(measure + ":" + beat +"+8t*"+eighth);
				}
			}
		}
	}
	//3-5 : eighth notes
	for (measure = 3; measure <= 5; measure++){
		for (beat = 0; beat < 4; beat++){
			for (sixteenth = 0; sixteenth < 4; sixteenth++){
				if (beat === 1 && sixteenth === 0){

				} else {
					// sixteenth = eighth * 2;
					highhat.push(measure + ":" + beat +":"+sixteenth);
				}
			}
		}
	}
	//6-9 : eighth notes
	for (measure = 6; measure <= 8; measure++){
		for (beat = 0; beat < 4; beat++){
			for (eighth = 0; eighth < 2; eighth++){
				sixteenth = eighth * 2;
				highhat.push(measure + ":" + beat +":"+sixteenth);
			}
		}
	}
	//10-12 : eighth notes
	for (measure = 9; measure <= 11; measure++){
		for (beat = 0; beat < 4; beat++){
			for (sixteenth = 0; sixteenth < 4; sixteenth++){
				if (Math.random() < 0.8){
					highhat.push(measure + ":" + beat +":"+sixteenth);
				}
			}
		}
	}

	//12-14 : eighth notes
	for (measure = 12; measure <= 14; measure++){
		for (beat = 0; beat < 4; beat++){
			for (sixteenth = 0; sixteenth < 4; sixteenth++){
				highhat.push(measure + ":" + beat +":"+sixteenth);
			}
		}
	}

	//15-17 : eighth notes
	for (measure = 15; measure <= 17; measure++){
		for (beat = 0; beat < 4; beat++){
			for (sixteenth = 0; sixteenth < 4; sixteenth++){
				highhat.push(measure + ":" + beat +":"+sixteenth);
			}
		}
	}

	var kick = [
		["0:0", "D1"], ["0:1 + 2*8t", "D1"], ["0:2", "D1"], 
		["1:0", "D1"], ["1:1 + 2*8t", "D1"], ["1:2", "D1"], 
		["2:0", "D1"], ["2:1 + 2*8t", "D1"], ["2:2", "D1"], 

		["3:0", "C1"], ["3:1:2", "C1"], ["3:2", "C1"], ["3:3:2", "C1"], 
		["4:0", "C1"], ["4:1:2", "C1"], ["4:2", "C1"], ["4:3:2", "C1"], 
		["5:0", "C1"], ["5:1:2", "C1"], ["5:2", "C1"], ["5:3:2", "C1"], 

		["6:0:2", "D1"], ["6:1", "D1"], ["6:1:2", "D1"], ["6:3", "D1"], 
		["7:0:2", "D1"], ["7:1", "D1"], ["7:1:2", "D1"], ["7:3", "D1"], 
		["8:0:2", "D1"], ["8:1", "D1"], ["8:1:2", "D1"], ["8:3", "D1"], 

		["9:0", "G1"], ["9:1", "G1"], ["9:2", "G1"], ["9:3", "G1"], 
		["10:0", "G1"], ["10:1", "G1"], ["10:2", "G1"], ["10:3", "G1"], 
		["11:0", "G1"], ["11:1", "G1"], ["11:2", "G1"], ["11:3", "G1"], 

		//B Part
		["12:0", "G1"], ["12:1:3", "G1", 0.85], ["12:2", "G1", 0.9], ["12:3:1", "G1", 0.8], 
		["13:0", "G1", 0.92], ["13:1:3", "G1", 0.7], ["13:2", "G1", 0.8], ["13:3:2", "G1", 0.6],
		["14:0", "G1", 0.8], ["14:1:3", "G1", 0.85], ["14:2", "G1", 0.85], ["14:3:3", "G1", 0.92], 

		["15:0", "D1"], ["15:0:3", "D1", 0.8], ["15:2", "D1", 0.8], ["15:2:3", "D1", 0.8], 
		["16:0", "D1"], ["16:0:3", "D1", 0.8], ["16:2", "D1", 0.8], ["16:2:3", "D1", 0.8], 
		["17:0", "D1"], ["17:0:3", "D1", 0.8], ["17:2", "D1", 0.8], ["17:2:3", "D1", 0.8], 
	];

	var snare = [
		["0:1"], ["0:3"], 
		["1:1"], ["1:3"], 
		["2:1"], ["2:3"], 

		["3:1"], ["3:3"], 
		["4:1"], ["4:3"], 
		["5:1"], ["5:3"], 

		["6:1"], ["6:2:2"], 
		["7:1"], ["7:2:2"], 
		["8:1"], ["8:2:2"], 

		["9:1"],   ["9:2:2"],  ["9:3:1"], 
		["10:1"], ["10:2:2"], ["10:3:1"], 
		["11:1"], ["11:2:2"], ["11:3:1"], 

		["12:1"], ["12:2:2"], 
		["13:1"], ["13:3:1"], 
		["14:1"], ["14:2:2"], ["14:3:1"],

		["15:1"], ["15:3"], 
		["16:1"], ["16:3"], 
		["17:1"], ["17:3"], 
	];

	Conductor.parseScore(highhat, function(time, note, chordName){
		if (Conductor.hasHH()){
			var velocity = TERP.scale(Math.random(), 0.36, 1);
			var pan = Math.random();
			HighHat.triggerAttackRelease("8n", time, velocity, pan);
			Mediator.deferSend("highhat", velocity, pan);
		}
	});

	Conductor.parseScore(kick, function(time, note, probability){
		if (Conductor.hasKick()){
			if (!probability || Math.random() < probability){
				Kick.triggerAttackRelease("8n", time, note);
				Mediator.deferSend("kick");
			}
		}
	});

	Conductor.parseScore(snare, function(time){
		if (Conductor.hasSnare()){
			Snare.triggerAttack(time);
			Mediator.deferSend("snare");
		}
	});
});