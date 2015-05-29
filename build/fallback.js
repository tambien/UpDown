$(function(){
	var noSupport = $("<div>").attr("id", "NoSupport")
		.appendTo("body")
		.text("this interactive requires Web Audio and WebGL which you're browser does not support.");
});