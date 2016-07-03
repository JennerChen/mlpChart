/**
 * @param { mlpChart } this
 * @return { mlpChart } this
 */
const tooltip = require('../tooltip');
require('../css/realTimeline.less');
var realTimeLineChart = function() {
	const axisUtil = require('../axis');
	const legend = require('../legend.index');
	const brush = require('../brush');
	const _this = this;
	var realTimeLineChartParams = Array.prototype.slice.call(arguments)[0] ? Array.prototype.slice.call(arguments)[0] : {};
	const commonConfig = {
		/** @type {boolean} 如果传入参数含有dataset, 那么不进行数据处理, 否则处理数据以符合当前的图表(该种情况通常用于从父api中传入的参数) */
		dataReady: realTimeLineChartParams.dataset ? true : false,
		/** @type {Array} 图表距离上左下右的距离 */
		margin: [0, 60, 25, 0],
		/** @type {Array} 坐标轴距离上左下右的距离 */
		// 不使用了
		// xaxisTrans: [0, 0],
		// yaxisTrans: [0, 0],
		/** @type {Number} 最多显示多少个节点,当大于该节点时,会开启动画,执行 movingChart方法 */
		maxNode: 20,
		/** @type {Number} 动画时间 */
		updateAnimationTime: 2000,
		/** @type {Number} 处理输入时间跨度的, 此值应该与updateAnimationTime一致, 否则brush 模块会存在问题 */
//		timeGap: 2000,
		/** @type {Function} path颜色函数 */
		color: d3.scale.category10(),
		/** @type {boolean} 是否显示tooltip */
		tooltip: true,
		/** @type {Number} y轴最大值间距 */
		yPadding: 1.1,
		/** @type {String} line折线图, area面积图 */
		fillType: "line",
		/** @type {String} 线条/面积的类型 */
		interpolate: "linear",
		/** @type {Boolean} 是否显示图标上的点 */
		dotPoints: true,
		/** @type {Boolean} 是否显示legend */
		legend: true,
		/** @type {String} legend的位置 */
		legendPosition: "zs",
		/** @type { String} legend的摆放方式 */
		legendOriention: "vertical",
		/** @type { boolean } brush模块是否启用*/
		brushModule: false,
		/** @type {boolean} 是否允许加入新的数据 */
		enableUpdate: true
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
			color = config.color,
			maxNode = config.maxNode,
			/** @type {object} x,y轴 api */
			axis = null,
			/** @type {boolean} 是否开启x轴的动画 */
			xAxisAnimation = false,
			legendApi = null,
			brushApi = null;

		if (!config.dataReady) {
			processData();
		}

		var chart = svgContainer
			.append('g')
			.attr('class', 'chartWrap')
			.attr("transform", "translate(" + margin[1] + "," + margin[0] + ")");
		//draw chart background, may use for brush system to position outside div-css 
		chart.append('rect')
			.attr({
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
			_.map(dataset, function(d, i) {
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
				cellclick: function(name,i,e) {
					if (d3.select(this).classed('hide')) {
						d3.select(this).classed('hide', false);
						chartContent
							.selectAll('g.entity')
							.each(function(d) {
								if (d.name === name) {
									d3.select(this).style('opacity', "1");
								}
							});
					} else {
						d3.select(this).classed('hide', true);
						chartContent
							.selectAll('g.entity')
							.each(function(d) {
								if (d.name === name) {
									d3.select(this).style('opacity', "0.1");
								}
							});
					}
				},
				cellover: function(name) {
					chartContent
						.selectAll('g.entity')
						.each(function(d) {
							if (d.name === name) {
								lineMouseover.call(this);
							}
						});
				},
				cellout: function(name) {
					chartContent
						.selectAll('g.entity')
						.each(function(d) {
							if (d.name === name) {
								lineMouseout.call(this);
							}
						});
				}
			});
		}

		function axisDomain(mode) {
			var allData = [];
			_.each(dataset, function(d) {
				allData = allData.concat(d.data);
			});
			var domain_x = [(_.min(allData, function(d) {
				return d.x;
			})).x, (_.max(allData, function(d) {
				return d.x;
			})).x ];
			xAxisAnimation = (allData.length / dataset.length) > maxNode;
			// 因为要保证部分元素在界面以外, 故当超过maxNode的长度时必须扩大坐标轴范围
			var xaxisWidth = chartWidth + chartWidth * (xAxisAnimation ? 1 / maxNode : 0);

			var domain_y = [0, (_.max(allData, function(d) {
				return d.y;
			})).y * config.yPadding];
			var axisConfig = {
				domainX: domain_x,
				domainY: domain_y,
				rangeX: [0, xaxisWidth],
				rangeY: [chartHeight, 0],
				tickFormat: [function(d) {
					return _this.utils.dateFormat(d);
				}, null],
				animation: [xAxisAnimation ? function(el) {
					el.transition()
						.duration(config.updateAnimationTime - 30)
						.ease("linear")
						.call(axis.xaxis);
				} : null, function(el) {
					el.transition()
						.duration(500)
						.call(axis.yaxis);
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
				'transform': "translate(" + 0 + "," + (axis.y(0)) + ")"
			},
			yAttr: {
				'transform': "translate(" + 0 + "," + 0 + ")"
			}
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
				x: 1,
				y: 0
			});
		var fillTypeFunc = null;
		if (config.fillType === 'area') {
			fillTypeFunc = d3.svg.area()
				.interpolate(config.interpolate)
				.x(function(d, i) {
					return axis.x(d.x);
				})
				.y0(axis.y(0))
				.y1(function(d, i) {
					return axis.y(d.y);
				});
		} else {
			fillTypeFunc = d3.svg.line()
				.interpolate(config.interpolate)
				.x(function(d, i) {
					return axis.x(d.x);
				})
				.y(function(d, i) {
					return axis.y(d.y);
				});
		}

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
			.on('mouseover', lineMouseover)
			.on('mouseout', lineMouseout)
			.append('path')
			.attr({
				d: function(d, i) {
					return fillTypeFunc(d.data);
				},
				'stroke': function(d, i) {
					return color(i);
				},
				'fill': function(d, i) {
					return config.fillType === 'area' ? color(i) : 'none';
				},
				'stroke-width': '2px',
				'opacity': 0.8
			});
		if (config.dotPoints) {
			drawOrUpdatePoints();
		}
		if (config.brushModule ) {
			if(!brushApi){
				brushApi = brush.call(chart, {
					api: _this
				})
				.on('brushDataFormat',function(startPos, endPos){
					if(!endPos){
						endPos  = startPos;
					}
					var allData = [];
					_.each(dataset, function(d) {
						allData = allData.concat(_.pluck(d.data,'x'));
					});
					var cloestStart = _this.utils.findCloestNumber.call(allData, axis.x.invert(startPos),'>') ,
						cloestEnd = _this.utils.findCloestNumber.call(allData, axis.x.invert(endPos),'<') ,
						startWidth = axis.x(cloestStart),
						endWidth = axis.x(cloestEnd);
					return {
						startText: _this.utils.dateFormat(cloestStart,'yyyy-MM-dd hh:mm:ss') ,
						startWidth: startWidth,
						endText: _this.utils.dateFormat(cloestEnd,'yyyy-MM-dd hh:mm:ss') ,
						endWidth: endWidth,
						rangeText: _this.utils.dataFormatRange(cloestEnd - cloestStart)
					};
				});
			}
			brushApi.init();
		}

		function lineMouseout() {
			d3.select(this)
				.select('path').attr({
					"stroke-width": '2px',
					'opacity': 0.8
				});
			d3.select(this)
				.selectAll('circle')
				.attr('r', 3);
		}

		function lineMouseover() {
			d3.select(this)
				.select('path').attr({
					"stroke-width": '4px',
					'opacity': 0.9
				});
			d3.select(this)
				.selectAll('circle')
				.attr('r', 5);
		}

		function drawOrUpdatePoints() {
			var tip = null;

			chartContent
				.selectAll('g.entity').each(function(d, i) {
					var currentEntity = d3.select(this)
						.selectAll('circle')
						.data(d.data);
					currentEntity
						.attr({
							cx: function(cd, ci) {
								return axis.x(cd.x);
							},
							cy: function(cd, ci) {
								return axis.y(cd.y);
							}
						})
						.enter()
						.append('circle')
						.attr({
							r: 3,
							cx: function(cd, ci) {
								return axis.x(cd.x);
							},
							cy: function(cd, ci) {
								return axis.y(cd.y);
							},
							cursor: 'pointer',
							fill: color(i)
						})
						.on('mouseover', function(d) {
							if (config.tooltip) {
								tip = tooltip()
									.attr('class', 'd3-tip')
									.html(function(d) {
										var output = "";
										_.map(d.tip, function(v, k) {
											output += "<div style='margin: 3px 0;'>" + k + " : " + v + "</div>";
										});
										return output;
									})
									.offset(function(d) {
										return [-10, 0];
									});
								chartContent.call(tip);
								tip.show(d);
							}

						})
						.on('mouseout', function() {
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
					d: function(d, i) {
						return fillTypeFunc(d.data);
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
				.duration(config.updateAnimationTime - 30) //减少一些动画时间
				.ease("linear")
				.attr("transform", "translate(" + (-chartWidth / (maxNode - 1)) + ",0)") //标度尺比可显示区域大 1/maxNode, 故需要手动减去一份
				.each('end', function(d, i) {
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
			brushApi = null;
		}

		function dataUpdateStatus(status){
			if(status === true){
				config.enableUpdate = true;
			}else if(status === false){
				config.enableUpdate = false;
			}else{
				return config.enableUpdate;
			}
		}
		chartApi = {
			update: update,
			remove: remove,
			dataUpdateStatus: dataUpdateStatus,
			legendApi: legendApi
		};
		return _this;
	}

	function update(increaseData) {
		if (!chartApi) {
			return;
		}
		if(!chartApi.dataUpdateStatus()){
			console.info("当前图表禁止向其添加数据");
			return;
		}
		var dataset = config.dataset;
		if (increaseData.length != dataset.length) {
			return;
		}
		_.each(increaseData, function(d, i) {
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