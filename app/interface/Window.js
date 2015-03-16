define(["jquery"], function($){

	var width = $(window).width();
	var height = $(window).height();

	$(window).resize(function(){
		width = $(window).width();
		height = $(window).height();
	});

	var container = $("#Container");

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