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
		"0:0", "0:1 + 2*8t", "0:2", 
		"1:0", "1:1 + 2*8t", "1:2", 
		"2:0", "2:1 + 2*8t", "2:2", 

		"3:0", "3:1:2", "3:2", "3:3:2", 
		"4:0", "4:1:2", "4:2", "4:3:2", 
		"5:0", "5:1:2", "5:2", "5:3:2", 

		"6:0:2", "6:1", "6:1:2", "6:3", 
		"7:0:2", "7:1", "7:1:2", "7:3", 
		"8:0:2", "8:1", "8:1:2", "8:3", 

		"9:0", "9:1", "9:2", "9:3", 
		"10:0", "10:1", "10:2", "10:3", 
		"11:0", "11:1", "11:2", "11:3", 
	];


	Conductor.parseScore(highhat, function(time, note, chordName){
		HighHat.triggerAttackRelease("8n", time);
		Mediator.deferSend("highhat");
	});

	Conductor.parseScore(kick, function(time, note, chordName){
		Kick.triggerAttackRelease("8n", time);
		Mediator.deferSend("kick");
	});
});