define(["Tone/core/Transport", "controller/Mediator", "Tone/core/Note", "TERP"], function(Transport, Mediator, Note, TERP){

	Transport.loop = true;

	var chordChanges = [ ["0:0", 0], ["1:0", 1], ["3:0", 0], ["4:0", 1], ["6:0", 0], ["7:0", 1], ["9:0", 0], ["10:0", 1]];
	var chordProgression = [["A7", "Dm"], ["C7", "Fmaj"], ["D7", "Gmaj"], ["Gmaj", "Cmaj"]];

	/**
	 *  the conductor leads the score
	 *  it emits state events
	 *  @constructor
	 */
	var Conductor = function(){

		/**
		 *  the next section number [0,3]
		 *  @type {Number}
		 *  @private
		 */
		this.nextSection = -1;

		/**
		 *  the current section number [0,3]
		 *  @type {Number}
		 *  @private
		 */
		this.currentSection = -2;

		/**
		 *  the current chord number
		 *  @type {Number}
		 *  @private
		 */
		this.chordNumber = -1;

		/**
		 *  the name of the chord
		 *  @type {string}
		 *  @private
		 */
		this.chordName = "none!";

		/**
		 *  the progress through the piece
		 *  @type {Number}
		 *  @private
		 */
		this.progress = 0.5;

		Transport.setInterval(this.updateLoop.bind(this), "3m");
		this.parseScore(chordChanges, this.chordChange.bind(this));
		Mediator.route("scroll", this.setTempo.bind(this));
		this.setTempo(this.progress);
	};


	/**
	 *        1  ---------------------------+   
	 *                             +-------+   
	 *                    +--------> Cmaj7 |   
	 *                    |        +---+---+   
	 *                 +--v---+        |       
	 *     0.75 -------+ G6/9 +-------------+  
	 *                 +--^---+        |       
	 *                    |            |       
	 *               +----v-----+      |       
	 *    +---------->  Daug7/9 |      |       
	 *    | 0.5 ----------------------------+  
	 *    |          |   C7#11  <------+       
	 *    |          +-----^----+              
	 *    |                |                            
	 *    |            +---v--+                
	 *    |            | F6/9 |                
	 *    |            +---+--+                
	 *    |                |                   
	 *    | 0.25 ---------------------------+  
	 *    |                |                   
	 *  +-+-----+       +--v-+                 
	 *  | Dmin7 <-------> A7 |                 
	 *  +-------+       +----+                
	 * 
	 *        0  ---------------------------+   
	 */
	Conductor.prototype.updateChords = function(currentSection){
		//a state machine that follows the chords above ^^
		var chordNumber = this.chordNumber;
		if (chordNumber >= 2){
			if (currentSection > chordNumber){
				this.chordNumber++;
			} else if (currentSection < 2){
				this.chordNumber = 1;
			}
		} else {
			if (currentSection < chordNumber){
				this.chordNumber--;
			} else if (currentSection >= 2){
				this.chordNumber = 2;
			}
		}
	};

	/**
	 *  called everytime there is a chord change
	 */
	Conductor.prototype.chordChange = function(time, section){
		var chord = chordProgression[this.chordNumber][section];
		this.chordName = chord;
	};

	Conductor.prototype.getChord = function() {
		return this.chordName;	
	};

	Conductor.prototype.getProgress = function() {
		return this.progress;
	};

	Conductor.prototype.getSection = function() {
		return this.currentSection;
	};

	Conductor.prototype.setTempo = function(position, rampSpeed){
		this.progress = position;
		var bpm = TERP.map(position, 0, 1, 55, 130, 1);
		Transport.setBpm(bpm, rampSpeed / 1000);
		//set the section based on the loop
		var section = Math.floor(position * 4);
		if (this.nextSection !== section){
			this.nextSection = section;
			this.setLoopStart(section);
		}
		//also update the swing
		Transport.setSwing(TERP.map(position, 0, 1, 0.3, 0));
	};

	Conductor.prototype.updateLoop = function() {
		if (this.currentSection !== this.nextSection){
			if (this.nextSection >= 2 && this.currentSection < 2){
				Mediator.deferSend("half", 1);
			} else if (this.nextSection < 2 && this.currentSection >= 2){
				Mediator.deferSend("half", 0);
			}
			this.currentSection = this.nextSection;
			this.setLoopEnd(this.currentSection);
			Mediator.deferSend("section", this.currentSection);
		}
		//update the chords if necessary
		this.updateChords(this.currentSection);
	};

	/**
	 *  set the loop start based on teh current section
	 */
	Conductor.prototype.setLoopStart = function(section){
		// console.log("setting loop start", (section * 3).toString() + ":0");
		Transport.setLoopStart((section * 3).toString() + ":0");
	};

	/**
	 *  set the loop end based on teh current section
	 */
	Conductor.prototype.setLoopEnd = function(section){
		var loopEndTime = (section * 3 + 3).toString() + ":0";
		// console.log("setting loop end", loopEndTime);
		Transport.setLoopEnd(loopEndTime);
	};

	/**
	 *  @private
	 *  @static
	 *  @type {Number}
	 */
	Conductor.randomNameCount = 0;

	/**
	 *  parse the notes and the score
	 */
	Conductor.prototype.parseScore = function(notes, callback){
		var name = "randomName" + Conductor.randomNameCount++;
		var score = {};
		score[name] = notes;
		Note.parseScore(score);
		Note.route(name, callback);
	};

	/**
	 *  start the score at the right offset
	 */
	Conductor.prototype.start = function() {
		//set the loop start and end based on teh current values
		this.setLoopStart(this.nextSection);
		this.setLoopEnd(this.nextSection);
		this.chordNumber = this.nextSection;
		Transport.start("+0.2", (this.nextSection * 3).toString() + ":0");
	};

	 return new Conductor();
});