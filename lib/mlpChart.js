(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("d3"));
	else if(typeof define === 'function' && define.amd)
		define("mlpChart", ["d3"], factory);
	else if(typeof exports === 'object')
		exports["mlpChart"] = factory(require("d3"));
	else
		root["mlpChart"] = factory(root["d3"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/lib/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(d3) {'use strict';

	/**
	 * Created by zhangqing on 2016/6/23.
	 */
	/** @type {object} 导出的图表 */
	var exportChart = __webpack_require__(3);
	/** @type {object} 对图表的一些工具 */
	var utils = __webpack_require__(5);
	/**
	 * @param  {string} params.wrapContainer chart外部div
	 * @param  {string} params.id chart的id, 如果不指定, 则会默认生成一个id
	 * @param  {Array} params.dataset chart数据
	 */
	module.exports = function (params) {
		if (typeof d3 === "undefined") {
			console.error("缺少d3.js");
			return;
		}

		if (typeof _ === "undefined") {
			console.error("缺少工具类, underscore.js");
			return;
		}
		var chart = _.extend({}, exportChart);
		var dataset = [],
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
	module.exports.VERSION = "1.0.0";
	module.exports.D3VERSION = d3.version;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * 导出的图表
	 */
	module.exports = {
	  realTimeLineChart: __webpack_require__(4)
		};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(d3) {"use strict";

	/**
	 * @param { mlpChart } this 
	 * @return { mlpChart } this
	 */
	var realTimeLineChart = function realTimeLineChart() {
		var api = {};
		/** @type { mlpChart } 使用 _this 代替 this */
		var _this = this;
		var realTimeLineChartParams = Array.prototype.slice.call(arguments)[0] ? Array.prototype.slice.call(arguments)[0] : {};
		var commonConfig = {
			dataReady: realTimeLineChartParams.dataset ? true : false,
			/** @type {Array} 图表距离上左下右的距离 */
			margin: [10, 10, 10, 0],
			/** @type {Array} 坐标轴距离上左下右的距离 */
			axisMargin: [0, 20, 20, 0],
			maxNode: 20,
			/** @type {Function} path颜色函数 */
			color: d3.scale.category10(),
			updateAnimationTime: 2000
		};
		var config = _this.utils.mergeConfig.call(_this, _this.config, commonConfig, realTimeLineChartParams);

		function processData() {
			var ds = config.dataset;
		}
		/** @type {object} 内部chart变量 */
		var chartApi = null;
		function draw() {
			var svgContainer = config.svgContainer,
			    defContainer = config.defContainer,
			    dataset = config.dataset,
			    svgContainerProperties = _this.utils.svgContainerProperties.call(_this),
			    margin = config.margin,
			    chartWidth = svgContainerProperties.w - (margin[1] + margin[3]),
			    chartHeight = svgContainerProperties.h - (margin[0] + margin[2]),
			    axisMargin = config.axisMargin,
			    color = config.color,
			    maxNode = config.maxNode;
			function axisDomain() {
				//draw chart axis, => x
				var xFunc = d3.scale.linear().domain([0, maxNode - 1]).range([0, chartWidth]);

				var allData = [0];
				_.each(dataset, function (d) {
					allData = allData.concat(d.data);
				});
				var yFunc = d3.scale.linear().domain([0, d3.max(allData) * 1.1]).range([chartHeight - axisMargin[2], 0]);
				return {
					x: xFunc,
					y: yFunc,
					xaxis: d3.svg.axis().scale(xFunc).orient("bottom").ticks(5),
					yaxis: d3.svg.axis().scale(yFunc).orient("right").ticks(5)
				};
			}
			if (!config.dataReady) {
				processData();
			}

			var chart = svgContainer.append('g').attr('class', 'chartWrap').attr("transform", "translate(" + margin[0] + "," + margin[1] + ")");
			//draw chart background
			chart.append('rect').attr({
				width: chartWidth,
				height: chartHeight,
				x: 0,
				y: 0,
				fill: 'transparent',
				class: 'mlpChart-bg'
			});
			/** @type {object} x,y轴 domain */
			var axis = axisDomain();

			chart.append('g').attr({
				'class': 'x axis',
				'transform': "translate(0," + axis.y(0) + ")"
			}).call(axis.xaxis);

			chart.append('g').attr({
				'class': 'y axis',
				'transform': "translate(" + axis.x(0) + ",0)"
			}).call(axis.yaxis);
			//draw clip
			var clipUniqueId = 'clip_' + _.uniqueId();
			defContainer.append('clipPath').attr({
				"id": clipUniqueId
			}).append('rect').attr({
				height: chartHeight,
				width: chartWidth,
				x: 1
			});

			var line = d3.svg.line().x(function (d, i) {
				return axis.x(i);
			}).y(function (d, i) {
				return axis.y(d);
			});
			var chartContent = chart.append('g').attr({
				'class': 'chartContent',
				"clip-path": "url(#" + clipUniqueId + ")"
			});

			chartContent.selectAll('g.entity').data(dataset).enter().append('g').attr({
				class: 'entity'
			}).append('path').attr({
				d: function d(_d, i) {
					return line(_d.data);
				},
				'stroke': function stroke(d, i) {
					return color(i);
				},
				'fill': 'none',
				'stroke-width': '2px',
				'opacity': 0.8
			}).on('mouseover', function () {
				d3.select(this).attr({
					"stroke-width": '4px',
					'opacity': 1
				});
			}).on('mouseout', function () {
				d3.select(this).attr({
					"stroke-width": '2px',
					'opacity': 0.8
				});
			});

			chartContent.selectAll('g.entity').each(function (d, i) {
				d3.select(this).selectAll('circle').data(d.data).enter().append('circle').attr({
					r: 3,
					cx: function cx(cd, ci) {
						return axis.x(ci);
					},
					cy: function cy(cd, ci) {
						return axis.y(cd);
					},
					fill: color(i)
				});
			});

			function update() {
				var newDs = config.dataset;
				axis = axisDomain();
				chartContent.selectAll('g.entity').data(newDs).select('path').attr({
					d: function d(_d2, i) {
						return line(_d2.data);
					}
				});

				chartContent.selectAll('g.entity').each(function (d, i) {
					d3.select(this).selectAll('circle').data(d.data).attr({
						cx: function cx(cd, ci) {
							return axis.x(ci);
						},
						cy: function cy(cd, ci) {
							return axis.y(cd);
						}
					});
				});
				animation();
			}
			function animation() {
				chart.select('.y.axis').transition().duration(500).call(axis.yaxis);

				chart.select('.x.axis').transition().duration(500).call(axis.xaxis);

				chartContent.selectAll('g.entity').attr('transform', "translate(0,0)").transition().duration(config.updateAnimationTime - 30).ease("linear").attr("transform", "translate(" + axis.x(-1) + ",0)").each('end', function (d, i) {
					if (d.data.length > maxNode) {
						d.data.shift();
					}
				});
			}
			chartApi = {
				update: update
			};
			return _this;
		}
		function update(increaseData) {
			// increaseData = [(Math.random()*100).toFixed(4),(Math.random()*100).toFixed(4)]
			if (!chartApi) {
				return;
			}
			var dataset = config.dataset;
			if (increaseData.length != dataset.length) {
				return;
			}
			_.each(increaseData, function (d, i) {
				dataset[i].data.push(d);
			});
			chartApi.update();
		}

		function getConfig() {
			return config;
		}

		function setConfig(newConfig) {
			newConfig = newConfig ? newConfig : {};
			config = _.extend({}, config, newConfig);
		}
		_this.api = {
			getConfig: getConfig,
			setConfig: setConfig,
			draw: draw,
			update: update
		};
		return _this;
	};
	module.exports = realTimeLineChart;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
		mergeConfig: function mergeConfig() {
			var allConfig = Array.prototype.slice.call(arguments);
			var config = {};
			_.each(allConfig, function (c) {
				config = _.extend(config, c);
			});
			return config;
		},
		svgContainerProperties: function svgContainerProperties() {
			if (!this.config) {
				return;
			}
			var svgContainer = this.config.svgContainer;
			var widthString = svgContainer.style('width'),
			    heightString = svgContainer.style('height'),
			    width = Number(widthString.split('px')[0]),
			    height = Number(heightString.split('px')[0]);
			return {
				w: width,
				h: height,
				widthString: widthString,
				heightString: heightString
			};
		}
		};

/***/ }
/******/ ])
});
;
//# sourceMappingURL=mlpChart.js.map