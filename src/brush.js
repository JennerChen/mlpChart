require('./css/brush.less');
module.exports = function () {
	var brushApi = {};
	const _this = this;
	if (_this.empty()) {
		return;
	}
	var commonConfig = {
		brushStart: null,
		brushDone: null,
		brushMove: null,
		brushClass: 'mlpBrush',
		brushingClass: 'brushing',
		brushDataFormat: function (startPos, endPos) {
			if(!endPos){
				endPos = startPos + 10;
			}
			return {
				startText: startPos + "px",
				startWidth: startPos,
				endText: endPos + "px",
				endWidth: endPos,
				rangeText: endPos - startPos + "px"
			};
		},
		brushTemplate : _.template("<div class='brush-left'></div><div class='brush-right'></div>"),
		brushLeftInnerTemplate:_.template("<span class='brushSpan'><%= startText %></span><span class='brushRangeSpan' style='width:<%= rangeWidth %>px;left:<%= rangeLeft %>px;'><%= rangeText %></span>"),
		brushRightInnerTemplate: _.template("<span class='brushSpan'><%= endText %></span>")
	};
	var brushParams = Array.prototype.slice.call(arguments)[0] ? Array.prototype.slice.call(arguments)[0] : {};
	var config = _.extend({}, commonConfig, brushParams);
	if (!config.api) {
		console.log('无法找到api');
		return;
	}
	var mlpChartApi = config.api,
		chartId = mlpChartApi.config.chartId,
		divWrap = mlpChartApi.config.wrapContainer,
		bgSizeEl = _this.select('rect.mlpChart-bg').node(),
		svgWrap = bgSizeEl.ownerSVGElement,
		totalWidth = bgSizeEl.getBBox().width,
		totalHeight = bgSizeEl.getBBox().height,
		ctm = bgSizeEl.getScreenCTM(),
		brushWrap = null,
		brushWrapEl = null;
	if (d3.select('#brush_' + chartId).empty()) {
		brushWrap = mlpChartApi.config.wrapContainer
			.append("div")
			.attr({
				id: 'brush_' + chartId,
				class: config.brushClass
			});
		brushWrapEl = brushWrap.node();
	} else {
		brushWrap = d3.select('#brush_' + chartId);
		brushWrapEl = brushWrap.node();
	}

	function init() {
		brushWrapEl.style.left = ctm.e + document.body.scrollLeft + "px";
		brushWrapEl.style.top = ctm.f + document.body.scrollTop + "px";
		brushWrapEl.style.width = totalWidth + "px";
		brushWrapEl.innerHTML = config.brushTemplate();
		brushWrap.select('.brush-left').attr('style', 'height:' + totalHeight + "px");
		brushWrap.select('.brush-right').attr('style', 'height:' + totalHeight + "px");
		_this.node().style.cursor = "crosshair";
		_this.node().addEventListener('mousedown', handleBrushMouseDown);
		brushWrapEl.querySelector('.brush-left').addEventListener('mousedown', handleBrushMouseDown);
		brushWrapEl.querySelector('.brush-right').addEventListener('mousedown', handleBrushMouseDown);
		divWrap.node().addEventListener('mouseup', handleBrushMouseUp);
		divWrap.node().addEventListener('mousemove', handleBrushMouseMove);
		document.addEventListener('mouseup', handleBrushMouseUp);
		return brushApi;
	}
	function rePosition(){
		
	}
	var brushing = false;

	function handleBrushMouseMove() {
		if (!brushing) {
			return;
		}
		var e = event || window.event;
		if (e.x - ctm.e < 0 || e.x - ctm.e > totalWidth - 4) {
			return;
		}
		var leftBrush = brushWrapEl.querySelector('.brush-left'),
			rightBrush = brushWrapEl.querySelector('.brush-right'),
			startPoint = Number(leftBrush.getAttribute('data-startpoint')),
			nowPos = e.x - ctm.e,
			snapBrushWidth = null;
		if (startPoint <= nowPos) {
			snapBrushWidth = config.brushDataFormat(startPoint, nowPos);
			rightBrush.style.width = (totalWidth - snapBrushWidth.endWidth) + "px";
		} else {
			snapBrushWidth = config.brushDataFormat(nowPos, startPoint);
			leftBrush.style.width = snapBrushWidth.startWidth + "px";
			rightBrush.style.width = (totalWidth - snapBrushWidth.endWidth) + "px";
		}
		leftBrush.innerHTML = config.brushLeftInnerTemplate({
			startText: snapBrushWidth.startText,
			rangeText: snapBrushWidth.rangeText,
			rangeWidth:snapBrushWidth.endWidth - snapBrushWidth.startWidth ,
			rangeLeft: snapBrushWidth.startWidth
		});
		rightBrush.innerHTML = config.brushRightInnerTemplate({
			endText: snapBrushWidth.endText
		});
	}

	function handleBrushMouseDown(event) {
		var e = event || window.event;
		//减去4是因为边框的原因
		if (e.x - ctm.e < 0 || e.x - ctm.e > totalWidth  - 4) {
			return;
		}
		brushing = true;
		brushWrapEl.setAttribute('class', config.brushClass + " " + config.brushingClass);
		var leftBrush = brushWrapEl.querySelector('.brush-left'),
			rightBrush = brushWrapEl.querySelector('.brush-right'),
			widthLeft = e.x - ctm.e,
			snapBrushWidth = config.brushDataFormat(widthLeft);
		leftBrush.style.width = snapBrushWidth.startWidth + "px";
		rightBrush.style.width = (totalWidth - snapBrushWidth.endWidth) + "px";
		leftBrush.innerHTML = config.brushLeftInnerTemplate({
			startText: snapBrushWidth.startText,
			rangeText: snapBrushWidth.rangeText,
			rangeWidth:snapBrushWidth.endWidth - snapBrushWidth.startWidth ,
			rangeLeft: snapBrushWidth.startWidth
		});
		rightBrush.innerHTML = config.brushRightInnerTemplate({
			endText: snapBrushWidth.endText
		});
		leftBrush.setAttribute('data-startpoint', "" + widthLeft);
	}

	function handleBrushMouseUp(e) {
		brushing = false;
	}

	brushApi.init = init;
	brushApi.on = function (eventType, callback) {
		if (eventType === 'brushStart') {
			config.brushStart = callback;
		}
		if (eventType === 'brushMove') {
			config.brushMove = callback;
		}
		if (eventType === 'brushDone') {
			config.brushDone = callback;
		}
		if( eventType === 'brushDataFormat'){
			config.brushDataFormat = callback;
		}
		return brushApi;
	};
	brushApi.rePosition = rePosition;
	return brushApi;
};