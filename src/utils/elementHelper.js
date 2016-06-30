/**
 * Created by zhangqing on 2016/6/30.
 */
module.exports = {
	svgContainerProperties: function(){
		if(!this.config) {return}
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