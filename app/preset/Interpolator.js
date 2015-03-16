define(["TERP", "controller/Mediator", "controller/Conductor", "util/Config"], 
	function(TERP, Mediator, Conductor, Config){

	"use strict";

	/**
	 *  the array of presets to interpolate between
	 *  @param {Array.<Object>} presetarray
	 */
	var Interpolator = function(presetarray, name, GUI){
		this.presetarray = presetarray.slice(0).reverse();
		if (this.presetarray.length < 2){
			throw new Error("Interpolator needs more than 1 argument in the array");
		}
		//start at 50%
		this._hasChanged = true;
		this.position = 0.5;
		this._stepWisePosition = 0;
		Mediator.route("scroll", this._onupdate.bind(this));
		//add it to the gui
		if (Config.GUI && GUI && GUI.addPreset){
			GUI.addPreset(name, presetarray);
		}
		this._updateFunc = null;
		Mediator.route("Movement", function(){
			this._hasChanged = true;
			this._onupdate(this.position);
		}.bind(this));
	};

	/**
	 *  given a position between 0-1, returns the interpolated object
	 *  @return {Object}          the interpolated values
	 */
	Interpolator.prototype.get = function(){
		var position = this.position;
		position *= (this.presetarray.length - 1);
		var posA = Math.floor(position);
		var posB = Math.ceil(position);
		var amount = position - posA;
		return this.interpolateBetweenObjects(amount, this.presetarray[posA], this.presetarray[posB]);
	};

	/**
	 *  interpolate between the two nearest objects
	 *  sets the results to the value
	 */
	Interpolator.prototype._onupdate = function(pos){
		this._hasChanged = true;
		this.position = pos;
		if (this._updateFunc !== null){
			this._updateFunc(this.get(pos));
		}
	};

	/**
	 *  if the value has changed, invoke the callback func
	 *  with the new preset value
	 *  @param  {function} func 
	 */
	Interpolator.prototype.update = function(func, force){
		if (this._hasChanged || force){
			this._hasChanged = false;
			func(this.get(this.position));
		}
	};

	/**
	 *  when the value has changed, invoke the callback func
	 *  with the new preset value
	 *  @param  {function} func 
	 */
	Interpolator.prototype.onupdate = function(func){
		this._updateFunc = func;
		//call it initially
		// this._updateFunc(this.get(this.position));
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
	Interpolator.prototype.interpolateBetweenObjects = function(amount, A, B){
		var ret = {};
		for (var attr in A){
			//interpolate between the two
			var propA = A[attr];
			var propB = B[attr];
			if (typeof propA === "number"){
				ret[attr] = TERP.scale(amount, propA, propB); 
			} else if (Array.isArray(propA)){
				var len = propA.length;
				var retArr = new Array(len);
				var bTransition = Conductor.getBTransitionProgress();
				var movement = Conductor.getMovement();
				// if (Conductor.getMovement() === 1)
				var i;
				if (movement !== 1){
					for (i = 0; i < len; i++){
						retArr[i] = TERP.scale(amount, propA[i], propB[i]); 
					}
					if (bTransition > 0 && movement === 0){
						for (i = 0; i < len; i++){
							retArr[i] = TERP.scale(bTransition, retArr[i], 1);
						}
					}
				} else {
					retArr = [1, 1, 1];
				}
				ret[attr] = retArr; 
			} else if (typeof propA === "object"){
				ret[attr] = this.interpolateBetweenObjects(amount, propA, propB);
			} else {
				ret[attr] = amount < 0.5 ? propA : propB;
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