/**
 * Created by zhangqing on 2016/6/30.
 */
module.exports = {
	dateFormat: function(d,mode){
		var weekInfo = this.getI18N().weekInfo;
		var pattern = mode ? mode : "hh:mm:ss";
		var time = new Date(d);
		if(!time) {return;}
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
		hour = hour === 0 ? "00" : hour <=9 ? "0"+hour : hour;
		minute = minute === 0 ? "00" : minute <=9 ? "0"+minute : minute;
		second = second === 0 ? "00" : second <=9 ? "0"+second : second;
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