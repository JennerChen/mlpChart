/**
 * Created by zhangqing on 2016/6/23.
 */
/** @type {object} 导出的图表 */
var exportChart = require('./charts');
/** @type {object} 对图表的一些工具 */
var utils = require('./util');
require('./css/style.less');
/**
 * @param  {string} params.wrapContainer chart外部div
 * @param  {string} params.id chart的id, 如果不指定, 则会默认生成一个id
 * @param  {Array} params.dataset chart数据
 */
module.exports = function(params) {
	if (typeof d3 === "undefined") {
		console.error("缺少d3.js");
		return;
	}
	
	if (typeof _ === "undefined") {
		console.error("缺少工具类, underscore.js");
		return;
	}
	var chart = _.extend({}, exportChart);
	var
		dataset = [],
		wrapContainer = null,
		svgContainer = null,
		defContainer = null,
		chartId = params.id ? params.id : _.now();

	function drawSvgContainer() {
		var widthString = wrapContainer.style('width'),
			heightString = wrapContainer.style('height'),
			width = Number(widthString.split('px')[0]),
			height = Number(heightString.split('px')[0]);
		svgContainer = wrapContainer.append('svg').attr({
			id: "mlpChart-" + chartId,
			width: widthString,
			height: heightString,
			class: 'mlpChart'
		});
		defContainer = svgContainer.append('defs');
	}
	if (params && params.wrapContainer && d3.select(params.wrapContainer).node()) {
		wrapContainer = d3.select(params.wrapContainer);
		drawSvgContainer();
	} else {
		console.error("no container, 缺少必要参数");
		return;
	}
	chart.utils = utils;
	chart.config = {
		dataset: dataset,
		wrapContainer: wrapContainer,
		svgContainer: svgContainer,
		defContainer: defContainer,
		chartId: chartId
	};
	chart.api = null;
	return chart;
};
module.exports.utils = utils;
module.exports.VERSION = __VERSION__;
module.exports.D3VERSION = d3.version;