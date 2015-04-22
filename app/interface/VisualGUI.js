define(["dat", "util/Config"], function(dat, Config){

	var VISUALS;
	if (Config.GUI){
		 VISUALS = new dat.GUI();
	}

	function makeFolder(title, parent){
		return parent.addFolder(title);
	}

	//drop in an array
	function addPresets(title, presets){
		var topFolder = makeFolder(title, VISUALS);
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
			if(Array.isArray(child)){
				addColor(folder, param, child);
			} else if (typeof child === "object"){
				addObject(folder, param, child);
			} else {
				folder.add(obj, param);
			}
		}
	}

	function hexToRgb(hex) {
	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? [
	        parseInt(result[1], 16),
	        parseInt(result[2], 16),
	        parseInt(result[3], 16)
	    ] : null;
	}

	function addColor(folder, title, color){
		var obj = {};
		var colorCopy = [];
		for (var i = 0; i < color.length; i++){
			colorCopy[i] = (1 - color[i])*255;
		}
		obj[title] = colorCopy;
		folder.addColor(obj, title)
			.onChange(function(val){
				if (typeof val === "string"){
					val = hexToRgb(val);
				} 
				var closedColor = color;
				for (var i = 0; i < closedColor.length; i++){
					closedColor[i] = 1 - val[i]/255;
				}		
			});
	}

	return {
		GUI : VISUALS,
		addPreset : addPresets,
	};
});