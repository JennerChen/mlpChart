/**
 * Created by zhangqing on 2016/6/30.
 */
module.exports = {
	chartApiList:[],
	getApiByChartId: function(chartId){
		var chartApiList = this.chartApiList;
		return _.find(chartApiList,function(c){
			return c.config.chartId == chartId;
		});
	},
	getApiBySvgId: function(svgId){
		var chartApiList = this.chartApiList;
		return _.find(chartApiList, function(c){
			return c.config.svgContainer.attr('id') === svgId;
		});
	}
};