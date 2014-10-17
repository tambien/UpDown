define(["interface/Scroll", "interface/Window", "jquery", "controller/Mediator"], 
function(Scroll, Window, $, Mediator){

	"use strict";

	var frameCount = 3;

	var FrameController = function(){
		this.frameContainer = $("<div>", {"id" : "FrameContainer"}).appendTo(Window.container);
		this.frames = [];
		//make the frames
		for (var i = 0; i < frameCount; i++){
			var f = new Frame(this.frameContainer, i);
			f.scroll(i);
			this.frames.push(f);
		}

		Mediator.route("rawscroll", this.scroll.bind(this));
	};

	FrameController.prototype.scroll = function(position) {
		var amount = position * 200;
		amount = amount % frameCount;
		for (var i = 0; i < frameCount; i++){
			this.frames[i].scroll(amount);
		}
	};

	FrameController.prototype.dispose = function(){

	};

	/**
	 *  frame helper class
	 */
	var Frame = function(container, offset){
		this.element = $("<div>", {"class" : "Frame"}).appendTo(container);
		this.content = $("<div>", {"id" : "Content"}).appendTo(this.element);
		this.offset = offset + 0.425;
	};

	Frame.prototype.position = function(y) {
		var translateString = ["translate3d(-50%, ", y, "%, 0)"].join("");
		this.element.css({
			"transform" : translateString
		});
	};

	Frame.prototype.scroll = function(position) {
		position = (this.offset + position) % frameCount;
		var y = 100*(position);
		var translateString = ["translate3d(0%, ", y, "%, 0)"].join("");
		this.element.css({
			"transform" : translateString
		});	
	};

	return new FrameController();
});