define(["Tone/core/Tone", "Tone/signal/Signal", "Tone/source/Source", "Tone/core/Transport"], 
function(Tone){

	"use strict";

	/**
	 *  @class Tone.Oscillator supports a number of features including
	 *         phase rotation, multiple oscillator types (see Tone.Oscillator.type), 
	 *         and Transport syncing (see Tone.Oscillator.syncFrequency).
	 *
	 *  @constructor
	 *  @extends {Tone.Source}
	 *  @param {Frequency} [frequency] Starting frequency
	 *  @param {string} [type] The oscillator type. Read more about type below.
	 *  @example
	 * //make and start a 440hz sine tone
	 * var osc = new Tone.Oscillator(440, "sine").toMaster().start();
	 */
	Tone.Oscillator = function(){
		
		var options = this.optionsObject(arguments, ["frequency", "type"], Tone.Oscillator.defaults);
		Tone.Source.call(this, options);

		/**
		 *  the main oscillator
		 *  @type {OscillatorNode}
		 *  @private
		 */
		this._oscillator = null;
		
		/**
		 *  The frequency control.
		 *  @type {Frequency}
		 *  @signal
		 */
		this.frequency = new Tone.Signal(options.frequency, Tone.Type.Frequency);

		/**
		 *  The detune control signal.
		 *  @type {Cents}
		 *  @signal
		 */
		this.detune = new Tone.Signal(options.detune, Tone.Type.Cents);

		/**
		 *  the periodic wave
		 *  @type {PeriodicWave}
		 *  @private
		 */
		this._wave = null;

		/**
		 *  the phase of the oscillator
		 *  between 0 - 360
		 *  @type {number}
		 *  @private
		 */
		this._phase = options.phase;

		/**
		 *  the type of the oscillator
		 *  @type {string}
		 *  @private
		 */
		this._type = null;
		
		//setup
		this.type = options.type;
		this.phase = this._phase;
		this._readOnly(["frequency", "detune"]);
	};

	Tone.extend(Tone.Oscillator, Tone.Source);

	/**
	 *  the default parameters
	 *  @type {Object}
	 */
	Tone.Oscillator.defaults = {
		"type" : "sine",
		"frequency" : 440,
		"detune" : 0,
		"phase" : 0
	};

	/**
	 *  start the oscillator
	 *  @param  {Time} [time=now] 
	 *  @private
	 */
	Tone.Oscillator.prototype._start = function(time){
		//new oscillator with previous values
		this._oscillator = this.context.createOscillator();
		this._oscillator.setPeriodicWave(this._wave);
		//connect the control signal to the oscillator frequency & detune
		this._oscillator.connect(this.output);
		this.frequency.connect(this._oscillator.frequency);
		this.detune.connect(this._oscillator.detune);
		//start the oscillator
		this._oscillator.start(this.toSeconds(time));
	};

	/**
	 *  stop the oscillator
	 *  @private
	 *  @param  {Time} [time=now] (optional) timing parameter
	 *  @returns {Tone.Oscillator} this
	 */
	Tone.Oscillator.prototype._stop = function(time){
		if (this._oscillator){
			this._oscillator.stop(this.toSeconds(time));
			this._oscillator = null;
		}
		return this;
	};

	/**
	 *  Sync the signal to the Transport's bpm. Any changes to the transports bpm,
	 *  will also affect the oscillators frequency. 
	 *  @returns {Tone.Oscillator} this
	 *  @example
	 * Tone.Transport.bpm.value = 120;
	 * osc.frequency.value = 440;
	 * //the ration between the bpm and the frequency will be maintained
	 * osc.syncFrequency();
	 * Tone.Transport.bpm.value = 240; 
	 * // the frequency of the oscillator is doubled to 880
	 */
	Tone.Oscillator.prototype.syncFrequency = function(){
		Tone.Transport.syncSignal(this.frequency);
		return this;
	};

	/**
	 *  Unsync the oscillator's frequency from the Transport. 
	 *  See Tone.Oscillator.syncFrequency
	 *  @returns {Tone.Oscillator} this
	 */
	Tone.Oscillator.prototype.unsyncFrequency = function(){
		Tone.Transport.unsyncSignal(this.frequency);
		return this;
	};

	/**
	 * The type of the oscillator: either sine, square, triangle, or sawtooth. Also capable of
	 * setting the first x number of partials of the oscillator. For example: "sine4" would
	 * set be the first 4 partials of the sine wave and "triangle8" would set the first
	 * 8 partials of the triangle wave.
	 * <br><br> 
	 * Uses PeriodicWave internally even for native types so that it can set the phase. 
	 * PeriodicWave equations are from the 
	 * <a href="https://code.google.com/p/chromium/codesearch#chromium/src/third_party/WebKit/Source/modules/webaudio/PeriodicWave.cpp&sq=package:chromium">Webkit Web Audio implementation</a>.
	 *  
	 * @memberOf Tone.Oscillator#
	 * @type {string}
	 * @name type
	 * @example
	 * //set it to a square wave
	 * osc.type = "square";
	 * @example
	 * //set the first 6 partials of a sawtooth wave
	 * osc.type = "sawtooth6";
	 */
	Object.defineProperty(Tone.Oscillator.prototype, "type", {
		get : function(){
			return this._type;
		},
		set : function(type){

			var originalType = type;

			var fftSize = 4096;
			var periodicWaveSize = fftSize / 2;

			var real = new Float32Array(periodicWaveSize);
			var imag = new Float32Array(periodicWaveSize);
			
			var partialCount = 1;
			var partial = /(sine|triangle|square|sawtooth)(\d+)$/.exec(type);
			if (partial){
				partialCount = parseInt(partial[2]);
				type = partial[1];
				partialCount = Math.max(partialCount, 2);
				periodicWaveSize = partialCount;
			}

			var shift = this._phase;	
			for (var n = 1; n < periodicWaveSize; ++n) {
				var piFactor = 2 / (n * Math.PI);
				var b; 
				switch (type) {
					case "sine": 
						b = (n <= partialCount) ? 1 : 0;
						break;
					case "square":
						b = (n & 1) ? 2 * piFactor : 0;
						break;
					case "sawtooth":
						b = piFactor * ((n & 1) ? 1 : -1);
						break;
					case "triangle":
						if (n & 1) {
							b = 2 * (piFactor * piFactor) * ((((n - 1) >> 1) & 1) ? -1 : 1);
						} else {
							b = 0;
						}
						break;
					default:
						throw new TypeError("invalid oscillator type: "+type);
				}
				if (b !== 0){
					real[n] = -b * Math.sin(shift * n);
					imag[n] = b * Math.cos(shift * n);
				} else {
					real[n] = 0;
					imag[n] = 0;
				}
			}
			var periodicWave = this.context.createPeriodicWave(real, imag);
			this._wave = periodicWave;
			if (this._oscillator !== null){
				this._oscillator.setPeriodicWave(this._wave);
			}
			this._type = originalType;
		}
	});

	/**
	 * The phase of the oscillator in degrees. 
	 * @memberOf Tone.Oscillator#
	 * @type {Degrees}
	 * @name phase
	 * @example
	 * osc.phase = 180; //flips the phase of the oscillator
	 */
	Object.defineProperty(Tone.Oscillator.prototype, "phase", {
		get : function(){
			return this._phase * (180 / Math.PI);
		}, 
		set : function(phase){
			this._phase = phase * Math.PI / 180;
			//reset the type
			this.type = this._type;
		}
	});

	/**
	 *  Dispose and disconnect.
	 *  @return {Tone.Oscillator} this
	 */
	Tone.Oscillator.prototype.dispose = function(){
		Tone.Source.prototype.dispose.call(this);
		if (this._oscillator !== null){
			this._oscillator.disconnect();
			this._oscillator = null;
		}
		this._wave = null;
		this._writable(["frequency", "detune"]);
		this.frequency.dispose();
		this.frequency = null;
		this.detune.dispose();
		this.detune = null;
		return this;
	};

	return Tone.Oscillator;
});