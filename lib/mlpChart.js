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
	var utils = __webpack_require__(14);
	var i18n = __webpack_require__(20);
	__webpack_require__(23);
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
		utils.chartApiList.push(chart);
		return chart;
	};
	module.exports.utils = utils;
	module.exports.VERSION = ("1.0,0");
	module.exports.D3VERSION = d3.version;
	module.exports.LANGUAGE = i18n;
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

	/* WEBPACK VAR INJECTION */(function(d3) {'use strict';

	/**
	 * @param { mlpChart } this
	 * @return { mlpChart } this
	 */
	var tooltip = __webpack_require__(5);
	__webpack_require__(7);
	var realTimeLineChart = function realTimeLineChart() {
		var axisUtil = __webpack_require__(8);
		var legend = __webpack_require__(9);
		var _this = this;
		var realTimeLineChartParams = Array.prototype.slice.call(arguments)[0] ? Array.prototype.slice.call(arguments)[0] : {};
		var commonConfig = {
			/** @type {boolean} 如果传入参数含有dataset, 那么不进行数据处理, 否则处理数据以符合当前的图表(该种情况通常用于从父api中传入的参数) */
			dataReady: realTimeLineChartParams.dataset ? true : false,
			/** @type {Array} 图表距离上左下右的距离 */
			margin: [10, 10, 10, 0],
			/** @type {Array} 坐标轴距离上左下右的距离 */
			axisMargin: [0, 20, 20, 0],
			/** @type {Number} 最多显示多少个节点,当大于该节点时,会开启动画,执行 movingChart方法 */
			maxNode: 20,
			/** @type {Number} 动画时间 */
			updateAnimationTime: 2000,
			/** @type {Function} path颜色函数 */
			color: d3.scale.category10(),
			/** @type {boolean} 是否显示tooltip */
			tooltip: true,
			/** @type {Number} y轴最大值间距 */
			yPadding: 1.1,
			/** @type {Boolean} 是否显示legend */
			legend: true,
			/** @type {String} legend的位置 */
			legendPosition: "zs",
			/** @type { String} legend的摆放方式 */
			legendOriention: "vertical"
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
			    maxNode = config.maxNode,
	
			/** @type {object} x,y轴 api */
			axis = null,
	
			/** @type {boolean} 是否开启x轴的动画 */
			xAxisAnimation = false,
			    legendApi = null;

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

			function drawLegend() {
				var domain_legend = [],
				    range_legend = [];
				_.map(dataset, function (d, i) {
					domain_legend.push(d.name);
					range_legend.push(color(i));
				});
				legendApi = legend.defaultLegend.call(chart, {
					type: 'ordinal',
					position: config.legendPosition,
					scale_domain: domain_legend,
					scale_range: range_legend,
					classPrefix: 'realTimeLine',
					orient: config.legendOriention,
					// transOffset: [40,10],
					cellclick: function cellclick(name) {
						if (d3.select(this).classed('hide')) {
							d3.select(this).classed('hide', false);
							chartContent.selectAll('g.entity').each(function (d) {
								if (d.name === name) {
									d3.select(this).style('opacity', "1");
								}
							});
						} else {
							d3.select(this).classed('hide', true);
							chartContent.selectAll('g.entity').each(function (d) {
								if (d.name === name) {
									d3.select(this).style('opacity', "0.1");
								}
							});
						}
					},
					cellover: function cellover(name) {
						chartContent.selectAll('g.entity').each(function (d) {
							if (d.name === name) {
								lineMouseover.call(this);
							}
						});
					},
					cellout: function cellout(name) {
						chartContent.selectAll('g.entity').each(function (d) {
							if (d.name === name) {
								lineMouseout.call(this);
							}
						});
					}
				});
			}

			function axisDomain(mode) {
				var allData = [];
				_.each(dataset, function (d) {
					allData = allData.concat(d.data);
				});
				var domain_x = [_.min(allData, function (d) {
					return d.x;
				}).x, _.max(allData, function (d) {
					return d.x;
				}).x];
				xAxisAnimation = allData.length / dataset.length > maxNode;
				// 因为要保证部分元素在界面以外, 故当超过maxNode的长度时必须扩大坐标轴范围
				var xaxisWidth = chartWidth + chartWidth * (xAxisAnimation ? 1 / maxNode : 0);

				var domain_y = [0, _.max(allData, function (d) {
					return d.y;
				}).y * config.yPadding];
				var axisConfig = {
					domainX: domain_x,
					domainY: domain_y,
					rangeX: [0, xaxisWidth],
					rangeY: [chartHeight - axisMargin[2], 0],
					tickFormat: [function (d) {
						return _this.utils.dateFormat(d);
					}, null],
					animation: [xAxisAnimation ? function (el) {
						el.transition().duration(config.updateAnimationTime - 30).ease("linear").call(axis.xaxis);
					} : null, function (el) {
						el.transition().duration(500).call(axis.yaxis);
					}]
				};
				return mode === 'update' ? axis.api.updateAxis(axisConfig) : axisUtil.call(chart, axisConfig);
			}

			if (config.legend) {
				drawLegend();
			}

			axis = axisDomain();
			axis.api.drawAxis({
				xAttr: {
					'transform': "translate(0," + axis.y(0) + ")"
				},
				yAttr: {
					'transform': "translate(" + 0 + ",0)"
				}
			});

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
				return axis.x(d.x);
			}).y(function (d, i) {
				return axis.y(d.y);
			});
			var chartContent = chart.append('g').attr({
				'class': 'chartContent',
				"clip-path": "url(#" + clipUniqueId + ")"
			});

			chartContent.selectAll('g.entity').data(dataset).enter().append('g').attr({
				class: 'entity'
			}).on('mouseover', lineMouseover).on('mouseout', lineMouseout).append('path').attr({
				d: function d(_d, i) {
					return line(_d.data);
				},
				'stroke': function stroke(d, i) {
					return color(i);
				},
				'fill': 'none',
				'stroke-width': '2px',
				'opacity': 0.8
			});
			drawOrUpdatePoints();

			function lineMouseout() {
				d3.select(this).select('path').attr({
					"stroke-width": '2px',
					'opacity': 0.8
				});
				d3.select(this).selectAll('circle').attr('r', 3);
			}

			function lineMouseover() {
				d3.select(this).select('path').attr({
					"stroke-width": '4px',
					'opacity': 0.9
				});
				d3.select(this).selectAll('circle').attr('r', 5);
			}

			function drawOrUpdatePoints() {
				var tip = null;

				chartContent.selectAll('g.entity').each(function (d, i) {
					var currentEntity = d3.select(this).selectAll('circle').data(d.data);
					currentEntity.attr({
						cx: function cx(cd, ci) {
							return axis.x(cd.x);
						},
						cy: function cy(cd, ci) {
							return axis.y(cd.y);
						},
						cursor: 'pointer'
					}).enter().append('circle').attr({
						r: 3,
						cx: function cx(cd, ci) {
							return axis.x(cd.x);
						},
						cy: function cy(cd, ci) {
							return axis.y(cd.y);
						},
						fill: color(i)
					}).on('mouseover', function (d) {
						if (config.tooltip) {
							tip = tooltip().attr('class', 'd3-tip').html(function (d) {
								var output = "";
								_.map(d.tip, function (v, k) {
									output += "<div style='margin: 3px 0;'>" + k + " : " + v + "</div>";
								});
								return output;
							}).offset(function (d) {
								return [-10, 0];
							});
							chartContent.call(tip);
							tip.show(d);
						}
					}).on('mouseout', function () {
						if (config.tooltip && tip) {
							tip.destroy();
						}
					});
					currentEntity.exit().remove();
				});
			}

			function update() {
				axis = axisDomain('update');
				chartContent.selectAll('g.entity').data(config.dataset).select('path').attr({
					d: function d(_d2, i) {
						return line(_d2.data);
					}
				});
				drawOrUpdatePoints();
				if (xAxisAnimation) {
					movingChart();
				}
			}

			function movingChart() {
				chartContent.selectAll('g.entity').attr('transform', "translate(0,0)").transition().duration(config.updateAnimationTime - 30) //减少一些动画时间
				.ease("linear").attr("transform", "translate(" + -chartWidth / (maxNode - 1) + ",0)") //标度尺比可显示区域大 1/maxNode, 故需要手动减去一份
				.each('end', function (d, i) {
					while (d.data.length > maxNode) {
						d.data.shift();
					}
				});
			}
			/**
	   * 移除chart中所有元素
	   * @return {[type]} [description]
	   */
			function remove() {
				chart.remove();
				axis = null;
				legendApi = null;
			}

			chartApi = {
				update: update,
				legendApi: legendApi,
				remove: remove
			};
			return _this;
		}

		function update(increaseData) {
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
			return this;
		}
		function redraw() {
			if (chartApi) {
				chartApi.remove();
			}
			return draw();
		}
		function resize() {
			if (chartApi) {
				redraw();
			}
			return this;
		}
		function getConfig() {
			return config;
		}

		function setConfig(newConfig) {
			newConfig = newConfig ? newConfig : {};
			config = _.extend({}, config, newConfig);
			return this;
		}

		_this.api = {
			draw: draw,
			update: update,
			redraw: redraw,
			resize: resize,
			getConfig: getConfig,
			setConfig: setConfig
		};
		return _this;
	};
	module.exports = realTimeLineChart;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(d3) {'use strict';

	__webpack_require__(6);
	// d3.tip
	// Copyright (c) 2013 Justin Palmer
	//
	// Tooltips for d3.js SVG visualizations
	// redesign by zhang qing
	/**
	 * @author zhang qing
	 * @return {function} tooltip api
	 */
	module.exports = function () {
		var direction = d3_tip_direction,
		    offset = d3_tip_offset,
		    html = d3_tip_html,
		    node = initNode(),
		    svg = null,
		    point = null,
		    target = null;

		function tip(vis) {
			svg = getSVGNode(vis);
			point = svg.createSVGPoint();
			document.body.appendChild(node);
		}

		// Public - show the tooltip on the screen
		//
		// Returns a tip
		tip.show = function () {
			var args = Array.prototype.slice.call(arguments);
			if (args[args.length - 1] instanceof SVGElement) {
				target = args.pop();
			}

			var content = html.apply(this, args),
			    dir = direction.apply(this, args),
			    poffset = offset.apply(this, args),
			    nodel = getNodeEl(),
			    i = directions.length,
			    coords,
			    scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
			    scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;

			nodel.html(content).style({
				opacity: 1,
				'pointer-events': 'all'
			});

			while (i--) {
				nodel.classed(directions[i], false);
			}
			coords = direction_callbacks.get(dir).call(this, nodel);
			nodel.classed(dir, true).style({
				top: coords.top + poffset[0] + scrollTop + 'px',
				left: coords.left + poffset[1] + scrollLeft + 'px'
			});

			return tip;
		};

		// Public - hide the tooltip
		//
		// Returns a tip
		tip.hide = function () {
			var nodel = getNodeEl();
			nodel.style({
				opacity: 0,
				'pointer-events': 'none'
			});
			return tip;
		};
		// Public: Proxy attr calls to the d3 tip container.  Sets or gets attribute value.
		//
		// n - name of the attribute
		// v - value of the attribute
		//
		// Returns tip or attribute value
		tip.attr = function (n, v) {
			if (arguments.length < 2 && typeof n === 'string') {
				return getNodeEl().attr(n);
			} else {
				var args = Array.prototype.slice.call(arguments);
				d3.selection.prototype.attr.apply(getNodeEl(), args);
			}

			return tip;
		};

		// Public: Proxy style calls to the d3 tip container.  Sets or gets a style value.
		//
		// n - name of the property
		// v - value of the property
		//
		// Returns tip or style property value
		tip.style = function (n, v) {
			if (arguments.length < 2 && typeof n === 'string') {
				return getNodeEl().style(n);
			} else {
				var args = Array.prototype.slice.call(arguments);
				d3.selection.prototype.style.apply(getNodeEl(), args);
			}

			return tip;
		};

		// Public: Set or get the direction of the tooltip
		//
		// v - One of n(north), s(south), e(east), or w(west), nw(northwest),
		//     sw(southwest), ne(northeast) or se(southeast)
		//
		// Returns tip or direction
		tip.direction = function (v) {
			if (!arguments.length) {
				return direction;
			}
			direction = v == null ? v : d3.functor(v);

			return tip;
		};

		// Public: Sets or gets the offset of the tip
		//
		// v - Array of [x, y] offset
		//
		// Returns offset or
		tip.offset = function (v) {
			if (!arguments.length) {
				return offset;
			}
			offset = v == null ? v : d3.functor(v);
			return tip;
		};

		// Public: sets or gets the html value of the tooltip
		//
		// v - String value of the tip
		//
		// Returns html value or tip
		tip.html = function (v) {
			if (!arguments.length) {
				return html;
			}
			html = v == null ? v : d3.functor(v);

			return tip;
		};
		tip.getNodeEl = function () {
			return getNodeEl();
		};
		// Public: destroys the tooltip and removes it from the DOM
		//
		// Returns a tip
		tip.destroy = function () {
			if (node) {
				getNodeEl().remove();
				node = null;
			}
			return tip;
		};

		function d3_tip_direction() {
			return 'n';
		}

		function d3_tip_offset() {
			return [0, 0];
		}

		function d3_tip_html() {
			return ' ';
		}

		var direction_callbacks = d3.map({
			n: direction_n,
			s: direction_s,
			e: direction_e,
			w: direction_w,
			nw: direction_nw,
			ne: direction_ne,
			sw: direction_sw,
			se: direction_se
		}),
		    directions = direction_callbacks.keys();

		function direction_n() {
			var bbox = getScreenBBox();
			return {
				top: bbox.n.y - node.offsetHeight,
				left: bbox.n.x - node.offsetWidth / 2
			};
		}

		function direction_s() {
			var bbox = getScreenBBox();
			return {
				top: bbox.s.y,
				left: bbox.s.x - node.offsetWidth / 2
			};
		}

		function direction_e() {
			var bbox = getScreenBBox();
			return {
				top: bbox.e.y - node.offsetHeight / 2,
				left: bbox.e.x
			};
		}

		function direction_w() {
			var bbox = getScreenBBox();
			return {
				top: bbox.w.y - node.offsetHeight / 2,
				left: bbox.w.x - node.offsetWidth
			};
		}

		function direction_nw() {
			var bbox = getScreenBBox();
			return {
				top: bbox.nw.y - node.offsetHeight,
				left: bbox.nw.x - node.offsetWidth
			};
		}

		function direction_ne() {
			var bbox = getScreenBBox();
			return {
				top: bbox.ne.y - node.offsetHeight,
				left: bbox.ne.x
			};
		}

		function direction_sw() {
			var bbox = getScreenBBox();
			return {
				top: bbox.sw.y,
				left: bbox.sw.x - node.offsetWidth
			};
		}

		function direction_se() {
			var bbox = getScreenBBox();
			return {
				top: bbox.se.y,
				left: bbox.e.x
			};
		}

		function initNode() {
			var node = d3.select(document.createElement('div'));
			node.style({
				position: 'absolute',
				top: 0,
				opacity: 0,
				'pointer-events': 'none',
				'box-sizing': 'border-box'
			});

			return node.node();
		}

		function getSVGNode(el) {
			el = el.node();
			if (el.tagName.toLowerCase() === 'svg') {
				return el;
			}

			return el.ownerSVGElement;
		}

		function getNodeEl() {
			if (node === null) {
				node = initNode();
				// re-add node to DOM
				document.body.appendChild(node);
			}
			return d3.select(node);
		}

		// Private - gets the screen coordinates of a shape
		//
		// Given a shape on the screen, will return an SVGPoint for the directions
		// n(north), s(south), e(east), w(west), ne(northeast), se(southeast), nw(northwest),
		// sw(southwest).
		//
		//    +-+-+
		//    |   |
		//    +   +
		//    |   |
		//    +-+-+
		//
		// Returns an Object {n, s, e, w, nw, sw, ne, se}
		function getScreenBBox() {
			var targetel = target || d3.event.target;

			while ('undefined' === typeof targetel.getScreenCTM && 'undefined' === targetel.parentNode) {
				targetel = targetel.parentNode;
			}

			var bbox = {},
			    matrix = targetel.getScreenCTM(),
			    tbbox = targetel.getBBox(),
			    width = tbbox.width,
			    height = tbbox.height,
			    x = tbbox.x,
			    y = tbbox.y;
			point.x = x;
			point.y = y;
			bbox.nw = point.matrixTransform(matrix);
			point.x += width;
			bbox.ne = point.matrixTransform(matrix);
			point.y += height;
			bbox.se = point.matrixTransform(matrix);
			point.x -= width;
			bbox.sw = point.matrixTransform(matrix);
			point.y -= height / 2;
			bbox.w = point.matrixTransform(matrix);
			point.x += width;
			bbox.e = point.matrixTransform(matrix);
			point.x -= width / 2;
			point.y -= height / 2;
			bbox.n = point.matrixTransform(matrix);
			point.y += height;
			bbox.s = point.matrixTransform(matrix);
			return bbox;
		}

		return tip;
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 6 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 7 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(d3) {"use strict";

	var axisUtil = function axisUtil() {
		/**
	  * @param axis.api {{}} 坐标轴绘制等暴露的方法
	  * */
		var axis = {};
		// 当前为 d3元素
		var _this = this;
		if (_this.empty()) {
			console.warn("can't find element to append axis, don't generate axis!");
		}
		var commonConfig = {
			/** @type {Array} x,y坐标轴最多显示多少坐标 */
			ticks: [5, 5],
			/** @tpye {Array} x,y 坐标轴 内容方向 */
			orient: ["bottom", "right"],
			/** @type {Array} x,y format函数 */
			tickFormat: [null, null],
			/** @type {string} 坐标轴类型 */
			axisType: "linear",
			/** @type {string} x坐标轴样式*/
			xClass: "x axis",
			/** @type {string} y坐标轴样式*/
			yClass: "y axis",
			/** @type {object} x坐标轴其他属性*/
			xAttr: {},
			/** @type {object} y坐标轴其他属性*/
			yAttr: {},
			/** @type {Array} x,y坐标轴是否进行动画*/
			animation: [null, null]

		};
		var axisParams = Array.prototype.slice.call(arguments)[0] ? Array.prototype.slice.call(arguments)[0] : {};
		var config = _.extend({}, commonConfig, axisParams);
		function switchAxisType() {
			switch (config.axisType) {
				case "linear":
					linearAxis();
					break;

			}
		}
		function linearAxis() {
			var domain_x = config.domainX,
			    domain_y = config.domainY,
			    range_x = config.rangeX,
			    range_y = config.rangeY;
			var xFunc = d3.scale.linear().domain(domain_x).range(range_x);

			var yFunc = d3.scale.linear().domain(domain_y).range(range_y);

			axis.x = xFunc;
			axis.y = yFunc;
			axis.xaxis = d3.svg.axis().scale(xFunc).orient(config.orient[0]).ticks(config.ticks[0]).tickFormat(config.tickFormat[0]);
			axis.yaxis = d3.svg.axis().scale(yFunc).orient(config.orient[1]).ticks(config.ticks[1]).tickFormat(config.tickFormat[1]);
		}

		function drawAxis() {
			var attrParams = Array.prototype.slice.call(arguments)[0] ? Array.prototype.slice.call(arguments)[0] : {};

			_this.append('g').attr('class', config.xClass).attr(attrParams.xAttr ? _.extend(config.xAttr, attrParams.xAttr) : config.xAttr).call(axis.xaxis);

			_this.append('g').attr('class', config.yClass).attr(attrParams.yAttr ? _.extend(config.yAttr, attrParams.yAttr) : config.yAttr).call(axis.yaxis);

			return axis;
		}
		function updateAxis() {
			var updateParams = Array.prototype.slice.call(arguments)[0] ? Array.prototype.slice.call(arguments)[0] : {};
			config = _.extend({}, config, updateParams);
			switchAxisType();
			var xaxisEl = _this.select("g." + _.compact(config.xClass.split(' ')).join('.'));
			var yaxisEl = _this.select("g." + _.compact(config.yClass.split(' ')).join('.'));
			if (config.animation[0]) {
				config.animation[0].call(axis, xaxisEl);
			} else {
				xaxisEl.call(axis.xaxis);
			}

			if (config.animation[1]) {
				config.animation[1].call(axis, yaxisEl);
			} else {
				yaxisEl.call(axis.yaxis);
			}
			return axis;
		}

		switchAxisType();
		axis.api = {
			drawAxis: drawAxis,
			updateAxis: updateAxis
		};
		return axis;
	};
	module.exports = axisUtil;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(d3) {'use strict';

	var legendColor = __webpack_require__(10);
	var legendSize = __webpack_require__(12);
	var legendSymbol = __webpack_require__(13);

	function defaultLegend() {
		var _this = this;
		var legendApi = {};
		if (_this.empty()) {
			return;
		}
		var commonConfig = {
			/** @type {String} legend位置 [s,x,z,y,zs,zx,ys,yx,m] s:上 x:下 z:左 y:右 zs:左上 zx:左下 ys:右上 yx右下 m中间*/
			//  zs-- s -- ys
			//   |   |    |
			//   z   m    y
			//   |   |    |
			//  zx-- x -- yx
			position: "zs",
			/** @type {String} 坐标的种类*/
			orient: 'vertical',
			/** @type {String} 摆放的方向*/
			type: 'ordinal',
			/** @type {Array} key值 */
			scale_domain: [],
			/** @type {Array} value值 */
			scale_range: [],
			shapePadding: 5,
			labelOffset: 5,
			transOffset: [0, 0],
			classPrefix: null,
			cellclick: null,
			cellover: null,
			cellout: null,
			legendClass: 'mlpLegend'
		};
		var legendParams = Array.prototype.slice.call(arguments)[0] ? Array.prototype.slice.call(arguments)[0] : {};
		var config = _.extend({}, commonConfig, legendParams);
		switch (config.type) {
			case 'ordinal':
				ordinalLegend();
				break;
			default:
				console.log('undefined type', config.type);
				break;
		}

		function ordinalLegend() {
			var ordinal = d3.scale.ordinal().domain(config.scale_domain).range(config.scale_range);

			var legendOrdinal = legendColor().shape("path", d3.svg.symbol().type("circle").size(150)()).shapePadding(config.shapePadding).labelOffset(config.labelOffset).classPrefix(config.classPrefix).orient(config.orient).scale(ordinal).on("cellclick", config.cellclick).on('cellover', config.cellover).on('cellout', config.cellout);
			_this.append("g").attr("class", config.legendClass).call(legendOrdinal);
			transPosition();
		}

		function transPosition() {
			var nodeMatrix = _this.node().getBBox(),
			    legendEl = _this.select('.' + config.legendClass),
			    legendElMatrix = legendEl.node().getBBox(),
			    tarnsX = config.transOffset[0],
			    transY = config.transOffset[1];
			switch (config.position) {
				case "zs":
					zs();
					break;
				case "s":
					s();
					break;
				case "ys":
					ys();
					break;
				case "z":
					z();
					break;
				case "m":
					m();
					break;
				case "y":
					y();
					break;
				case "zx":
					zx();
					break;
				case "x":
					x();
					break;
				case "yx":
					yx();
					break;
				default:
					zs();
					break;
			}

			function zs() {
				tarnsX += 50;
				transY += 10;
			}
			function s() {
				transY += 10;
				tarnsX += nodeMatrix.width / 2 - legendElMatrix.width / 2;
			}
			function ys() {
				tarnsX += -20;
				transY += 10;
				tarnsX += nodeMatrix.width - legendElMatrix.width;
			}
			function z() {
				tarnsX += 50;
				transY += nodeMatrix.height / 2 - legendElMatrix.height / 2;
			}
			function m() {
				tarnsX += nodeMatrix.width / 2 - legendElMatrix.width / 2;
				transY += nodeMatrix.height / 2 - legendElMatrix.height / 2;
			}
			function y() {
				tarnsX += -20;
				transY += nodeMatrix.height / 2 - legendElMatrix.height / 2;
				tarnsX += nodeMatrix.width - legendElMatrix.width;
			}
			function zx() {
				tarnsX += 50;
				transY += -40;
				transY += nodeMatrix.height - legendElMatrix.height;
			}
			function x() {
				transY += -40;
				tarnsX += nodeMatrix.width / 2 - legendElMatrix.width / 2;
				transY += nodeMatrix.height - legendElMatrix.height;
			}
			function yx() {
				tarnsX += -20;
				transY += -40;
				tarnsX += nodeMatrix.width - legendElMatrix.width;
				transY += nodeMatrix.height - legendElMatrix.height;
			}
			legendEl.attr("transform", "translate(" + tarnsX + "," + transY + ")");
		}
		legendApi.remove = function () {
			_this.select('.' + config.legendClass).remove();
		};
		return legendApi;
	}
	module.exports = {
		color: legendColor,
		size: legendSize,
		symbol: legendSymbol,
		defaultLegend: defaultLegend
		};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(d3) {"use strict";

	var helper = __webpack_require__(11);

	module.exports = function () {

	  var scale = d3.scale.linear(),
	      shape = "rect",
	      shapeWidth = 15,
	      shapeHeight = 15,
	      shapeRadius = 10,
	      shapePadding = 2,
	      cells = [5],
	      labels = [],
	      classPrefix = "",
	      useClass = false,
	      title = "",
	      labelFormat = d3.format(".01f"),
	      labelOffset = 10,
	      labelAlign = "middle",
	      labelDelimiter = "to",
	      orient = "vertical",
	      ascending = false,
	      path,
	      legendDispatcher = d3.dispatch("cellover", "cellout", "cellclick");

	  function legend(svg) {

	    var type = helper.d3_calcType(scale, ascending, cells, labels, labelFormat, labelDelimiter),
	        legendG = svg.selectAll('g').data([scale]);

	    legendG.enter().append('g').attr('class', classPrefix + 'legendCells');

	    var cell = legendG.selectAll("." + classPrefix + "cell").data(type.data),
	        cellEnter = cell.enter().append("g", ".cell").attr("class", classPrefix + "cell").style("opacity", 1e-6),
	        shapeEnter = cellEnter.append(shape).attr("class", classPrefix + "swatch"),
	        shapes = cell.select("g." + classPrefix + "cell " + shape);

	    //add event handlers
	    helper.d3_addEvents(cellEnter, legendDispatcher);

	    cell.exit().transition().style("opacity", 0).remove();

	    helper.d3_drawShapes(shape, shapes, shapeHeight, shapeWidth, shapeRadius, path);

	    helper.d3_addText(legendG, cellEnter, type.labels, classPrefix);

	    // sets placement
	    var text = cell.select("text"),
	        shapeSize = shapes[0].map(function (d) {
	      return d.getBBox();
	    });

	    //sets scale
	    //everything is fill except for line which is stroke,
	    if (!useClass) {
	      if (shape == "line") {
	        shapes.style("stroke", type.feature);
	      } else {
	        shapes.style("fill", type.feature);
	      }
	    } else {
	      shapes.attr("class", function (d) {
	        return classPrefix + "swatch " + type.feature(d);
	      });
	    }

	    var cellTrans,
	        textTrans,
	        textAlign = labelAlign == "start" ? 0 : labelAlign == "middle" ? 0.5 : 1;

	    //positions cells and text
	    if (orient === "vertical") {
	      cellTrans = function cellTrans(d, i) {
	        return "translate(0, " + i * (shapeSize[i].height + shapePadding) + ")";
	      };
	      textTrans = function textTrans(d, i) {
	        return "translate(" + (shapeSize[i].width + shapeSize[i].x + labelOffset) + "," + (shapeSize[i].y + shapeSize[i].height / 2 + 5) + ")";
	      };
	    } else if (orient === "horizontal") {
	      cellTrans = function cellTrans(d, i) {
	        return "translate(" + i * (shapeSize[i].width + shapePadding) + ",0)";
	      };
	      textTrans = function textTrans(d, i) {
	        return "translate(" + (shapeSize[i].width * textAlign + shapeSize[i].x) + "," + (shapeSize[i].height + shapeSize[i].y + labelOffset + 8) + ")";
	      };
	    }

	    helper.d3_placement(orient, cell, cellTrans, text, textTrans, labelAlign);
	    helper.d3_title(svg, legendG, title, classPrefix);

	    cell.transition().style("opacity", 1);
	  }

	  legend.scale = function (_) {
	    if (!arguments.length) return scale;
	    scale = _;
	    return legend;
	  };

	  legend.cells = function (_) {
	    if (!arguments.length) return cells;
	    if (_.length > 1 || _ >= 2) {
	      cells = _;
	    }
	    return legend;
	  };

	  legend.shape = function (_, d) {
	    if (!arguments.length) return shape;
	    if (_ == "rect" || _ == "circle" || _ == "line" || _ == "path" && typeof d === 'string') {
	      shape = _;
	      path = d;
	    }
	    return legend;
	  };

	  legend.shapeWidth = function (_) {
	    if (!arguments.length) return shapeWidth;
	    shapeWidth = +_;
	    return legend;
	  };

	  legend.shapeHeight = function (_) {
	    if (!arguments.length) return shapeHeight;
	    shapeHeight = +_;
	    return legend;
	  };

	  legend.shapeRadius = function (_) {
	    if (!arguments.length) return shapeRadius;
	    shapeRadius = +_;
	    return legend;
	  };

	  legend.shapePadding = function (_) {
	    if (!arguments.length) return shapePadding;
	    shapePadding = +_;
	    return legend;
	  };

	  legend.labels = function (_) {
	    if (!arguments.length) return labels;
	    labels = _;
	    return legend;
	  };

	  legend.labelAlign = function (_) {
	    if (!arguments.length) return labelAlign;
	    if (_ == "start" || _ == "end" || _ == "middle") {
	      labelAlign = _;
	    }
	    return legend;
	  };

	  legend.labelFormat = function (_) {
	    if (!arguments.length) return labelFormat;
	    labelFormat = _;
	    return legend;
	  };

	  legend.labelOffset = function (_) {
	    if (!arguments.length) return labelOffset;
	    labelOffset = +_;
	    return legend;
	  };

	  legend.labelDelimiter = function (_) {
	    if (!arguments.length) return labelDelimiter;
	    labelDelimiter = _;
	    return legend;
	  };

	  legend.useClass = function (_) {
	    if (!arguments.length) return useClass;
	    if (_ === true || _ === false) {
	      useClass = _;
	    }
	    return legend;
	  };

	  legend.orient = function (_) {
	    if (!arguments.length) return orient;
	    _ = _.toLowerCase();
	    if (_ == "horizontal" || _ == "vertical") {
	      orient = _;
	    }
	    return legend;
	  };

	  legend.ascending = function (_) {
	    if (!arguments.length) return ascending;
	    ascending = !!_;
	    return legend;
	  };

	  legend.classPrefix = function (_) {
	    if (!arguments.length) return classPrefix;
	    classPrefix = _;
	    return legend;
	  };

	  legend.title = function (_) {
	    if (!arguments.length) return title;
	    title = _;
	    return legend;
	  };

	  d3.rebind(legend, legendDispatcher, "on");

	  return legend;
		};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {

	  d3_identity: function d3_identity(d) {
	    return d;
	  },

	  d3_mergeLabels: function d3_mergeLabels(gen, labels) {

	    if (labels.length === 0) return gen;

	    gen = gen ? gen : [];

	    var i = labels.length;
	    for (; i < gen.length; i++) {
	      labels.push(gen[i]);
	    }
	    return labels;
	  },

	  d3_linearLegend: function d3_linearLegend(scale, cells, labelFormat) {
	    var data = [];

	    if (cells.length > 1) {
	      data = cells;
	    } else {
	      var domain = scale.domain(),
	          increment = (domain[domain.length - 1] - domain[0]) / (cells - 1),
	          i = 0;

	      for (; i < cells; i++) {
	        data.push(domain[0] + i * increment);
	      }
	    }

	    var labels = data.map(labelFormat);

	    return { data: data,
	      labels: labels,
	      feature: function feature(d) {
	        return scale(d);
	      } };
	  },

	  d3_quantLegend: function d3_quantLegend(scale, labelFormat, labelDelimiter) {
	    var labels = scale.range().map(function (d) {
	      var invert = scale.invertExtent(d),
	          a = labelFormat(invert[0]),
	          b = labelFormat(invert[1]);

	      // if (( (a) && (a.isNan()) && b){
	      //   console.log("in initial statement")
	      return labelFormat(invert[0]) + " " + labelDelimiter + " " + labelFormat(invert[1]);
	      // } else if (a || b) {
	      //   console.log('in else statement')
	      //   return (a) ? a : b;
	      // }
	    });

	    return { data: scale.range(),
	      labels: labels,
	      feature: this.d3_identity
	    };
	  },

	  d3_ordinalLegend: function d3_ordinalLegend(scale) {
	    return { data: scale.domain(),
	      labels: scale.domain(),
	      feature: function feature(d) {
	        return scale(d);
	      } };
	  },

	  d3_drawShapes: function d3_drawShapes(shape, shapes, shapeHeight, shapeWidth, shapeRadius, path) {
	    if (shape === "rect") {
	      shapes.attr("height", shapeHeight).attr("width", shapeWidth);
	    } else if (shape === "circle") {
	      shapes.attr("r", shapeRadius); //.attr("cx", shapeRadius).attr("cy", shapeRadius);
	    } else if (shape === "line") {
	        shapes.attr("x1", 0).attr("x2", shapeWidth).attr("y1", 0).attr("y2", 0);
	      } else if (shape === "path") {
	        shapes.attr("d", path);
	      }
	  },

	  d3_addText: function d3_addText(svg, enter, labels, classPrefix) {
	    enter.append("text").attr("class", classPrefix + "label");
	    svg.selectAll("g." + classPrefix + "cell text").data(labels).text(this.d3_identity);
	  },

	  d3_calcType: function d3_calcType(scale, ascending, cells, labels, labelFormat, labelDelimiter) {
	    var type = scale.ticks ? this.d3_linearLegend(scale, cells, labelFormat) : scale.invertExtent ? this.d3_quantLegend(scale, labelFormat, labelDelimiter) : this.d3_ordinalLegend(scale);

	    type.labels = this.d3_mergeLabels(type.labels, labels);

	    if (ascending) {
	      type.labels = this.d3_reverse(type.labels);
	      type.data = this.d3_reverse(type.data);
	    }

	    return type;
	  },

	  d3_reverse: function d3_reverse(arr) {
	    var mirror = [];
	    for (var i = 0, l = arr.length; i < l; i++) {
	      mirror[i] = arr[l - i - 1];
	    }
	    return mirror;
	  },

	  d3_placement: function d3_placement(orient, cell, cellTrans, text, textTrans, labelAlign) {
	    cell.attr("transform", cellTrans);
	    text.attr("transform", textTrans);
	    if (orient === "horizontal") {
	      text.style("text-anchor", labelAlign);
	    }
	  },

	  d3_addEvents: function d3_addEvents(cells, dispatcher) {
	    var _ = this;

	    cells.on("mouseover.legend", function (d) {
	      _.d3_cellOver(dispatcher, d, this);
	    }).on("mouseout.legend", function (d) {
	      _.d3_cellOut(dispatcher, d, this);
	    }).on("click.legend", function (d) {
	      _.d3_cellClick(dispatcher, d, this);
	    });
	  },

	  d3_cellOver: function d3_cellOver(cellDispatcher, d, obj) {
	    cellDispatcher.cellover.call(obj, d);
	  },

	  d3_cellOut: function d3_cellOut(cellDispatcher, d, obj) {
	    cellDispatcher.cellout.call(obj, d);
	  },

	  d3_cellClick: function d3_cellClick(cellDispatcher, d, obj) {
	    cellDispatcher.cellclick.call(obj, d);
	  },

	  d3_title: function d3_title(svg, cellsSvg, title, classPrefix) {
	    if (title !== "") {

	      var titleText = svg.selectAll('text.' + classPrefix + 'legendTitle');

	      titleText.data([title]).enter().append('text').attr('class', classPrefix + 'legendTitle');

	      svg.selectAll('text.' + classPrefix + 'legendTitle').text(title);

	      var yOffset = svg.select('.' + classPrefix + 'legendTitle').map(function (d) {
	        return d[0].getBBox().height;
	      })[0],
	          xOffset = -cellsSvg.map(function (d) {
	        return d[0].getBBox().x;
	      })[0];

	      cellsSvg.attr('transform', 'translate(' + xOffset + ',' + (yOffset + 10) + ')');
	    }
	  }
		};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(d3) {"use strict";

	var helper = __webpack_require__(11);

	module.exports = function () {

	  var scale = d3.scale.linear(),
	      shape = "rect",
	      shapeWidth = 15,
	      shapePadding = 2,
	      cells = [5],
	      labels = [],
	      useStroke = false,
	      classPrefix = "",
	      title = "",
	      labelFormat = d3.format(".01f"),
	      labelOffset = 10,
	      labelAlign = "middle",
	      labelDelimiter = "to",
	      orient = "vertical",
	      ascending = false,
	      path,
	      legendDispatcher = d3.dispatch("cellover", "cellout", "cellclick");

	  function legend(svg) {

	    var type = helper.d3_calcType(scale, ascending, cells, labels, labelFormat, labelDelimiter),
	        legendG = svg.selectAll('g').data([scale]);

	    legendG.enter().append('g').attr('class', classPrefix + 'legendCells');

	    var cell = legendG.selectAll("." + classPrefix + "cell").data(type.data),
	        cellEnter = cell.enter().append("g", ".cell").attr("class", classPrefix + "cell").style("opacity", 1e-6),
	        shapeEnter = cellEnter.append(shape).attr("class", classPrefix + "swatch"),
	        shapes = cell.select("g." + classPrefix + "cell " + shape);

	    //add event handlers
	    helper.d3_addEvents(cellEnter, legendDispatcher);

	    cell.exit().transition().style("opacity", 0).remove();

	    //creates shape
	    if (shape === "line") {
	      helper.d3_drawShapes(shape, shapes, 0, shapeWidth);
	      shapes.attr("stroke-width", type.feature);
	    } else {
	      helper.d3_drawShapes(shape, shapes, type.feature, type.feature, type.feature, path);
	    }

	    helper.d3_addText(legendG, cellEnter, type.labels, classPrefix);

	    //sets placement
	    var text = cell.select("text"),
	        shapeSize = shapes[0].map(function (d, i) {
	      var bbox = d.getBBox();
	      var stroke = scale(type.data[i]);

	      if (shape === "line" && orient === "horizontal") {
	        bbox.height = bbox.height + stroke;
	      } else if (shape === "line" && orient === "vertical") {
	        bbox.width = bbox.width;
	      }

	      return bbox;
	    });

	    var maxH = d3.max(shapeSize, function (d) {
	      return d.height + d.y;
	    }),
	        maxW = d3.max(shapeSize, function (d) {
	      return d.width + d.x;
	    });

	    var cellTrans,
	        textTrans,
	        textAlign = labelAlign == "start" ? 0 : labelAlign == "middle" ? 0.5 : 1;

	    //positions cells and text
	    if (orient === "vertical") {

	      cellTrans = function cellTrans(d, i) {
	        var height = d3.sum(shapeSize.slice(0, i + 1), function (d) {
	          return d.height;
	        });
	        return "translate(0, " + (height + i * shapePadding) + ")";
	      };

	      textTrans = function textTrans(d, i) {
	        return "translate(" + (maxW + labelOffset) + "," + (shapeSize[i].y + shapeSize[i].height / 2 + 5) + ")";
	      };
	    } else if (orient === "horizontal") {
	      cellTrans = function cellTrans(d, i) {
	        var width = d3.sum(shapeSize.slice(0, i + 1), function (d) {
	          return d.width;
	        });
	        return "translate(" + (width + i * shapePadding) + ",0)";
	      };

	      textTrans = function textTrans(d, i) {
	        return "translate(" + (shapeSize[i].width * textAlign + shapeSize[i].x) + "," + (maxH + labelOffset) + ")";
	      };
	    }

	    helper.d3_placement(orient, cell, cellTrans, text, textTrans, labelAlign);
	    helper.d3_title(svg, legendG, title, classPrefix);

	    cell.transition().style("opacity", 1);
	  }

	  legend.scale = function (_) {
	    if (!arguments.length) return scale;
	    scale = _;
	    return legend;
	  };

	  legend.cells = function (_) {
	    if (!arguments.length) return cells;
	    if (_.length > 1 || _ >= 2) {
	      cells = _;
	    }
	    return legend;
	  };

	  legend.shape = function (_, d) {
	    if (!arguments.length) return shape;
	    if (_ == "rect" || _ == "circle" || _ == "line") {
	      shape = _;
	      path = d;
	    }
	    return legend;
	  };

	  legend.shapeWidth = function (_) {
	    if (!arguments.length) return shapeWidth;
	    shapeWidth = +_;
	    return legend;
	  };

	  legend.shapePadding = function (_) {
	    if (!arguments.length) return shapePadding;
	    shapePadding = +_;
	    return legend;
	  };

	  legend.labels = function (_) {
	    if (!arguments.length) return labels;
	    labels = _;
	    return legend;
	  };

	  legend.labelAlign = function (_) {
	    if (!arguments.length) return labelAlign;
	    if (_ == "start" || _ == "end" || _ == "middle") {
	      labelAlign = _;
	    }
	    return legend;
	  };

	  legend.labelFormat = function (_) {
	    if (!arguments.length) return labelFormat;
	    labelFormat = _;
	    return legend;
	  };

	  legend.labelOffset = function (_) {
	    if (!arguments.length) return labelOffset;
	    labelOffset = +_;
	    return legend;
	  };

	  legend.labelDelimiter = function (_) {
	    if (!arguments.length) return labelDelimiter;
	    labelDelimiter = _;
	    return legend;
	  };

	  legend.orient = function (_) {
	    if (!arguments.length) return orient;
	    _ = _.toLowerCase();
	    if (_ == "horizontal" || _ == "vertical") {
	      orient = _;
	    }
	    return legend;
	  };

	  legend.ascending = function (_) {
	    if (!arguments.length) return ascending;
	    ascending = !!_;
	    return legend;
	  };

	  legend.classPrefix = function (_) {
	    if (!arguments.length) return classPrefix;
	    classPrefix = _;
	    return legend;
	  };

	  legend.title = function (_) {
	    if (!arguments.length) return title;
	    title = _;
	    return legend;
	  };

	  d3.rebind(legend, legendDispatcher, "on");

	  return legend;
		};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(d3) {"use strict";

	var helper = __webpack_require__(11);

	module.exports = function () {

	  var scale = d3.scale.linear(),
	      shape = "path",
	      shapeWidth = 15,
	      shapeHeight = 15,
	      shapeRadius = 10,
	      shapePadding = 5,
	      cells = [5],
	      labels = [],
	      classPrefix = "",
	      useClass = false,
	      title = "",
	      labelFormat = d3.format(".01f"),
	      labelAlign = "middle",
	      labelOffset = 10,
	      labelDelimiter = "to",
	      orient = "vertical",
	      ascending = false,
	      legendDispatcher = d3.dispatch("cellover", "cellout", "cellclick");

	  function legend(svg) {

	    var type = helper.d3_calcType(scale, ascending, cells, labels, labelFormat, labelDelimiter),
	        legendG = svg.selectAll('g').data([scale]);

	    legendG.enter().append('g').attr('class', classPrefix + 'legendCells');

	    var cell = legendG.selectAll("." + classPrefix + "cell").data(type.data),
	        cellEnter = cell.enter().append("g", ".cell").attr("class", classPrefix + "cell").style("opacity", 1e-6),
	        shapeEnter = cellEnter.append(shape).attr("class", classPrefix + "swatch"),
	        shapes = cell.select("g." + classPrefix + "cell " + shape);

	    //add event handlers
	    helper.d3_addEvents(cellEnter, legendDispatcher);

	    //remove old shapes
	    cell.exit().transition().style("opacity", 0).remove();

	    helper.d3_drawShapes(shape, shapes, shapeHeight, shapeWidth, shapeRadius, type.feature);
	    helper.d3_addText(legendG, cellEnter, type.labels, classPrefix);

	    // sets placement
	    var text = cell.select("text"),
	        shapeSize = shapes[0].map(function (d) {
	      return d.getBBox();
	    });

	    var maxH = d3.max(shapeSize, function (d) {
	      return d.height;
	    }),
	        maxW = d3.max(shapeSize, function (d) {
	      return d.width;
	    });

	    var cellTrans,
	        textTrans,
	        textAlign = labelAlign == "start" ? 0 : labelAlign == "middle" ? 0.5 : 1;

	    //positions cells and text
	    if (orient === "vertical") {
	      cellTrans = function cellTrans(d, i) {
	        return "translate(0, " + i * (maxH + shapePadding) + ")";
	      };
	      textTrans = function textTrans(d, i) {
	        return "translate(" + (maxW + labelOffset) + "," + (shapeSize[i].y + shapeSize[i].height / 2 + 5) + ")";
	      };
	    } else if (orient === "horizontal") {
	      cellTrans = function cellTrans(d, i) {
	        return "translate(" + i * (maxW + shapePadding) + ",0)";
	      };
	      textTrans = function textTrans(d, i) {
	        return "translate(" + (shapeSize[i].width * textAlign + shapeSize[i].x) + "," + (maxH + labelOffset) + ")";
	      };
	    }

	    helper.d3_placement(orient, cell, cellTrans, text, textTrans, labelAlign);
	    helper.d3_title(svg, legendG, title, classPrefix);
	    cell.transition().style("opacity", 1);
	  }

	  legend.scale = function (_) {
	    if (!arguments.length) return scale;
	    scale = _;
	    return legend;
	  };

	  legend.cells = function (_) {
	    if (!arguments.length) return cells;
	    if (_.length > 1 || _ >= 2) {
	      cells = _;
	    }
	    return legend;
	  };

	  legend.shapePadding = function (_) {
	    if (!arguments.length) return shapePadding;
	    shapePadding = +_;
	    return legend;
	  };

	  legend.labels = function (_) {
	    if (!arguments.length) return labels;
	    labels = _;
	    return legend;
	  };

	  legend.labelAlign = function (_) {
	    if (!arguments.length) return labelAlign;
	    if (_ == "start" || _ == "end" || _ == "middle") {
	      labelAlign = _;
	    }
	    return legend;
	  };

	  legend.labelFormat = function (_) {
	    if (!arguments.length) return labelFormat;
	    labelFormat = _;
	    return legend;
	  };

	  legend.labelOffset = function (_) {
	    if (!arguments.length) return labelOffset;
	    labelOffset = +_;
	    return legend;
	  };

	  legend.labelDelimiter = function (_) {
	    if (!arguments.length) return labelDelimiter;
	    labelDelimiter = _;
	    return legend;
	  };

	  legend.orient = function (_) {
	    if (!arguments.length) return orient;
	    _ = _.toLowerCase();
	    if (_ == "horizontal" || _ == "vertical") {
	      orient = _;
	    }
	    return legend;
	  };

	  legend.ascending = function (_) {
	    if (!arguments.length) return ascending;
	    ascending = !!_;
	    return legend;
	  };

	  legend.classPrefix = function (_) {
	    if (!arguments.length) return classPrefix;
	    classPrefix = _;
	    return legend;
	  };

	  legend.title = function (_) {
	    if (!arguments.length) return title;
	    title = _;
	    return legend;
	  };

	  d3.rebind(legend, legendDispatcher, "on");

	  return legend;
		};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var common = __webpack_require__(15);
	var apiHelper = __webpack_require__(16);
	var events = __webpack_require__(17);
	var elementHelper = __webpack_require__(18);
	var foramt = __webpack_require__(19);
	var i18n = __webpack_require__(20);
	module.exports = _.extend({}, common, apiHelper, events, elementHelper, foramt, i18n);

/***/ },
/* 15 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * Created by zhangqing on 2016/6/30.
	 */
	module.exports = {
		mergeConfig: function mergeConfig() {
			var allConfig = Array.prototype.slice.call(arguments);
			var config = {};
			_.each(allConfig, function (c) {
				config = _.extend(config, c);
			});
			return config;
		}
		};

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Created by zhangqing on 2016/6/30.
	 */
	module.exports = {
		chartApiList: [],
		getApiByChartId: function getApiByChartId(chartId) {
			var chartApiList = this.chartApiList;
			return _.find(chartApiList, function (c) {
				return c.config.chartId == chartId;
			});
		},
		getApiBySvgId: function getApiBySvgId(svgId) {
			var chartApiList = this.chartApiList;
			return _.find(chartApiList, function (c) {
				return c.config.svgContainer.attr('id') === svgId;
			});
		}
		};

/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Created by zhangqing on 2016/6/30.
	 */
	module.exports = {
		resize: function resize() {
			if (!this.config) {
				return;
			}
			var wrapContainer = this.config.wrapContainer,
			    svgContainer = this.config.svgContainer,
			    widthString = wrapContainer.style('width'),
			    heightString = wrapContainer.style('height');
			svgContainer.attr({
				width: widthString,
				heightString: heightString
			});
			if (this.api && this.api.resize) {
				this.api.resize();
			}
		}
		};

/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Created by zhangqing on 2016/6/30.
	 */
	module.exports = {
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

/***/ },
/* 19 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * Created by zhangqing on 2016/6/30.
	 */
	module.exports = {
		dateFormat: function dateFormat(d, mode) {
			var weekInfo = this.getI18N().weekInfo;
			var pattern = mode ? mode : "hh:mm:ss";
			var time = new Date(d);
			if (!time) {
				return;
			}
			var year = time.getFullYear(),
			    month = time.getMonth() + 1,
			    day = time.getDate(),
			    week = weekInfo["" + time.getDay()],
			    hour = time.getHours(),
			    minute = time.getMinutes(),
			    second = time.getSeconds(),
			    millSecond = time.getMilliseconds();

			month = month >= 10 ? month : "0" + month;
			day = day >= 10 ? day : "0" + day;
			hour = hour === 0 ? "00" : hour <= 9 ? "0" + hour : hour;
			minute = minute === 0 ? "00" : minute <= 9 ? "0" + minute : minute;
			second = second === 0 ? "00" : second <= 9 ? "0" + second : second;
			switch (mode) {
				case "yyyy-MM-dd hh:mm:ss":
					return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
				case "MM:dd hh:mm:ss":
					return month + ":" + day + " " + hour + ":" + minute + ":" + second;
				case "hh:mm:ss":
					return hour + ":" + minute + ":" + second;
				default:
					return hour + ":" + minute + ":" + second;
			}
		}
		};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * Created by zhangqing on 2016/6/30.
	 */
	var language = {
		"zh": __webpack_require__(21),
		"en": __webpack_require__(22)
	};
	module.exports = {
		i18n: "zh",
		getI18N: function getI18N(key) {
			var lan = this.i18n;
			return key ? language[lan][key] : language[lan];
		},
		setI18N: function setI18N(lan) {
			if (lan != this.i18n && language[lan]) {
				this.i18n = lan;
			}
		}
		};

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = {
		"weekInfo": {
			"0": "星期日",
			"1": "星期一",
			"2": "星期二",
			"3": "星期三",
			"4": "星期四",
			"5": "星期五",
			"6": "星期六"
		}
	};

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = {
		"weekInfo": {
			"0": "Sun",
			"1": "Mon",
			"2": "Tue",
			"3": "Wed",
			"4": "Thu",
			"5": "Fri",
			"6": "Sat"
		}
	};

/***/ },
/* 23 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ])
});
;
//# sourceMappingURL=mlpChart.js.map