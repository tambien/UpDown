var webpack = require("webpack");

module.exports = {
	"context": __dirname,
	entry: {
		"updown" : "app/UpDown"
	},
	output: {
		filename: "./build/[name].js",
		chunkFilename: "./build/[id].js",
		sourceMapFilename : "[file].map",
	},
	resolve: {
		root: __dirname,
		modulesDirectories : ["app", "deps", "style", "fragment", "../../Tone.js/"],
		alias : {
			"TWEEN" : "tween.min",
			"dat" : "dat.gui",
			"jquery" : "jquery-2.1.1.min",
			"THREE" : "three.min-r71",
			"THREEShaders" : "three.shader.min"
		}
	},
	plugins: [
		new webpack.ResolverPlugin([
			new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])], ["normal", "loader"]),
		new webpack.optimize.UglifyJsPlugin(),
	   ],
	 module: {
		loaders: [
			{
				test: /\.scss$/,
				loader: "style!css!autoprefixer!sass"
			},
			{
				test: /\.html$/,
				loader: "html"
			},
			{
				test: /\.(frag|vert)$/,
				loader: "raw"
			},
			{
				test: /\.png$/,
				loader: "url-loader",
				query: { mimetype: "image/png" }
			}
		]
	},
	// devtool: "#cheap-source-map"
};