/**
 * @param { mlpChart } this 
 * @return { mlpChart } this
 */
var realTimeLineChart = function() {
	const api = {};
	/** @type { mlpChart } 使用 _this 代替 this */
	const _this = this;
	var realTimeLineChartParams = Array.prototype.slice.call(arguments)[0] ? Array.prototype.slice.call(arguments)[0] : {};
	var commonConfig = {
		dataReady: realTimeLineChartParams.dataset ? true : false,
		/** @type {Array} 图表距离上左下右的距离 */
		margin: [10, 10, 10, 0],
		/** @type {Array} 坐标轴距离上左下右的距离 */
		axisMargin: [0, 20, 20, 0],
		maxNode: 20,
		/** @type {Func} path颜色函数 */
		color : d3.scale.category10(),
		updateAnimationTime: 2000
	}
	var config = _this.utils.mergeConfig.call(_this, _this.config, commonConfig, realTimeLineChartParams);

	function processData() {
		var ds = config.dataset;
	}
	/** @type {obj} 内部chart变量 */
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
		function axisDomain(){
			//draw chart axis, => x
			var xFunc = d3.scale.linear()
				.domain([0, maxNode - 1])
				.range([0, chartWidth]);

			var	allData = [0];
			_.each(dataset,function(d){
				allData =allData.concat(d.data);
			});
			var yFunc = d3.scale.linear()
				.domain([0,d3.max(allData)*1.1])
				.range([chartHeight - axisMargin[2], 0]);
			return {
				x: xFunc,
				y: yFunc,
				xaxis: d3.svg.axis().scale(xFunc).orient("bottom").ticks(5),
				yaxis: d3.svg.axis().scale(yFunc).orient("right").ticks(5)
			}
		}
		if (!config.dataReady) {
			processData();
		}

		var chart = svgContainer
			.append('g')
			.attr('class','chartWrap')
			.attr("transform", "translate(" + margin[0] + "," + margin[1] + ")");
		//draw chart background
		chart.append('rect')
			.attr({
				width: chartWidth,
				height: chartHeight,
				x: 0,
				y: 0,
				fill: 'transparent',
				class: 'mlpChart-bg',
			});
		/** @type {obj} x,y轴 domain */
		var axis = axisDomain();

		chart.append('g')
			.attr({
				'class': 'x axis',
				'transform': "translate(0," + axis.y(0) + ")"
			})
			.call(axis.xaxis);

		chart.append('g')
			.attr({
				'class': 'y axis',
				'transform': "translate(" + axis.x(0) + ",0)"
			})
			.call(axis.yaxis)
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
				x:1
			});

		var line = d3.svg.line()
			.x(function(d, i) {
				return axis.x(i);
			})
			.y(function(d, i) {
				return axis.y(d);
			});
		var chartContent = chart.append('g')
			.attr({
				'class':'chartContent',
				"clip-path": "url(#"+clipUniqueId+")"
			});
		
		chartContent
			.selectAll('g.entity')
			.data(dataset)
			.enter()
			.append('g')
			.attr({
				class: 'entity'
			})
			.append('path')
			.attr({
				d: function(d,i){
					return line(d.data);
				},
				'stroke':function(d,i){
					return color(i);
				},
				'fill':'none',
				'stroke-width':'2px',
				'opacity':0.8
			})
			.on('mouseover',function(){
				d3.select(this).attr({
					"stroke-width":'4px',
					'opacity':1
				})
			})
			.on('mouseout',function(){
				d3.select(this).attr({
					"stroke-width":'2px',
					'opacity':0.8
				})
			});

		chartContent
			.selectAll('g.entity').each(function(d,i){
				d3.select(this)
					.selectAll('circle')
					.data(d.data)
					.enter()
					.append('circle')
					.attr({
						r: 3,
						cx: function(cd,ci){
							return axis.x(ci);
						},
						cy: function(cd,ci){
							return axis.y(cd);
						},
						fill: color(i)
					});
					
			});
			


			
		function update(){
			var newDs = config.dataset;
			axis = axisDomain();
			chartContent
				.selectAll('g.entity')
				.data(newDs)
				.select('path')
				.attr({
					d: function(d,i){
						return line(d.data);
					}
				});

			chartContent
				.selectAll('g.entity').each(function(d,i){
					d3.select(this)
						.selectAll('circle')
						.data(d.data)
						.attr({
							cx: function(cd,ci){
								return axis.x(ci);
							},
							cy: function(cd,ci){
								return axis.y(cd);
							}
						})
						
				});
			animation();	
		}

		function animation(){
			chart.select('.y.axis')
				.transition()
				.duration(500)
				.call(axis.yaxis);

			chart.select('.x.axis')
				.transition()
				.duration(500)
				.call(axis.xaxis);

			chartContent
				.selectAll('g.entity')
				.attr('transform',"translate(0,0)")
				.transition()
				.duration(config.updateAnimationTime - 30)
				.ease("linear")
		        .attr("transform", "translate(" + axis.x(-1) + ",0)")
		        .each('end',function(d,i){
		        	if(d.data.length > maxNode){
		        		d.data.shift();
		        	}
		        })
		}
		chartApi = {
			update: update
		}
		return _this;
	};
	function update(increaseData){
		// increaseData = [(Math.random()*100).toFixed(4),(Math.random()*100).toFixed(4)]
		if(!chartApi) return;
		var dataset = config.dataset;
		if(increaseData.length != dataset.length ) return;
		_.each(increaseData, function(d,i){
			dataset[i].data.push(d);
		});
		chartApi.update();
	}

	function getConfig() {
		return config;
	}

	function setConfig(newConfig) {
		newConfig = newConfig ? newConfig : {};
		config = _.extend({}, config, newConfig)
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