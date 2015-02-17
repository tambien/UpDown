define(["channel/Voice", "controller/Conductor"], function(Voice, Conductor){

	var voiceScore = [

		["0:0:2", "4n+8n", "some"], ["0:2", "4n", "times"],["0:3", "4n", "i"], 
		["1:0", "8n", "look"], ["1:0:2", "3 * 4n", "down"],
		
		["3:0:2", "4n+8n", "some"], ["3:2", "4n", "times"],["3:3", "4n", "i"], 
		["4:0", "8n", "look"], ["4:0:2", "3 * 4n", "down"],
		
		["6:0:2", "4n+8n", "some"], ["6:2", "4n", "times"],["6:3", "4n", "i"], 
		["7:0", "8n", "look"], ["7:0:2", "3 * 4n", "up"],
		
		["9:0:2", "4n+8n", "some"], ["9:2", "4n", "times"],["9:3", "4n", "i"], 
		["10:0", "8n", "look"], ["10:0:2", "3 * 4n", "up"],
		
	];		

	var noteGroup = "up";

	Conductor.parseScore(voiceScore, function(time, duration, word, section){
		if (Conductor.getSection() < 2){
			noteGroup = "down";
		} else {
			noteGroup = "up";
		}
		var voiceName = noteGroup+"."+word;
		Voice.triggerAttackRelease(voiceName, duration, time);
	});
});