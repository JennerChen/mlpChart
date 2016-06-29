/**
 * @param { mlpChart } this
 * @return { mlpChart } this
 */
const tooltip = require('../tooltip');
var realTimeLineChart = function () {
	const axisUtil = require('../axis');
	const _this = this;
	var realTimeLineChartParams = Array.prototype.slice.call(arguments)[0] ? Array.prototype.slice.call(arguments)[0] : {};
	const commonConfig = {
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
		yPadding: 1.1
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
			xAxisAnimation;

		if (!config.dataReady) {
			processData();
		}

		var chart = svgContainer
			.append('g')
			.attr('class', 'chartWrap')
			.attr("transform", "translate(" + margin[0] + "," + margin[1] + ")");
		//draw chart background
		chart.append('rect')
			.attr({
				width: chartWidth,
				height: chartHeight,
				x: 0,
				y: 0,
				fill: 'transparent',
				class: 'mlpChart-bg'
			});
		function axisDomain(mode) {
			var allData = [];
			_.each(dataset, function (d) {
				allData = allData.concat(d.data);
			});
			var domain_x = [(_.min(allData, function (d) {
				return d.x;
			})).x, (_.max(allData, function (d) {
				return d.x;
			})).x];
			xAxisAnimation = allData.length / dataset.length > maxNode;
			// 因为要保证部分元素在界面以外, 故当超过maxNode的长度时必须扩大坐标轴范围
			var xaxisWidth = chartWidth + chartWidth * (xAxisAnimation ? 1 / maxNode : 0 );

			var domain_y = [0, (_.max(allData, function (d) {
				return d.y;
			})).y * config.yPadding];
			var axisConfig = {
				domainX: domain_x,
				domainY: domain_y,
				rangeX: [0, xaxisWidth],
				rangeY: [chartHeight - axisMargin[2], 0],
				tickFormat: [function (d) {
					return _this.utils.dateFormat(d);
				}, null],
				animation: [xAxisAnimation ? function (el) {
					el.transition()
						.duration(config.updateAnimationTime - 30)
						.ease("linear")
						.call(axis.xaxis);
				} : null, function (el) {
					el.transition()
						.duration(500)
						.call(axis.yaxis);
				}]
			};
			return mode === 'update' ? axis.api.updateAxis(axisConfig) : axisUtil.call(chart, axisConfig);
		}

		axis = axisDomain();
		axis.api.drawAxis({
			xAttr: {'transform': "translate(0," + axis.y(0) + ")"},
			yAttr: {'transform': "translate(" + 0 + ",0)"}
		});

		//draw clip
		var clipUniqueId = 'clip_' + _.uniqueId();
		defContainer.append('clipPath')
			.attr({
				"id": clipUniqueId
			})
			.append('rect')
			.attr({
				height: chartHeight,
				width: chartWidth,
				x: 1
			});

		var line = d3.svg.line()
			.x(function (d, i) {
				return axis.x(d.x);
			})
			.y(function (d, i) {
				return axis.y(d.y);
			});
		var chartContent = chart.append('g')
			.attr({
				'class': 'chartContent',
				"clip-path": "url(#" + clipUniqueId + ")"
			});
		
		chartContent
			.selectAll('g.entity')
			.data(dataset)
			.enter()
			.append('g')
			.attr({
				class: 'entity'
			})
			.on('mouseover', function () {
				d3.select(this)
					.select('path').attr({
					"stroke-width": '4px',
					'opacity': 0.9
				});
				d3.select(this)
					.selectAll('circle')
					.attr('r', 5);
			})
			.on('mouseout', function () {
				d3.select(this)
					.select('path').attr({
					"stroke-width": '2px',
					'opacity': 0.8
				});
				d3.select(this)
					.selectAll('circle')
					.attr('r', 3);
			})
			.append('path')
			.attr({
				d: function (d, i) {
					return line(d.data);
				},
				'stroke': function (d, i) {
					return color(i);
				},
				'fill': 'none',
				'stroke-width': '2px',
				'opacity': 0.8
			})
		;
		drawOrUpdatePoints();
		function drawOrUpdatePoints() {
			var tip = null;

			chartContent
				.selectAll('g.entity').each(function (d, i) {
				var currentEntity
					= d3.select(this)
					.selectAll('circle')
					.data(d.data);
				currentEntity
					.attr({
						cx: function (cd, ci) {
							return axis.x(cd.x);
						},
						cy: function (cd, ci) {
							return axis.y(cd.y);
						},
						cursor: 'pointer'
					})
					.enter()
					.append('circle')
					.attr({
						r: 3,
						cx: function (cd, ci) {
							return axis.x(cd.x);
						},
						cy: function (cd, ci) {
							return axis.y(cd.y);
						},
						fill: color(i)
					})
					.on('mouseover', function (d) {
						if (config.tooltip) {
							tip = tooltip()
								.attr('class', 'd3-tip')
								.html(function (d) {
									var output = "";
									_.map(d.tip, function (v, k) {
										output += "<div style='margin: 3px 0;'>" + k + " : " + v + "</div>";
									});
									return output;
								})
								.offset(function (d) {
									return [-10, 0];
								});
							chartContent.call(tip);
							tip.show(d);
						}

					})
					.on('mouseout', function () {
						if (config.tooltip && tip) {
							tip.destroy();
						}
					});
				currentEntity
					.exit()
					.remove();
			});
		}

		function update() {
			axis = axisDomain('update');
			chartContent
				.selectAll('g.entity')
				.data(config.dataset)
				.select('path')
				.attr({
					d: function (d, i) {
						return line(d.data);
					}
				});
			drawOrUpdatePoints();
			if (xAxisAnimation) {
				movingChart();
			}
		}

		function movingChart() {
			chartContent
				.selectAll('g.entity')
				.attr('transform', "translate(0,0)")
				.transition()
				.duration(config.updateAnimationTime - 30)//减少一些动画时间
				.ease("linear")
				.attr("transform", "translate(" + (-chartWidth / (maxNode - 1)) + ",0)")//标度尺比可显示区域大 1/maxNode, 故需要手动减去一份
				.each('end', function (d, i) {
					while (d.data.length > maxNode) {
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