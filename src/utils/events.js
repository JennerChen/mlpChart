/**
 * Created by zhangqing on 2016/6/30.
 */
module.exports = {
	resize: function(){
		if(!this.config) {return}
		var wrapContainer = this.config.wrapContainer,
			svgContainer = this.config.svgContainer,
			widthString = wrapContainer.style('width'),
			heightString = wrapContainer.style('height');
		svgContainer.attr({
			width: widthString,
			heightString: heightString
		});
		if(this.api && this.api.resize){
			this.api.resize();
		}
	}
};