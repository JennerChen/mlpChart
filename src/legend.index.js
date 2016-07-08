const legendColor = require('./legend/color');
const legendSize = require('./legend/size');
const legendSymbol = require('./legend/symbol');

function defaultLegend() {
	const _this = this;
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
		var ordinal = d3.scale.ordinal()
			.domain(config.scale_domain)
			.range(config.scale_range);

		var legendOrdinal = legendColor()
			.shape("path", d3.svg.symbol().type("circle").size(150)())
			.shapePadding(config.shapePadding)
			.labelOffset(config.labelOffset)
			.classPrefix(config.classPrefix)
			.orient(config.orient)
			.scale(ordinal)
			.on("cellclick", config.cellclick)
			.on('cellover', config.cellover)
			.on('cellout', config.cellout);
		_this.append("g")
			.attr("class", config.legendClass)
			.call(legendOrdinal);
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
		function s(){
			transY += 10;
			tarnsX += nodeMatrix.width /2 - legendElMatrix.width / 2;
		}
		function ys(){
			tarnsX += -20;
			transY += 10;
			tarnsX += nodeMatrix.width - legendElMatrix.width;
		}
		function z(){
			tarnsX += 50;
			transY += nodeMatrix.height /2 - legendElMatrix.height / 2;
		}
		function m(){
			tarnsX += nodeMatrix.width /2 - legendElMatrix.width / 2;
			transY += nodeMatrix.height /2 - legendElMatrix.height / 2;
		}
		function y(){
			tarnsX += -20;
			transY += nodeMatrix.height /2 - legendElMatrix.height / 2;
			tarnsX += nodeMatrix.width - legendElMatrix.width;
		}
		function zx(){
			tarnsX += 50;
			transY += -40;
			transY += nodeMatrix.height  - legendElMatrix.height ;
		}
		function x(){
			transY += -40;
			tarnsX += nodeMatrix.width /2 - legendElMatrix.width / 2;
			transY += nodeMatrix.height  - legendElMatrix.height ;
		}
		function yx(){
			tarnsX += -20;
			transY += -40;
			tarnsX += nodeMatrix.width - legendElMatrix.width;
			transY += nodeMatrix.height  - legendElMatrix.height ;
		}
		legendEl.attr("transform", "translate(" + tarnsX + "," + transY + ")");
	}
	legendApi.remove = function(){
		_this.select('.' + config.legendClass).remove();
	};
	legendApi.getBBox = function(){
		return _this.select('.' + config.legendClass).node().getBBox();
	}
	return legendApi;
}
module.exports = {
	color: legendColor,
	size: legendSize,
	symbol: legendSymbol,
	defaultLegend: defaultLegend
};