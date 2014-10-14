define(function(){
	/**
	 *  extend the prototype of the child with 
	 *  the prototype of the parnet
	 *  @param  {function} child  
	 *  @param  {function} parent 
	 */
	return function(child, parent){
		function TempConstructor(){}
		TempConstructor.prototype = parent.prototype;
		child.prototype = new TempConstructor();
		/** @override */
		child.prototype.constructor = child;
	};
});