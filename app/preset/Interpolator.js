define(["TERP", "controller/Mediator"], function(TERP, Mediator){

	"use strict";

	/**
	 *  the array of presets to interpolate between
	 *  @param {Array.<Object>} presetarray
	 */
	var Interpolator = function(presetarray, type, exponent){
		this.presetarray = presetarray;
		this.exponent = exponent || 1;
		this.type = type || "smooth";
		if (this.presetarray.length < 2){
			throw new Error("Interpolator needs more than 1 argument in the array");
		}

		// Mediator.route("scroll", this._onupdate.bind(this));
		//start at 50%
		// this._onupdate(0.5);
	};

	/**
	 *  given a position between 0-1, returns the interpolated object
	 *  @param  {number} position
	 *  @return {Object}          the interpolated values
	 */
	Interpolator.prototype.get = function(position){
		if (this.type === "smooth"){
			var posA = Math.floor(position);
			var posB = Math.ceil(position);
			var amount = position - posA;
			return this.interpolateBetweenObjects(amount, this.presetarray[posA], this.presetarray[posB], this.exponent);
		} else if (this.type === "step"){
			var pos = Math.floor(position * this.presetarray.length);
			return this.presetarray[pos];
		}
	};

	/**
	 *  interpolate between the two nearest objects
	 *  sets the results to the value
	 */
	Interpolator.prototype._onupdate = function(position){
		/*if (this.type === "smooth" || this.type === "exponential"){
			var posA = Math.floor(position);
			var posB = Math.ceil(position);
			var amount = position - posA;
			this.value = this.interpolateBetweenObjects(amount, this.presetarray[posA], this.presetarray[posB], this.exponent);
		} else if (this.type === "step"){
			var pos = Math.floor(position * this.presetarray.length);
			this.value = this.presetarray[pos];
		}*/
	};

	/**
	 *  interpolate between two objects
	 *  assumes both objects have the same properties and types
	 *  @private
	 *  @param {number} amount the amount of interpolation (between 0-1)
	 *  @param  {Object} A 
	 *  @param  {Object} B 
	 *  @return {Object}  
	 */
	Interpolator.prototype.interpolateBetweenObjects = function(amount, A, B, exponent){
		var ret = {};
		for (var attr in A){
			//interpolate between the two
			var propA = A[attr];
			var propB = B[attr];
			if (typeof propA === "number"){
				ret[attr] = TERP.scale(amount, propA, propB, exponent); 
			} else if (Array.isArray(propA)){
				var len = propA.length;
				var retArr = new Array(len);
				for (var i = 0; i < len; i++){
					retArr[i] = TERP.scale(amount, propA[i], propB[i], exponent); 
				}
				ret[attr] = retArr; 
			} else if (typeof propA === "object"){
				ret[attr] = this.interpolateBetweenObjects(amount, propA, propB, exponent);
			}
		}
		return ret;
	};

	/**
	 *  clean up
	 */
	Interpolator.prototype.dispose = function(){
		this.presetarray = null;
	};

	return Interpolator;
});