var fs = require("fs");

var files = fs.readdirSync(__dirname);

for (var i = 0; i < files.length; i++){
	var fl = files[i];
	if (fl !== "rename.js"){
		fs.renameSync(fl, fl.substr(12));
	}
}