define(function(){
	
	/**
	 * MicroEvent - to make any js object an event emitter (server or browser)
	 * 
	 * - pure javascript - server compatible, browser compatible
	 * - dont rely on the browser doms
	 * - super simple - you get it immediatly, no mistery, no magic involved
	 *
	 * - create a MicroEventDebug with goodies to debug
	 *   - make it safer to use
	*/

	var MicroEvent	= function(){};

	MicroEvent.prototype	= {
		route	: function(event, fct){
			this._events = this._events || {};
			this._events[event] = this._events[event]	|| [];
			this._events[event].push(fct);
		},
		unroute	: function(event, fct){
			this._events = this._events || {};
			if( event in this._events === false  )	return;
			this._events[event].splice(this._events[event].indexOf(fct), 1);
		},
		send	: function(event /* , args... */){
			this._events = this._events || {};
			if( event in this._events === false  )	return;
			for(var i = 0; i < this._events[event].length; i++){
				this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
			}
		},
		deferSend	: function(event /* , args... */){
			this._events = this._events || {};
			if( event in this._events === false  )	return;
			var self = this;
			setTimeout(function(){
				for(var i = 0; i < self._events[event].length; i++){
					self._events[event][i].apply(self, Array.prototype.slice.call(arguments, 1));
				}
			}, 1);
		}
	};

	var Mediator = new MicroEvent();

	//////////////////////////////////////////////////////////////////////////
	//	UPDATE LOOPS
	///////////////////////////////////////////////////////////////////////////

	var slowUpdateRate = 250;
	var presetUpdateRate = 500;

	function slowUpdateLoop(){
		setTimeout(slowUpdateLoop, slowUpdateRate);
		Mediator.send("slowUpdate", slowUpdateRate);
	}

	function presetUpdateLoop(){
		setTimeout(presetUpdateLoop, presetUpdateRate);
		Mediator.send("presetUpdate", presetUpdateRate);
	}

	slowUpdateLoop();
	presetUpdateLoop();

	return Mediator;
});