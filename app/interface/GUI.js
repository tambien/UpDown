define(["dat"], function(dat){

	var GUI = new dat.GUI();

	function getFolder(folder, parent){
		if (parent.__folders[folder]){
			return parent.__folders[folder];
		} else {		
			return parent.addFolder(folder);
		}
	}

	function addSlider(folderName, title, current, min, max, onchange){
		var folder = getFolder(folderName, GUI);
		var obj = {};
		obj[title] = current;
		folder.add(obj, title, min, max)
			.onChange(onchange);
	}

	function addCheckbox(folderName, title, current, onchange){
		var folder = getFolder(folderName, GUI);
		var obj = {};
		obj[title] = current;
		folder.add(obj, title)
			.onChange(onchange);
	}

	function addVolumeSlider(folderName, title, vol, min, max){
		var folder = getFolder(folderName, GUI);
		min = min || -70;
		max = max || 0;
		var obj = {};
		var currentValue = vol.gainToDb(vol.output.gain.value);
		obj[title] = currentValue;
		folder.add(obj, title, min, max)
			.onChange(function(val){
				vol.setVolume(val);
			});
		addCheckbox(folderName, "mute", false, function(muted){
			if (muted){
				vol.setVolume(-1000);
			} else {
				var preVolume = obj[title];
				vol.setVolume(preVolume);
			}
		});
	}

	function addDropDown(folderName, title, options, onchange){

	}

	function addTone(folderName, name, tone, initial){
		var topLevel = getFolder(folderName, GUI);
		addSubTone(name, topLevel, tone, initial);
		//add an print button
		var folder = getFolder(name, topLevel);
		folder.add({
			"print" : function(){
				console.log(JSON.stringify(initial, undefined, "\t"));
			}
		}, "print");
		//set the values initially
		tone.set(initial);
	}

	function addObject(folderName, name, obj, onchange){
		var topLevel = getFolder(folderName, GUI);
		var folder = getFolder(name, topLevel);
		for (var param in obj){
			var gui = folder.add(obj, param);
			if (typeof onchange === "function"){
				gui.onChange(onchange);
			}
		}
	}

	function addSubTone(folderName, parent, tone, obj){
		var folder = getFolder(folderName, parent);
		for (var param in obj){
			var val = obj[param];
			if (typeof val === "object"){
				var childTone = tone[param];
				addSubTone(param, folder, childTone, val);
			} else {
				var changeFunction = "onChange";
				if (typeof val === "string"){
					changeFunction = "onFinishChange";
				}
				folder.add(obj, param)[changeFunction](function(){
						var attr = param;
						var attrObj = {};
						attrObj[attr] = obj[attr];
						return function(newVal){
							obj[attr] = newVal;
							attrObj[attr] = newVal;
							tone.set(attrObj);
						};
					}());
			}
		}
	}

	return {
		GUI : GUI,
		addSlider : addSlider,
		addDropDown : addDropDown,
		addTone : addTone,
		addVolumeSlider : addVolumeSlider,
		addCheckbox : addCheckbox,
		addObject : addObject
	};
});