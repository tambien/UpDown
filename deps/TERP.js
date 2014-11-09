(function (root, factory) {
	//can run with or without requirejs
	if (typeof define === "function" && define.amd) {
		// AMD. Register as module.
		define(function () {
			var TERP = factory();
			return TERP;
		});
	} else if (typeof exports === "object") {
		//so that it can be used within node without requirejs
		module.exports = factory(root);
	} else if (typeof root.TERP !== "function") {
		//make Tone public
		root.TERP = factory(root);
	}
} (this, function () {

	/**
	 *  applies a funct to each number in arr
	 *  @param  {Array<number} arr   
	 *  @param  {Array<number>} args  arguments to be applied to funct
	 *  @param  {function} funct 
	 *  @return {Array<number>}       maps each of the values in ret to each of the outputs
	 */
	function applyToArray(arr, args, funct){
		var ret = new Array(arr.length);
		for (var i = 0; i < arr.length; i++){
			args[0] = arr[i];
			ret[i] = funct.apply(TERP, args);
		}
		return ret;	
	}

	/**
	 *  interpolates a normalized number to between the outputMin and outputMax
	 *  @param  {number} input   
	 *  @param  {number} outputMin
	 *  @param  {number} outputMax
	 *  @return {number}           
	 */
	function interpolate(input, outputMin, outputMax){
		return input * (outputMax - outputMin) + outputMin;
	}

	/**
	 *  clip the input value so that it is between the outputMin and outputMax
	 *  @param  {number} input   
	 *  @param  {number} outputMin
	 *  @param  {number} outputMax
	 *  @return {number}           
	 */
	function clip(input, outputMin, outputMax){
		var clipMin = Math.min(outputMin, outputMax);
		var clipMax = Math.max(outputMin, outputMax);
		if (input > clipMax){
			return clipMax;
		} else if (input < clipMin){
			return clipMin;
		} else {
			return input;
		}
	}

	var TERP = {
		/**
		 *  normalizes (0-1) a number between inputMin and inputMax
		 *  @param 	{number} input 
		 *  @param  {number} inputMin 
		 *  @param  {number} inputMax 
		 *  @return {number} 
		 */
		normalize : function(input, inputMin, inputMax){
			return (input - inputMin) / (inputMax - inputMin);
		},
		/**
		 *  if 3 or 4 inputs, assumes the input range is between 0-1
		 *  	
	 	 *  @param {number} input
 		 *  @param {number} outputMin	
 		 *	@param {number} outputMax
 		 *  @param {number=} exponent (optional exponent which will change the interpolation curve)
	 	 *  	
		 *  if 5 or 6 inputs:
		 *  
		 *  @param {number} input
		 *	@param {number} inputMin
		 *	@param {number} inputMax
		 *  @param {number} outputMin	
		 *	@param {number} outputMax
		 *  @param {number=} exponent (optional exponent which will change the interpolation curve)
		 *
		 *  @return {number} 
		 */
		scale : function(){
			var argLen = arguments.length;
			var input = arguments[0];
			var normalized, exped;
			if (argLen === 3) {
				return interpolate(input, arguments[1], arguments[2]);
			} else if (argLen === 4){
				exped = Math.pow(input, arguments[3]);
				return interpolate(exped, arguments[1], arguments[2]);
			} else if (argLen === 5){
				normalized = TERP.normalize(input, arguments[1], arguments[2]);
				return interpolate(normalized, arguments[3], arguments[4]);
			} else if (argLen === 6){
				normalized = TERP.normalize(input, arguments[1], arguments[2]);
				exped = Math.pow(normalized, arguments[5]);
				return interpolate(exped, arguments[3], arguments[4]);
			} else {
				console.error("scale accepts 3 - 6 arguments");
			}
		},
		/**
		 *  like scale, but clips the output to the output range
		 *  @return {number} 
		 */
		map : function(){
			var interped = TERP.scale.apply(TERP, arguments);
			//clip the output
			var argLen = arguments.length;
			if (argLen === 3 || argLen === 4){
				return clip(interped, arguments[1], arguments[2]);
			} else if (argLen === 5 || argLen === 6){
				return clip(interped, arguments[3], arguments[4]);
			}
		},
		/**
		 *  like scale, but accepts an array
		 *  @return {array<number>} an array of the same size 
		 */
		scaleArray : function(){
			var input = arguments[0];
			var args = Array.prototype.slice.call(arguments, 0);
			return applyToArray(input, args, TERP.scale);
		},
		/**
		 *  like map, but accepts an array
		 *  @return {array<number>} an array of the same size 
		 */
		mapArray : function(){
			var input = arguments[0];
			var args = Array.prototype.slice.call(arguments, 0);
			return applyToArray(input, args, TERP.map);
		},
		/**
		 *  like normalize, but accepts an array
		 *  if there is only one argument, the inputMin and inputMax 
		 *  	are determined by the smallest and largest values of the array.
		 *  @return {array<number>} an array of the same size 
		 */
		normalizeArray : function(){
			var input = arguments[0];
			var args = Array.prototype.slice.call(arguments, 0);
			if (args.length === 1){
				args[1] = Math.min.apply(Math, input);
				args[2] = Math.max.apply(Math, input);
			}
			return applyToArray(input, args, TERP.normalize);
		},
		/**
		 *  interpolate over a timeline of numbers
		 */
		scaleTimeline : function(){
			var timeline;
			var progress = arguments[0];
			if (arguments.length === 2){
				timeline = arguments[1];
			} else if (arguments.length === 4){
				//normalize the progress
				progress = TERP.normalize(progress, arguments[1], arguments[2]);
				timeline = arguments[3];
			} else {
				console.error("scaleTimeline takes 2 or 4 arguments");
			}
			//find the values to scale between
			var timelineLen = timeline.length - 1;
			var betweenMin = Math.floor(progress * timelineLen);
			var betweenMax = betweenMin + 1;
			return TERP.scale(progress, betweenMin / timelineLen, betweenMax / timelineLen, timeline[betweenMin], timeline[betweenMax]);
		}
	};

	return TERP;
}));