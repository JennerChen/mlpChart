/**
 * Created by zhangqing on 2016/6/18.
 */
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

var config = require('./webpack.config.js');
var serverAddress = "127.0.0.1";
var serverPort = "1288";
var server = serverAddress+":"+serverPort;
config.entry.unshift("webpack-dev-server/client?http://"+serverAddress+":"+serverPort+"/"
	, "webpack/hot/dev-server"
);
config.plugins.unshift(new webpack.HotModuleReplacementPlugin());
new WebpackDevServer(webpack(config),{
	publicPath:config.output.publicPath,
	hot:true,
	proxy: {
		'/': {
			target: server,
			secure: false,
			bypass: function (req, res, proxyOptions) {
				return '/index.html';
//				if (req.headers.accept.indexOf('html') !== -1) {
//					console.log('Skipping proxy for browser request.');
//
//				}
			}
		}
	},
	stats: { colors: true }
}).listen(serverPort,serverAddress,function(err){
	if(err){
		console.log(err);
	}
	console.log('listening at %s  :) ',server);
});