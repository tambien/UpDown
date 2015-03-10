define(["channel/Arp", "controller/Conductor", "controller/Mediator"], function(Arp, Conductor, Mediator){

	var arpSynth = [];

	var subdivision0 = "8t";
	var i = 0;
	for (i = 0; i < 24 * 3; i++){
		arpSynth.push(["9m + " + i + " * " + subdivision0, subdivision0]);
	}

	var subdivision1 = "16n";
	for (i = 0; i < 16 * 3; i++){
		arpSynth.push(["6m + " + i + " * " + subdivision1, subdivision1]);
	}

	var subdivision2 = "32n";
	for (i = 0; i < 32 * 3; i++){
		arpSynth.push(["3m + " + i + " * " + subdivision2, subdivision2]);
	}

	var subdivision3 = "16t";
	for (i = 0; i < 24 * 3; i++){
		arpSynth.push([i + " * " + subdivision3, subdivision3]);
	}

	var noteIndex = 0;

	var octave = 5;

	var chordNotes = {
		"Dm" : ["C", "D", "E", "F", "A"],
		"A7" : ["C#", "E", "G", "A", "B"],
		"C7" : ["C", "D", "E", "F#", "A#"],
		"Fmaj" : ["C","D", "F", "G",  "A"],
		"D7" : ["C", "D", "E",  "F#","A#"],
		"Gmaj" : ["D", "F#", "G", "A", "B"],
		"Cmaj" : ["C", "E", "G", "A", "B"],
	};

	Conductor.parseScore(arpSynth, function(time, duration){
		if (Conductor.hasArp()){
			var chordNote = chordNotes[Conductor.getChord()];
			Arp.triggerAttackRelease(chordNote[noteIndex] + octave, duration, time);
			noteIndex++;
			Mediator.deferSend("arp", noteIndex);
			noteIndex = noteIndex % 5;
		}
	});
});