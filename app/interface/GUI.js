define(["dat", "preset/GUIpreset"], function(dat, presets){

	var GUI = new dat.GUI({load : presets});

	var data = {};

	function getFolder(folder){
		if (!data[folder]){
			data[folder] = {
				folder : GUI.addFolder(folder),
				data : {}
			};
			// GUI.remember(data[folder].data);
		}
		return data[folder];
	}

	function addSlider(folderName, title, current, min, max, onchange){
		var folder = getFolder(folderName);
		folder.data[title] = current;
		folder.folder.add(folder.data, title, min, max)
			.onChange(onchange);
	}

	function addColor(folderName, title, color, onchange){

	}

	function addDropDown(folderName, title, options, onchange){

	}

	return {
		GUI : GUI,
		addSlider : addSlider,
		addColor : addColor,
		addDropDown : addDropDown
	};
});