/**
 * Created by zhangqing on 2016/6/30.
 */
module.exports = {
	dateFormat: function (d, mode) {
		var weekInfo = this.getI18N().weekInfo;
		var pattern = mode ? mode : "hh:mm:ss";
		var time = new Date(d);
		if (!time) {
			return;
		}
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
		hour = hour === 0 ? "00" : hour <= 9 ? "0" + hour : hour;
		minute = minute === 0 ? "00" : minute <= 9 ? "0" + minute : minute;
		second = second === 0 ? "00" : second <= 9 ? "0" + second : second;
		switch (pattern) {
			case "yyyy-MM-dd hh:mm:ss":
				return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
			case "MM:dd hh:mm:ss":
				return month + ":" + day + " " + hour + ":" + minute + ":" + second;
			case "hh:mm:ss":
				return hour + ":" + minute + ":" + second;
			default:
				return hour + ":" + minute + ":" + second;
		}
	},
	dateRangeFormat: function (range, mode) {
		range = Number(range);
		var modeConfig = {
			days: true,
			hours: true,
			minutes: true,
			seconds: true,
			millSecond: false
		};
		var timeI18N = this.getI18N().timeInfo;
		if (mode) {
			modeConfig = _.extend({}, modeConfig, mode);
		}
		if (!range) {
			return "invalid timeRange";
		}
		//计算有多少天
		var days = parseInt(range / (1000 * 60 * 60 * 24));
		//计算剩余的时间
		var leftRange = range % (1000 * 60 * 60 * 24);
		//在剩余的时间中, 计算有多少小时
		var hours = parseInt(leftRange / (1000 * 60 * 60));
		// 除去小时, 计算剩余的时间
		leftRange = leftRange % (1000 * 60 * 60);
		//在剩余的时间中, 计算有多少分钟
		var minutes = parseInt(leftRange / (1000 * 60));
		//除去分钟,  计算剩余的时间
		leftRange = leftRange % (1000 * 60);
		//在剩余的时间中, 计算多少秒
		var seconds = parseInt(leftRange / 1000);
		//再计算多少毫秒
		var millSecond = parseInt(leftRange % 1000);
		var output = "";
		if (days > 0 && modeConfig.days) {
			output += days + timeI18N.day + " ";
		}
		if (hours > 0 && modeConfig.hours) {
			output += hours + timeI18N.hour + " ";
		}
		if (minutes > 0 && modeConfig.minutes) {
			output += minutes + timeI18N.minute + " ";
		}
		if (seconds > 0 && modeConfig.seconds) {
			output += seconds + timeI18N.second + " ";
		}
		if (millSecond > 0 && modeConfig.millSecond) {
			output += millSecond + timeI18N.millSecond + " ";
		}
		return output;
	}
};