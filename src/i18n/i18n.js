/**
 * Created by zhangqing on 2016/6/30.
 */
var language = {
	"zh": require("./zh/zh.json"),
	"en": require("./en/en.json")
};
module.exports = {
	i18n:"zh",
	getI18N:function(key){
		var lan = this.i18n;
		return key ? language[lan][key] : language[lan];
	},
	setI18N: function(lan){
		if(lan != this.i18n && language[lan]){
			this.i18n = lan;
		}
	}
};