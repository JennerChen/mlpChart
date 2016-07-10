/**
 * Created by zhangqing on 2016/7/8.
 */
module.exports = function () {
	var nodeEl = null,
		svgType = 'path',
		duration = 500,
		ease = 'linear',
		animateStart = null,
		animateEnd = null;

	function animate(svg) {
		nodeEl = svg;
		if (svgType === 'path') {
			animatePath();
		}
	}

	function animatePath() {
		nodeEl.each(function (el) {
			var pathLength = this.getTotalLength();
			d3.select(this)
				.attr("stroke-dasharray", pathLength + " " + pathLength)
				.attr("stroke-dashoffset", pathLength)
				.transition()
				.duration(duration)
				.ease(ease)
				.attr({
					"stroke-dashoffset": 0
				})
				.each('end',animateEnd);
		});
	}

	animate.svgType = function (_) {
		if (_) {
			svgType = _;
		}
		return this;
	};
	animate.duration = function (time) {
		if (!time) {
			return this;
		}
		duration = time;
		return this;
	};
	animate.ease = function(_){
		if(_){
			ease = _;
		}
		return this;
	};
	animate.on = function (type, callback) {
		if (type === 'start') {
			animateStart = callback;
		}
		if (type === 'end') {
			animateEnd = callback;
		}
		return this;
	};
	return animate;
};