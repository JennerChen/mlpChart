/**
 * Created by zhangqing on 2016/6/30.
 */
module.exports = {
	mergeConfig: function () {
		var allConfig = Array.prototype.slice.call(arguments);
		var config = {};
		_.each(allConfig, function (c) {
			config = _.extend(config, c);
		});
		return config;
	},
	/**
	 * 查找输入数字最接近 this(Array 数组)中 的一个数字
	 * @param num 查找的数字
	 * @param operation 类型
	 * @returns {number}
	 */
	findCloestNumber: function (num, operation) {
		var searchArr = this;
		if (this instanceof Array) {
			return _.min(_.filter(searchArr, function (d) {
				return operation === '<' ? num < d : num >= d;
			}), function (n) {
				return Math.abs(num - n);
			});
		}
	}
};