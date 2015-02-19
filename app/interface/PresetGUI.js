define(["dat"], function(dat){

	var PRESETS;
	if (USE_GUI){
		 PRESETS = new dat.GUI();
	}

	function makeFolder(title, parent){
		return parent.addFolder(title);
	}

	//drop in an array
	function addPresets(title, presets, interpolator){
		var topFolder = makeFolder(title, PRESETS);
		//iterate over the preset, 
		for (var i = 0; i < presets.length; i++){
			var level = presets[i];
			addObject(topFolder, "Level "+i, level);
		}
		//add an print button
		topFolder.add({
			"print" : function(){
				console.log(JSON.stringify(presets, undefined, "\t"));
			}
		}, "print");
	}

	function addData(obj, name, value){
		obj[name] = value;
	}

	function addObject(parentFolder, name, obj){
		var folder = makeFolder(name, parentFolder);
		for (var param in obj){
			var child = obj[param];
			if (typeof child === "object"){
				addObject(folder, param, child);
			} else {
				folder.add(obj, param);
			}
		}
	}

	function addDisplay(parentFolder, interpolator){
		var folder = makeFolder("Display", parentFolder);
		interpolator.update(function(pre){
			
			/*for (var i in folder.__controllers) {
			   folder.__controllers[i].updateDisplay();
			 }*/
		});
		for (var param in obj){
			var child = obj[param];
			if (typeof child === "object"){
				addObject(folder, param, child);
			} else {
				folder.add(obj, param);
			}
		}
	}

	return {
		GUI : PRESETS,
		addPreset : addPresets,
	};
});