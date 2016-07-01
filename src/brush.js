require('./css/brush.less');
module.exports = function() {
	var brushApi = {};
	const _this = this;
	if (_this.empty()) {
		return;
	}
	var brushParams = Array.prototype.slice.call(arguments)[0] ? Array.prototype.slice.call(arguments)[0] : {};
	if (!brushParams.api) {
		console.log('无法找到api');
		return;
	}
	var mlpChartApi = brushParams.api,
		chartId = mlpChartApi.config.chartId,
		bgSizeEl = _this.select('rect.mlpChart-bg').node(),
		svgWrap = bgSizeEl.ownerSVGElement,
		totalWidth = bgSizeEl.getBBox().width,
		totalHeight = bgSizeEl.getBBox().height,
		ctm = bgSizeEl.getScreenCTM(),
		brushWrap = null;
	if (d3.select('#brush_' + chartId).empty()) {
		brushWrap = mlpChartApi.config.wrapContainer
					.append("div")
					.attr({
						id: '#brush_' + chartId,
						class: 'mlpBrush'
					});
	} else {
		brushWrap = d3.select('#brush_' + chartId)
	}

	function init() {
		console.log('---');
		brushWrap.style({
			top: ctm.e,
			left: ctm.f,
			width: totalWidth,
			height: totalHeight
		});
		brushWrap.attr({
			top: ctm.e,
			left: ctm.f,
			width: totalWidth,
			height: totalHeight
		})
		return brushApi;
	}


	console.log(ctm.e, ctm.f);
	brushApi.init = init;
	return brushApi;
}