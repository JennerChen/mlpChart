var webpack = require('webpack');
var path = require('path');
// 该插件将webpack不会将css直接插入页面中,而是提取到设定的css文件中
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var argv = require('yargs').argv;

var libraryName = "mlpChart";
var outputFileName;

var plugins = [new webpack.ProvidePlugin({
	$: "jquery",
	jQuery: "jquery",
	"window.jQuery": "jquery",
	d3: "d3",
	"window.d3": "d3"
}), new ExtractTextPlugin("style.css", {
	allChunks: true
}), new webpack.NoErrorsPlugin()];
if (argv.mode === 'release') {
	outputFileName = libraryName + ".min.js";
	plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
} else {
	outputFileName = libraryName + ".js";
}
module.exports = {
	entry: [
		'./src/index.js'
	],
	resolve: {
		// 当require时,下列字符不用写后缀
		extensions: ['', '.js', '.md', '.txt', '.jsx', '.json']
	},
	output: {
		path: __dirname + "/lib/",
		filename: outputFileName,
		publicPath: '/lib/',
		library: libraryName,
		libraryTarget: 'umd',
		umdNamedDefine: true
	},
	devtool: "#cheap-module-source-map",
	module: {
		loaders: [{
			test: [/\.js$/, /\.jsx$/],
			loader: 'babel-loader',
			query: {
				presets: ['es2015', 'react']
			}
		}, {
			test: [/\.html$/, /\.htm$/],
			loader: 'html-loader'
		}, {
			test: [/\.json$/],
			loader: 'json-loader'
		}, {
			test: /\.less$/,
			loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
		}, {
			test: /\.css$/,
			loader: ExtractTextPlugin.extract("style-loader", "css-loader")

		}, {
			test: /\.(png|jpg)$/,
			loader: 'url-loader?limit=8192&name=/[path][name].[ext]'
		}]
	},
	externals: {
		"jquery": "jQuery",
		"underscore": "_",
		"d3": "d3"
	},
	plugins: plugins
};
