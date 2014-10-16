define(["channel/Bass", "controller/Conductor", "controller/Mediator"], function(Bass, Conductor, Mediator){

	var bassSynth = [

		["0:0", 0], ["0:1", 2], ["0:2", 2], ["0:3", 2],
		["1:0", 0], ["1:1", 2], ["1:2", 2], ["1:3", 2],
		["2:0", 0], ["2:1", 0], ["2:2", 0],[ "2:3", 2],
		
		["3:0", 0], ["3:2", 2], 
		["4:0", 0], ["4:1", 2], ["4:3", 0], 
		["5:0", 0], ["5:2", 0],[ "5:3", 2],
		
		["6:0", 0], ["6:1:2", 2],["6:3", 1], 
		["7:0", 0], ["7:1:2", 2], ["7:3", 0], 
		["8:0:2", 0], ["8:2", 0],[ "8:3", 2],
		
		["9:0", 0], ["9:1:2", 2],["9:3", 1], 
		["10:0", 0], ["10:1:2", 2], ["10:3", 0], 
		["11:0:2", 0], ["11:2", 0],[ "11:3", 2]
		
	];		

	var chordNotes = {
		"Dm" : ["D2"],
		"A7" : ["A2"],
		"C7" : ["C2"],
		"Fmaj" : ["F2"],
		"D7" : ["D2"],
		"Gmaj" : ["G2"],
		"Cmaj" : ["C3"],
	};

	Conductor.parseScore(bassSynth, function(time, note, chordName){
		var chordNote = chordNotes[Conductor.getChord()];
		Bass.triggerAttackRelease(chordNote[0], "4n", time);
		Mediator.deferSend("bass");
	});
});