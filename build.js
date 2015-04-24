{
	"baseUrl" : "./app", 
	"name": "../deps/almond",
    "include": ["UpDown"],
    "out": "UpDown-build.js",
	"paths" : {
		"text" : "../deps/text",
		"domReady" : "../deps/domReady",
		"jquery" : "../deps/jquery-2.1.1.min",
		"jquery.mousewheel" : "../deps/jquery.mousewheel",
		"TERP" : "../deps/TERP",
		"Tone" : "../../Tone.js/Tone",
		"TWEEN" : "../deps/tween.min",
		"Stats" : "../deps/Stats",
		"requestAnimationFrame" : "../deps/requestAnimationFrame",
		"dat" : "../deps/dat.gui",
		"THREE" : "../deps/three.min",
		"fragment" : "../fragment"
	},
	"shim" : {
		"dat" : {
			"exports" : "dat"
		},
		"TWEEN" : {
			"exports" : "TWEEN"
		},
		"Stats" : {
			"exports" : "Stats"
		},
		"THREE" : {
			"exports" : "THREE"
		}
	}
}