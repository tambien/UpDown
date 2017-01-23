define(["Tone/core/Tone", "Tone/signal/Signal", "Tone/core/Timeline"], function (Tone) {

	"use strict";

	/**
	 *  @class A signal which adds the method getValueAtTime. 
	 *         Code and inspiration from https://github.com/jsantell/web-audio-automation-timeline
	 *  @extends {Tone.Param}
	 *  @param {Number=} value The initial value of the signal
	 *  @param {String=} units The conversion units of the signal.
	 */
	Tone.TimelineSignal = function(){

		var options = this.optionsObject(arguments, ["value", "units"], Tone.Signal.defaults);

		//constructors
		Tone.Signal.apply(this, options);
		options.param = this._param;
		Tone.Param.call(this, options);

		/**
		 *  The scheduled events
		 *  @type {Tone.Timeline}
		 *  @private
		 */
		this._events = new Tone.Timeline(10);

		/**
		 *  The initial scheduled value
		 *  @type {Number}
		 *  @private
		 */
		this._initial = this._fromUnits(this._param.value);
	};

	Tone.extend(Tone.TimelineSignal, Tone.Param);

	/**
	 *  The event types of a schedulable signal.
	 *  @enum {String}
	 *  @private
	 */
	Tone.TimelineSignal.Type = {
		Linear : "linear",
		Exponential : "exponential",
		Target : "target",
		Curve : "curve",
		Set : "set"
	};

	/**
	 * The current value of the signal. 
	 * @memberOf Tone.TimelineSignal#
	 * @type {Number}
	 * @name value
	 */
	Object.defineProperty(Tone.TimelineSignal.prototype, "value", {
		get : function(){
			var now = this.now();
			var val = this.getValueAtTime(now);
			return this._toUnits(val);
		},
		set : function(value){
			var convertedVal = this._fromUnits(value);
			this._initial = convertedVal;
			this._param.value = convertedVal;
		}
	});

	///////////////////////////////////////////////////////////////////////////
	//	SCHEDULING
	///////////////////////////////////////////////////////////////////////////

	/**
	 *  Schedules a parameter value change at the given time.
	 *  @param {*}	value The value to set the signal.
	 *  @param {Time}  time The time when the change should occur.
	 *  @returns {Tone.TimelineSignal} this
	 *  @example
	 * //set the frequency to "G4" in exactly 1 second from now. 
	 * freq.setValueAtTime("G4", "+1");
	 */
	Tone.TimelineSignal.prototype.setValueAtTime = function (value, startTime) {
		value = this._fromUnits(value);
		startTime = this.toSeconds(startTime);
		this._events.addEvent({
			"type" : Tone.TimelineSignal.Type.Set,
			"value" : value,
			"time" : startTime
		});
		//invoke the original event
		this._param.setValueAtTime(value, startTime);
		return this;
	};

	/**
	 *  Schedules a linear continuous change in parameter value from the 
	 *  previous scheduled parameter value to the given value.
	 *  
	 *  @param  {number} value   
	 *  @param  {Time} endTime 
	 *  @returns {Tone.TimelineSignal} this
	 */
	Tone.TimelineSignal.prototype.linearRampToValueAtTime = function (value, endTime) {
		value = this._fromUnits(value);
		endTime = this.toSeconds(endTime);
		this._events.addEvent({
			"type" : Tone.TimelineSignal.Type.Linear,
			"value" : value,
			"time" : endTime
		});
		this._param.linearRampToValueAtTime(value, endTime);
		return this;
	};

	/**
	 *  Schedules an exponential continuous change in parameter value from 
	 *  the previous scheduled parameter value to the given value.
	 *  
	 *  @param  {number} value   
	 *  @param  {Time} endTime 
	 *  @returns {Tone.TimelineSignal} this
	 */
	Tone.TimelineSignal.prototype.exponentialRampToValueAtTime = function (value, endTime) {
		//get the previous event and make sure it's not starting from 0
		var beforeEvent = this._searchBefore(endTime);
		if (beforeEvent && beforeEvent.value === 0){
			//reschedule that event
			this.setValueAtTime(this._minOutput, beforeEvent.time);
		}
		value = this._fromUnits(value);
		var setValue = Math.max(value, this._minOutput);
		endTime = this.toSeconds(endTime);
		this._events.addEvent({
			"type" : Tone.TimelineSignal.Type.Exponential,
			"value" : setValue,
			"time" : endTime
		});
		//if the ramped to value is 0, make it go to the min output, and then set to 0.
		if (value < this._minOutput){
			this._param.exponentialRampToValueAtTime(this._minOutput, endTime - this.sampleTime);
			this.setValueAtTime(0, endTime);
		} else {
			this._param.exponentialRampToValueAtTime(value, endTime);
		}
		return this;
	};

	/**
	 *  Start exponentially approaching the target value at the given time with
	 *  a rate having the given time constant.
	 *  @param {number} value        
	 *  @param {Time} startTime    
	 *  @param {number} timeConstant 
	 *  @returns {Tone.TimelineSignal} this 
	 */
	Tone.TimelineSignal.prototype.setTargetAtTime = function (value, startTime, timeConstant) {
		value = this._fromUnits(value);
		value = Math.max(this._minOutput, value);
		timeConstant = Math.max(this._minOutput, timeConstant);
		startTime = this.toSeconds(startTime);
		this._events.addEvent({
			"type" : Tone.TimelineSignal.Type.Target,
			"value" : value,
			"time" : startTime,
			"constant" : timeConstant
		});
		this._param.setTargetAtTime(value, startTime, timeConstant);
		return this;
	};

	/**
	 *  Set an array of arbitrary values starting at the given time for the given duration.
	 *  @param {Float32Array} values        
	 *  @param {Time} startTime    
	 *  @param {Time} duration
	 *  @param {NormalRange} [scaling=1] If the values in the curve should be scaled by some value
	 *  @returns {Tone.TimelineSignal} this 
	 */
	Tone.TimelineSignal.prototype.setValueCurveAtTime = function (values, startTime, duration, scaling) {
		scaling = this.defaultArg(scaling, 1);
		//copy the array
		var floats = new Float32Array(values);
		for (var i = 0; i < floats.length; i++){
			floats[i] = this._fromUnits(floats[i]) * scaling;
		}
		startTime = this.toSeconds(startTime);
		duration = this.toSeconds(duration);
		this._events.addEvent({
			"type" : Tone.TimelineSignal.Type.Curve,
			"value" : floats,
			"time" : startTime,
			"duration" : duration
		});
		floats = this._interpolateValueCurve(floats, duration);
		this._param.setValueCurveAtTime(floats, startTime, duration);
		return this;
	};

	/**
	 *  setValueCurveAtTime currently doesn't interpolate adjacent values 
	 *  for some browsers as per [the spec](http://webaudio.github.io/web-audio-api/#widl-AudioParam-setValueCurveAtTime-AudioParam-Float32Array-values-double-startTime-double-duration)
	 *  Creates a pre-interpolated curve on browsers that are not Chrome 46+.
	 *  POLYFILL
	 *  @param  {Float32Array}  values
	 *  @param  {Number}  duration
	 *  @return  {Float32Array}
	 *  @private
	 */
	Tone.TimelineSignal.prototype._interpolateValueCurve = function(values, duration){
		//only chrome version > 46 currently supports scaled value curves
		var isChrome = navigator.userAgent.toLowerCase().indexOf("chrome") > -1;
		//http://stackoverflow.com/questions/4900436/how-to-detect-the-installed-chrome-version
		var version = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
		if (!(isChrome && parseInt(version[2]) > 46)){
			//make a new array
			var numSamples = Math.floor(duration * this.context.sampleRate * 0.5);
			var newVals = new Float32Array(numSamples);
			for (var i = 0; i < numSamples; i++){
				newVals[i] = this._curveInterpolate(0, values, numSamples, i);
			}
			return newVals;
		} else {
			return values;
		}
	};

	/**
	 *  Cancels all scheduled parameter changes with times greater than or 
	 *  equal to startTime.
	 *  
	 *  @param  {Time} startTime
	 *  @returns {Tone.TimelineSignal} this
	 */
	Tone.TimelineSignal.prototype.cancelScheduledValues = function (after) {
		this._events.cancel(after);
		this._param.cancelScheduledValues(this.toSeconds(after));
		return this;
	};

	/**
	 *  Sets the computed value at the given time. This provides
	 *  a point from which a linear or exponential curve
	 *  can be scheduled after. Will cancel events after 
	 *  the given time and shorten the currently scheduled
	 *  linear or exponential ramp so that it ends at `time` .
	 *  This is to avoid discontinuities and clicks in envelopes. 
	 *  @param {Time} time When to set the ramp point
	 *  @returns {Tone.TimelineSignal} this
	 */
	Tone.TimelineSignal.prototype.setRampPoint = function (time) {
		time = this.toSeconds(time);
		//get the value at the given time
		var val = this.getValueAtTime(time);
		//if there is an event at the given time
		//and that even is not a "set"
		var before = this._searchBefore(time);
		if (before && before.time === time){
			//remove everything after
			this.cancelScheduledValues(time + this.sampleTime);
		} else {
			//reschedule the next event to end at the given time
			var after = this._searchAfter(time);
			if (after){
				//cancel the next event(s)
				this.cancelScheduledValues(time);
				if (after.type === Tone.TimelineSignal.Type.Linear){
					this.linearRampToValueAtTime(val, time);
				} else if (after.type === Tone.TimelineSignal.Type.Exponential){
					this.exponentialRampToValueAtTime(val, time);
				} 
			} 
			this.setValueAtTime(val, time);
		}
		return this;
	};

	/**
	 *  Do a linear ramp to the given value between the start and finish times.
	 *  @param {Number} value The value to ramp to.
	 *  @param {Time} start The beginning anchor point to do the linear ramp
	 *  @param {Time} finish The ending anchor point by which the value of
	 *                       the signal will equal the given value.
	 *  @returns {Tone.TimelineSignal} this
	 */
	Tone.TimelineSignal.prototype.linearRampToValueBetween = function (value, start, finish) {
		this.setRampPoint(start);
		this.linearRampToValueAtTime(value, finish);
		return this;
	};

	/**
	 *  Do a exponential ramp to the given value between the start and finish times.
	 *  @param {Number} value The value to ramp to.
	 *  @param {Time} start The beginning anchor point to do the exponential ramp
	 *  @param {Time} finish The ending anchor point by which the value of
	 *                       the signal will equal the given value.
	 *  @returns {Tone.TimelineSignal} this
	 */
	Tone.TimelineSignal.prototype.exponentialRampToValueBetween = function (value, start, finish) {
		this.setRampPoint(start);
		this.exponentialRampToValueAtTime(value, finish);
		return this;
	};

	///////////////////////////////////////////////////////////////////////////
	//	GETTING SCHEDULED VALUES
	///////////////////////////////////////////////////////////////////////////

	/**
	 *  Returns the value before or equal to the given time
	 *  @param  {Number}  time  The time to query
	 *  @return  {Object}  The event at or before the given time.
	 *  @private
	 */
	Tone.TimelineSignal.prototype._searchBefore = function(time){
		return this._events.getEvent(time);
	};

	/**
	 *  The event after the given time
	 *  @param  {Number}  time  The time to query.
	 *  @return  {Object}  The next event after the given time
	 *  @private
	 */
	Tone.TimelineSignal.prototype._searchAfter = function(time){
		return this._events.getEventAfter(time);
	};

	/**
	 *  Get the scheduled value at the given time. This will
	 *  return the unconverted (raw) value.
	 *  @param  {Number}  time  The time in seconds.
	 *  @return  {Number}  The scheduled value at the given time.
	 */
	Tone.TimelineSignal.prototype.getValueAtTime = function(time){
		var after = this._searchAfter(time);
		var before = this._searchBefore(time);
		var value = this._initial;
		//if it was set by
		if (before === null){
			value = this._initial;
		} else if (before.type === Tone.TimelineSignal.Type.Target){
			var previous = this._events.getEventBefore(before.time);
			var previouVal;
			if (previous === null){
				previouVal = this._initial;
			} else {
				previouVal = previous.value;
			}
			value = this._exponentialApproach(before.time, previouVal, before.value, before.constant, time);
		} else if (before.type === Tone.TimelineSignal.Type.Curve){
			value = this._curveInterpolate(before.time, before.value, before.duration, time);
		} else if (after === null){
			value = before.value;
		} else if (after.type === Tone.TimelineSignal.Type.Linear){
			value = this._linearInterpolate(before.time, before.value, after.time, after.value, time);
		} else if (after.type === Tone.TimelineSignal.Type.Exponential){
			value = this._exponentialInterpolate(before.time, before.value, after.time, after.value, time);
		} else {
			value = before.value;
		}
		return value;
	};

	/**
	 *  When signals connect to other signals or AudioParams, 
	 *  they take over the output value of that signal or AudioParam. 
	 *  For all other nodes, the behavior is the same as a default <code>connect</code>. 
	 *
	 *  @override
	 *  @param {AudioParam|AudioNode|Tone.Signal|Tone} node 
	 *  @param {number} [outputNumber=0] The output number to connect from.
	 *  @param {number} [inputNumber=0] The input number to connect to.
	 *  @returns {Tone.TimelineSignal} this
	 *  @method
	 */
	Tone.TimelineSignal.prototype.connect = Tone.SignalBase.prototype.connect;


	///////////////////////////////////////////////////////////////////////////
	//	AUTOMATION CURVE CALCULATIONS
	//	MIT License, copyright (c) 2014 Jordan Santell
	///////////////////////////////////////////////////////////////////////////

	/**
	 *  Calculates the the value along the curve produced by setTargetAtTime
	 *  @private
	 */
	Tone.TimelineSignal.prototype._exponentialApproach = function (t0, v0, v1, timeConstant, t) {
		return v1 + (v0 - v1) * Math.exp(-(t - t0) / timeConstant);
	};

	/**
	 *  Calculates the the value along the curve produced by linearRampToValueAtTime
	 *  @private
	 */
	Tone.TimelineSignal.prototype._linearInterpolate = function (t0, v0, t1, v1, t) {
		return v0 + (v1 - v0) * ((t - t0) / (t1 - t0));
	};

	/**
	 *  Calculates the the value along the curve produced by exponentialRampToValueAtTime
	 *  @private
	 */
	Tone.TimelineSignal.prototype._exponentialInterpolate = function (t0, v0, t1, v1, t) {
		v0 = Math.max(this._minOutput, v0);
		return v0 * Math.pow(v1 / v0, (t - t0) / (t1 - t0));
	};

	/**
	 *  Calculates the the value along the curve produced by setValueCurveAtTime
	 *  @private
	 */
	Tone.TimelineSignal.prototype._curveInterpolate = function (start, curve, duration, time) {
		var len = curve.length;
		// If time is after duration, return the last curve value
		if (time >= start + duration) {
			return curve[len - 1];
		} else if (time <= start){
			return curve[0];
		} else {
			var progress = (time - start) / duration;
			var lowerIndex = Math.floor((len - 1) * progress);
			var upperIndex = Math.ceil((len - 1) * progress);
			var lowerVal = curve[lowerIndex];
			var upperVal = curve[upperIndex];
			if (upperIndex === lowerIndex){
				return lowerVal;
			} else {
				return this._linearInterpolate(lowerIndex, lowerVal, upperIndex, upperVal, progress * (len - 1));
			}
		}
	};

	/**
	 *  Clean up.
	 *  @return {Tone.TimelineSignal} this
	 */
	Tone.TimelineSignal.prototype.dispose = function(){
		Tone.Signal.prototype.dispose.call(this);
		Tone.Param.prototype.dispose.call(this);
		this._events.dispose();
		this._events = null;
	};

	return Tone.TimelineSignal;
});