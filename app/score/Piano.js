define(["channel/Piano", "controller/Conductor", "controller/Mediator", "Tone/core/Note", "Tone/core/Tone"], 
	function(Piano, Conductor, Mediator, Note, Tone){

	var pianoNotes = [
		["0:0", "4n + 8n"], ["0:2", "4n + 8n"],
		["1:0", "4n + 8n"], ["1:2", "4n + 8n"],
		["2:0", "4n + 8n"], ["2:2", "4n + 8n"],
		
		["3:0", "8n"], ["3:1", "8n"], ["3:2", "8n"], ["3:3", "8n"],
		["4:0", "8n"], ["4:1", "8n"], ["4:2", "8n"], ["4:3", "8n"],
		["5:0", "8n"], ["5:1", "8n"], ["5:2", "8n"], ["5:3", "8n"],
		
		["6:0", "8n"], ["6:1", "8n"], ["6:2", "8n"], ["6:3", "8n"],
		["7:0", "8n"], ["7:1", "8n"], ["7:2", "8n"], ["7:3", "8n"],
		["8:0", "8n"], ["8:1", "8n"], ["8:2", "8n"], ["8:3", "8n"],
		
		["9:1", "4n + 8n"], ["9:3", "4n + 8n"], 
		["10:1", "4n + 8n"], ["10:3", "4n + 8n"],
		["11:1", "4n + 8n"], [ "11:3", "4n + 8n"],
	];

	var chordNotes = {
		"Dm" : ["C4", "D4", "F4", "A4"],
		"A7" : ["C#4", "E4", "G4", "A4"],
		"C7" : ["C4", "E4", "F#4", "A#4"],
		"Fmaj" : ["C4", "D4", "F4", "A4"],
		"D7" : ["F#4", "A#4", "C5", "E5"],
		"Gmaj" : ["F#4", "A4", "B4", "D5"],
		"Cmaj" : ["G4", "B4", "C5", "E5"],
	};

	//convert them to frequencies
	for (var chord in chordNotes){
		var arr = chordNotes[chord];
		for (var i = 0; i < arr.length; i++){
			arr[i] = Tone.prototype.noteToFrequency(arr[i]);
		}
	}

	Conductor.parseScore(pianoNotes, function(time, duration){
		var chord = chordNotes[Conductor.getChord()];
		Piano.triggerAttackRelease(chord, duration, time);
		Mediator.deferSend("piano", chord);
	});
});