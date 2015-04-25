define(["Tone/core/Transport", "controller/Mediator", "Tone/core/Note", 
	"TERP", "util/Config", "interface/Scroll"], 
	function(Transport, Mediator, Note, TERP, Config, Scroll){

	Transport.loop = true;

	var chordChanges = [ ["0:0", 0], ["1:0", 1], ["3:0", 0], ["4:0", 1], ["6:0", 0], ["7:0", 1], ["9:0", 0], ["10:0", 1], ["12:0", 0], ["13:0", 1], ["15:0", 0], ["16:0", 1], ["18:0", 0], ["19:0", 1], ["21:0", 0], ["22:0", 1]];
	var chordProgression = [["A7", "Dm"], ["C7", "Fmaj"], ["D7", "Gmaj"], ["Gmaj", "Cmaj"]];

	// chordProgression.reverse();

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

		/**
		 *  the total number of loops which have passed
		 */
		this.loop = 0;

		/**
		 *  the total number of measures
		 */
		this.measure = 0;

		/**
		 *  the number of times the voice has repeated
		 */
		this.voiceNumber = -1;


		// SECTION TIMING

		/**
		 *  the distance you have to scroll to arrive at the b section
		 */
		this.bDistance = 4;

		/**
		 *  the distance you have to scroll to arrive at the c section
		 */
		this.cDistance = 6;

		/**
		 *  the distance you have to scroll to arrive at the end
		 */
		this.endDistance = 12;

		/** 
		 *  The movement of the piece A, B, or C
		 */
		this.movement = 0;

		/**
		 *  the position within the section
		 */
		this.sectionPosition = 0;


		Transport.setInterval(this.updateLoop.bind(this), "1m");
		Transport.setInterval(this.updateSection.bind(this), "3m");
		//trigger the B section
		this.parseScore(chordChanges, this.chordChange.bind(this));
		Mediator.route("scroll", this.setTempo.bind(this));
		Mediator.route("firstScroll", this.start.bind(this));
		Mediator.route("pause", this.pause.bind(this));
		Mediator.route("replay", this.replay.bind(this));
		Mediator.route("play", this.play.bind(this));
		Mediator.route("end", this.end.bind(this));
		Mediator.route("switchDirection", this.switchDirection.bind(this));
		this.setTempo(this.progress, 0);
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
		//reverse the chords in movement 1
		if (this.movement === 1){
			currentSection = 3 - currentSection;
		}
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

	Conductor.prototype.getMovement = function() {
		return this.movement;
	};

	Conductor.prototype.switchDirection = function(direction, position){
		this.sectionSplits[0] = position/2;
		this.sectionSplits[1] = position;
		this.sectionSplits[2] = (1 - position) / 2 + position;
	};

	Conductor.prototype.setTempo = function(position, rampSpeed){
		rampSpeed = rampSpeed || 0;
		this.progress = position;
		var bpm = TERP.map(position, 0, 1, 65, 130, 1);
		if (!rampSpeed){
			Transport.bpm.value = bpm;
		} else {
			Transport.bpm.rampTo(bpm, rampSpeed / 1000);
		}
		//set the section based on the loop
		var section = Math.floor(Scroll.getDirectionPosition() * 4);
		if (this.nextSection !== section){
			this.nextSection = section;
		}
		//also update the swing
		// Transport.swing = TERP.map(position, 0, 1, 0.2, 0);
	};

	Conductor.prototype.updateSection = function(time) {
		//set the measures
		if (!Config.MOBILE){
			if (Scroll.getDistance() > this.bDistance && this.movement === 0){
				this._BStart(time);
				this.setLoopStartSection();
				this.setLoopEnd(this.currentSection);
			} else if (Scroll.getDistance() > this.cDistance && this.movement === 1){
				this._CStart(time);
				this.setLoopStartSection();
				this.setLoopEnd(this.currentSection);
			} else if (Scroll.getDistance() > this.endDistance && this.movement === 2){
				this.end();
				this._BStart(time);
				this.setLoopStartSection();
				this.setLoopEnd(this.currentSection);
			}
		}
		this.loop++;
		this.voiceNumber = (this.voiceNumber + 1) % 3;
		//update the chords if necessary
		this.updateChords(this.currentSection);
	};

	Conductor.prototype.updateLoop = function(time) {
		if (this.currentSection !== this.nextSection){
			if (this.nextSection >= 2 && this.currentSection < 2){
				this.voiceNumber = 0;
				Mediator.deferSend("half", 1);
			} else if (this.nextSection < 2 && this.currentSection >= 2){
				Mediator.deferSend("half", 0);
				this.voiceNumber = 0;
			}
			this.currentSection = this.nextSection;
			this.setLoopStart(this.currentSection);
			this.setLoopEnd(this.currentSection);
			Mediator.deferSend("section", this.currentSection);
		}
		this.sectionPosition = (this.sectionPosition + 1) % 3;
		this.measure++;
	};

	/**
	 *  set the loop start based on teh current section
	 */
	Conductor.prototype.setLoopStart = function(section){
		movement = this.movement % 2;
		Transport.loopStart = (section * 3 + movement * 12).toString() + ":0";
		Transport.position = (section * 3 + this.sectionPosition + movement * 12).toString() + ":0";
	};

	/**
	 *  set the loop start based on teh current section
	 */
	Conductor.prototype.setLoopStartSection = function(){
		// console.log("setting loop start", (section * 3).toString() + ":0");
		var section = this.currentSection;
		movement = this.movement % 2;
		Transport.loopStart = (section * 3 + movement * 12).toString() + ":0";
		Transport.position = (section * 3 +  movement * 12).toString() + ":0";
	};

	/**
	 *  set the loop end based on teh current section
	 */
	Conductor.prototype.setLoopEnd = function(section){
		movement = this.movement % 2;
		var loopEndTime = (section * 3 + 3 + movement * 12).toString() + ":0";
		// console.log("setting loop end", loopEndTime);
		Transport.loopEnd = loopEndTime;
	};

	/**
	 *  triggered at the start of the B section
	 *  @param  {[type]}  time  [description]
	 */
	Conductor.prototype._BStart = function(time){
		this.movement = 1;
		this.measure = 1;
		Mediator.send("B", time);
		Mediator.send("Movement", time);
	};

	/**
	 *  triggered at the start of the B section
	 *  @param  {[type]}  time  [description]
	 */
	Conductor.prototype._CStart = function(time){
		this.movement = 2;
		this.measure = 1;
		Mediator.send("C", time);
		Mediator.send("Movement", time);
	};

	///////////////////////////////////////////////////////////////////////////
	//  Instrument Control
	///////////////////////////////////////////////////////////////////////////

	var scrollIncrement = 0.1;

	Conductor.prototype.hasVoice = function(){
		if (Scroll.getDistance() > scrollIncrement * 5){
			if (this.movement === 1 && this.measure === 1){
				return true;
			} else {
				return this.voiceNumber !== 0;
			}
		} else {
			return false;
		}
	};

	Conductor.prototype.hasSnare = function(){
		if (Scroll.getDistance() > scrollIncrement * 4){
			if (this.movement === 1){
				return this.measure > 1;
			} else {
				return true;
			}
		} else {
			return false;
		}
	};

	Conductor.prototype.hasKick = function(){
		if (Scroll.getDistance() > scrollIncrement * 3){
			if (this.movement === 1){
				return this.measure > 1;
			} else {
				return true;
			}
		} else {
			return false;
		}
	};

	Conductor.prototype.hasHH = function(){
		if (Scroll.getDistance() > scrollIncrement * 2){
			if (this.movement === 1){
				return this.measure > 1;
			} else {
				return true;
			}
		} else {
			return false;
		}
	};

	Conductor.prototype.hasArp = function(){
		if (Scroll.getDistance() > scrollIncrement * 6){
			if (this.movement === 1){
				return this.measure > 1;
			} else {
				return true;
			}
		} else {
			return false;
		}
	};

	Conductor.prototype.hasBass = function(){
		if (Scroll.getDistance() > scrollIncrement * 1){
			if (this.movement === 1){
				return this.measure > 1;
			} else {
				return true;
			}
		}
	};

	Conductor.prototype.hasPiano = function(){
		if (this.movement !== 1){
			return true;
		} else if (this.movement === 1){
			return this.measure > 1;
		} 
	};

	var transitionDistance = 0.75;

	Conductor.prototype.getBTransitionProgress = function(){
		if (!Config.MOBILE){
			var bDiff = this.bDistance - Scroll.getDistance();
			if (bDiff < transitionDistance){
				return TERP.map(bDiff, transitionDistance, 0, 0, 1);
			} else {
				return 0;
			}
		} else {
			return 0;
		}
	};

	Conductor.prototype.getEndTransitionProgress = function(){
		if (!Config.MOBILE){
			var endDiff = this.endDistance - Scroll.getDistance();
			if (endDiff < transitionDistance * 2){
				return TERP.map(endDiff, transitionDistance * 2, 0, 0, 1);
			} else {
				return 0;
			}
		} else {
			return 0;
		}
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
		if (this.nextSection >= 2){
			Mediator.deferSend("half", 1);
		} else if (this.nextSection < 2){
			Mediator.deferSend("half", 0);
		}
		movement = this.movement % 2;
		Transport.start("+4n", (this.nextSection * 3 + movement * 12).toString() + ":0");
	};

	Conductor.prototype.pause = function(){
		Transport.pause();
	};

	Conductor.prototype.play = function(){
		Transport.start();
	};

	Conductor.prototype.end = function(){
		Scroll.setPosition(this.bDistance);
		// Transport.stop();
	};

	Conductor.prototype.replay = function() {
		this.movement = 0;
		this.measure = 0;
		this.nextSection = -1;
		this.currentSection = -2;
		this.chordNumber = -1;
		this.chordName = "none!";
		this.progress = 0.5;
		this.voiceNumber = -1;
		this.setTempo(this.progress, 0);
	};

	Conductor.prototype.isPaused = function(){
		return Transport.state === "paused";
	};

	return new Conductor();
});