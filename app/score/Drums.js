define(["channel/HighHat", "controller/Conductor", "controller/Mediator", "channel/Kick"], 
function(HighHat, Conductor, Mediator, Kick){

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
	];


	Conductor.parseScore(highhat, function(time, note, chordName){
		HighHat.triggerAttackRelease("8n", time);
		Mediator.deferSend("highhat");
	});

	Conductor.parseScore(kick, function(time, note, chordName){
		Kick.triggerAttackRelease("8n", time, note);
		Mediator.deferSend("kick");
	});
});