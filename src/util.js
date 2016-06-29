module.exports = {
	mergeConfig : function(){
		var allConfig = Array.prototype.slice.call(arguments);
		var config = {};
		_.each(allConfig,function(c){
			config = _.extend(config,c);
		});
		return config;
	},
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
	},
	dateFormat: function(d,mode){
		var weekInfo = {
		       "0": "星期日",
		       "1": "星期一",
		       "2": "星期二",
		       "3": "星期三",
		       "4": "星期四",
		       "5": "星期五",
		       "6": "星期六"
		};
		var pattern = mode ? mode : "hh:mm:ss";
		var time = new Date(d);
		if(!time) return;
		var year = time.getFullYear(),
            month = time.getMonth() + 1,
            day = time.getDate(),
            week = weekInfo["" + time.getDay()],
            hour = time.getHours(),
            minute = time.getMinutes(),
            second = time.getSeconds(),
            millSecond = time.getMilliseconds();

        month = month >= 10 ? month : "0" + month;
        day = day >= 10 ? day : "0" + day;
        hour = hour == 0 ? "00" : hour <=9 ? "0"+hour : hour;
        minute = minute == 0 ? "00" : minute <=9 ? "0"+minute : minute;
        second = second == 0 ? "00" : second <=9 ? "0"+second : second;
        switch(mode){
        	case "yyyy-MM-dd hh:mm:ss":
        		return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
        	case "MM:dd hh:mm:ss":
        		return month+":"+day+" "+hour+":"+minute+":"+second;
        	case "hh:mm:ss":
        		return hour+":"+minute+":"+second;
        	default:
        		return hour+":"+minute+":"+second;
        }
	}
};