require('./css/tooltip.less');
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

		nodel.html(content)
			.style({
				opacity: 1,
				'pointer-events': 'all'
			});
		
		while (i--) {
			nodel.classed(directions[i], false);
		}
		coords = direction_callbacks.get(dir).call(this,nodel);
		var offsetTop = (coords.top + poffset[0]) + scrollTop,
			offsetLeft = (coords.left + poffset[1]) + scrollLeft,

			offsests=transPosition(nodel, dir, offsetTop, offsetLeft);


		nodel.classed(dir, true).style({
			top: offsests[0] + 'px',
			left: offsests[1] + 'px'
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
	/**
	 * tip在边缘时会出现无法完全显示的问题, 此方法用来修正 其位置
	 * @param  {d3} nodel tip的元素
	 * @param  {string} dir   tip方向
	 * @param  {number} top   绝对定位 top大小
	 * @param  {number} left  绝对定位 left大小
	 * @return {[number,number]}       新的 [top,left]
	 */
	function transPosition(nodel,dir,top,left){
		var nodeWidth = Number(nodel.style('width').split('px')[0]),
			nodeHeight = Number(nodel.style('height').split('px')[0]),
			bodyWidth = Number(d3.select('body').style('width').split('px')[0]),
			bodyHeight = Number(d3.select('body').style('height').split('px')[0]);
		switch (dir){
			case "n":
				transDir_n();
				break;
			default :
				break;
		}
		function transDir_n(){
			if(d3.event.x <= nodeWidth/2){
				left += (nodeWidth/2 - d3.event.x);
			}
			if(d3.event.y - 20 <= nodeHeight){
				top += (nodeHeight - d3.event.y + 20);
			}
			if( bodyWidth - d3.event.x - 20 <= nodeWidth/2 ){
				left = left - (nodeWidth/2 - bodyWidth + d3.event.x + 20);
			}
		}
		return [top, left];
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