/**
 * Created by zhangqing on 2016/6/30.
 */
module.exports = {
	mergeConfig : function(){
		var allConfig = Array.prototype.slice.call(arguments);
		var config = {};
		_.each(allConfig,function(c){
			config = _.extend(config,c);
		});
		return config;
	}
};