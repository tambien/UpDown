/* global dat */

dat.GUI.prototype.getFolder = function(folderName, parent){
	if (!parent){
		parent = this;
	}
	if (parent.__folders[folderName]){
		return parent.__folders[folderName];
	} else {		
		var folder = parent.addFolder(folderName);
		folder.open();
		return folder;
	}
};

dat.GUI.prototype.addCheckbox = function(folderName, title, current, onchange){
	var folder = this.getFolder(folderName);
	var obj = {};
	obj[title] = current;
	folder.add(obj, title)
		.onChange(onchange);
};

dat.GUI.prototype.addVolumeSlider = function(folderName, title, vol, min, max){
	var folder = this.getFolder(folderName);
	min = min || -100;
	max = max || 6;
	var obj = {};
	var currentValue = vol.gainToDb(vol.output.gain.value);
	obj[title] = currentValue;
	folder.add(obj, title, min, max)
		.onChange(function(val){
			vol.setVolume(val);
		});
	/*addCheckbox(folderName, "mute", false, function(muted){
		if (muted){
			vol.setVolume(-1000);
		} else {
			var preVolume = obj[title];
			vol.setVolume(preVolume);
		}
	});*/
};

dat.GUI.prototype.addTone = function(){
	var topLevel, name, tone, initial;
	if (arguments.length === 3){
		name = arguments[0];
		tone = arguments[1];
		initial = arguments[2];
		topLevel = this;
	} else {
		var folderName = arguments[0];
		name = arguments[1];
		tone = arguments[2];
		initial = arguments[3];
		topLevel = this.getFolder(folderName);
	}
	this._addSubTone(name, topLevel, tone, initial);
	//set the values initially
	tone.set(initial);
};

dat.GUI.prototype._addSubTone = function(folderName, parent, tone, obj){
	var folder = this.getFolder(folderName, parent);
	for (var param in obj){
		var val = obj[param];
		if (typeof val === "object"){
			var childTone = tone[param];
			this._addSubTone(param, folder, childTone, val);
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
};

/**
 *  enums
 */
dat.GUI.prototype.Types = {
	StartMethod : "StartMethod",
	OscillatorTypes : ["sine", "square", "triangle", "sawtooth"],
	OmniOscillatorTypes : ["sine", "square", "triangle", "sawtooth", "pwm", "pulse"],
};

/*function addPresets(folderName, presets){
	var folder = getFolder(folderName);
	folder.addFolder("presets")
}*/