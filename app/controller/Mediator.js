define(["requestAnimationFrame", "util/Config"], function(requestAnimationFrame, Config){
	
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
			var args = Array.prototype.slice.call(arguments, 1);
			setTimeout(function(){
				for(var i = 0; i < this._events[event].length; i++){
					this._events[event][i].apply(this, args);
				}
			}.bind(this), 1);
		}
	};

	var Mediator = new MicroEvent();

	//////////////////////////////////////////////////////////////////////////
	//	UPDATE LOOPS
	///////////////////////////////////////////////////////////////////////////

	var slowUpdateRate = Config.SLOW_UPDATE * 1000;

	function slowUpdateLoop(){
		setTimeout(slowUpdateLoop, slowUpdateRate);
		Mediator.send("slowUpdate", slowUpdateRate);
	}

	function update(){
		requestAnimationFrame(update);
		Mediator.send("update");
	}

	function mobileUpdate(){
		setTimeout(mobileUpdate, 30);
		Mediator.send("update");
	}

	slowUpdateLoop();
	if (Config.MOBILE){
		mobileUpdate();
	} else {
		update();
	}

	return Mediator;
});