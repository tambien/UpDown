define(["jquery"], function($){

	var width = $(window).width();
	var height = $(window).height();

	$(window).resize(function(){
		width = $(window).width();
		height = $(window).height();
	});

	var container = $("#Container");

	return {
		width : function(){
			return width;
		},
		height : function(){
			return height;
		},
		container : container
	};
});