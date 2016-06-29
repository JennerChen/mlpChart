var axisUtil = function () {
	/**
	 * @param axis.api {{}} 坐标轴绘制等暴露的方法
	 * */
	var axis = {};
	// 当前为 d3元素
	const _this = this;
	if (_this.empty()) {
		console.warn("can't find element to append axis, don't generate axis!");
	}
	const commonConfig = {
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
	function switchAxisType(){
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
		var xFunc = d3.scale.linear()
			.domain(domain_x)
			.range(range_x);

		var yFunc = d3.scale.linear()
			.domain(domain_y)
			.range(range_y);

		axis.x = xFunc;
		axis.y = yFunc;
		axis.xaxis = d3.svg.axis()
			.scale(xFunc)
			.orient(config.orient[0])
			.ticks(config.ticks[0])
			.tickFormat(config.tickFormat[0]);
		axis.yaxis = d3.svg.axis()
			.scale(yFunc)
			.orient(config.orient[1])
			.ticks(config.ticks[1])
			.tickFormat(config.tickFormat[1]);
	}

	function drawAxis() {
		var attrParams = Array.prototype.slice.call(arguments)[0] ? Array.prototype.slice.call(arguments)[0] : {};

		_this.append('g')
			.attr('class', config.xClass)
			.attr(attrParams.xAttr ? _.extend(config.xAttr,attrParams.xAttr) :config.xAttr)
			.call(axis.xaxis);

		_this.append('g')
			.attr('class',config.yClass)
			.attr(attrParams.yAttr ? _.extend(config.yAttr,attrParams.yAttr) :config.yAttr)
			.call(axis.yaxis);

		return axis;
	}
	function updateAxis(){
		var updateParams = Array.prototype.slice.call(arguments)[0] ? Array.prototype.slice.call(arguments)[0] : {};
		config = _.extend({},config,updateParams );
		switchAxisType();
		var xaxisEl = _this.select("g."+(_.compact(config.xClass.split(' '))).join('.'));
		var yaxisEl = _this.select("g."+(_.compact(config.yClass.split(' '))).join('.'));
		if(config.animation[0]){
			config.animation[0].call(axis,xaxisEl);
		}else{
			xaxisEl.call(axis.xaxis);
		}

		if(config.animation[1]){
			config.animation[1].call(axis,yaxisEl);
		}else{
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