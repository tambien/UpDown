define(["jquery", "domReady!", "util/Config", "controller/Mediator"], function($, doc, Config, Mediator){

	var container = $("#Container");

	if (Config.MOBILE){
		container.addClass("Mobile");
	}

	var width = container.width();
	var height = container.height();

	$(window).resize(function(){
		width = container.width();
		height = container.height();
	});


	// http://davidwalsh.name/javascript-debounce-function
	function debounce(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	}

	return {
		width : function(){
			return width;
		},
		height : function(){
			return height;
		},
		container : container,
		resize : function(callback){
			$(window).resize(debounce(function(){
				callback(width, height);
			}, 500));
		}
	};
});