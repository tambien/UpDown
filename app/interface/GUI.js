define(["dat", "Tone/signal/Signal", "Tone/core/Tone", "Tone/source/Oscillator", 
	"Tone/source/OmniOscillator", "Tone/source/Noise", "Tone/component/Filter", "Tone/instrument/PolySynth"], 
	function(dat, Signal, Tone, Oscillator, OmniOscillator, Noise, Filter, PolySynth){

	var GUI = new dat.GUI();

	function getFolder(folder, parent){
		parent = parent || GUI;
		if (parent.__folders[folder]){
			return parent.__folders[folder];
		} else {		
			return parent.addFolder(folder);
		}
	}

	function addTone2(folder, name, tone, attributes){
		var topLevel = getFolder(name, folder);
		attributes = attributes || Object.keys(tone.get());
		var controllers = [];
		for (var i = 0; i < attributes.length; i++){
			var attr = attributes[i];
			if (tone[attr] instanceof Signal || tone[attr] instanceof AudioParam) {
				controllers.push(topLevel.addSignal(tone, attr));
			} else if (tone[attr] instanceof Tone){
				controllers = controllers.concat(addTone2(topLevel, attr, tone[attr]).controllers);
			} else if (attr === "type"){
				controllers.push(addTypeDropDown(topLevel, tone));
			} else {
				controllers.push(topLevel.add(tone, attr));
			}
		}
		return {
			listen : function(){
				for (var i = 0 ; i < controllers.length; i++){
					controllers[i].listen();
				}
			},
			controllers : controllers
		};
	}

	function addTypeDropDown(folder, tone){
		if (tone instanceof OmniOscillator){
			return folder.add(tone, "type", ["sine", "square", "triangle", "sawtooth", "pwm", "pulse"]);
		} else if (tone instanceof Oscillator){
			return folder.add(tone, "type", ["sine", "square", "triangle", "sawtooth"]);
		} else if (tone instanceof Filter){
			return folder.add(tone, "type", ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "notch", "allpass", "peaking"]);
		} else if (tone instanceof Noise){
			return folder.add(tone, "type", ["brown", "white", "pink"]);
		}
	}

	// function addSlider(folder, node, attr, min, max, onchange){
	// 	var guid = getFolder(folder, title);
	// 	if ()
	// }

	function addSignal(folderName, title, signal){
		/*var folder = getFolder(folderName, GUI);
		var obj = {};
		obj[title] = current;
		folder.add(obj, title)
			.onChange(function(val){
				signal.setValue(val);
			});*/
	}

	function addCheckbox(folder, title, current, onchange){
		var obj = {};
		obj[title] = current;
		folder.add(obj, title)
			.onChange(onchange);
	}

	function addVolumeSlider(folder, title, vol, min, max){
		min = min || -40;
		max = max || 6;
		var currentValue = vol.value;
		folder.add(vol, "value", min, max).name(title);
		addCheckbox(folder, "mute", false, function(muted){
			if (muted){
				currentValue = vol.value;
				vol.value = -1000;
			} else {
				vol.value = currentValue;
			}
		});
	}

	function addDropDown(folderName, title, options, onchange){

	}

	function addTone(folderName, name, tone, initial){
		/*var topLevel = getFolder(folderName, GUI);
		addSubTone(name, topLevel, tone, initial);
		//add an print button
		var folder = getFolder(name, topLevel);
		folder.add({
			"print" : function(){
				console.log(JSON.stringify(initial, undefined, "\t"));
			}
		}, "print");
		//set the values initially
		tone.set(initial);*/
	}


	function addObject(folder, name, obj){
		var topLevel = getFolder(name, folder);
		for (var param in obj){
			var gui = topLevel.add(obj, param);
		}
	}

	/*function addSubTone(folderName, parent, tone, obj){
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
	}*/

	return {
		GUI : GUI,
		getFolder : getFolder,
		addSlider : function(){},
		addDropDown : addDropDown,
		addTone : addTone,
		addTone2 : addTone2,
		addVolumeSlider : addVolumeSlider,
		addCheckbox : addCheckbox,
		addObject : addObject,
		addSignal : addSignal
	};
});