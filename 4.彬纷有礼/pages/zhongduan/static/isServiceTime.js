const _festivals = [
	"2022-12-31",
  "2023-01-01",
  "2023-01-02",
  "2023-01-21",
  "2023-01-22",
  "2023-01-23",
  "2023-01-24",
  "2023-01-25",
  "2023-01-26",
  "2023-01-27",
  "2023-04-05",
  "2023-04-29",
  "2023-04-30",
  "2023-05-01",
  "2023-05-02",
  "2023-05-03",
  "2023-06-22",
  "2023-06-23",
  "2023-06-24",
  "2023-09-29",
  "2023-09-30",
  "2023-10-01",
  "2023-10-02",
  "2023-10-03",
  "2023-10-04",
  "2023-10-05",
  "2023-10-06"
]

function parseTime(time, cFormat) {
	if (arguments.length === 0 || !time) {
		return null
	}
	const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		if ((typeof time === 'string')) {
			if ((/^[0-9]+$/.test(time))) {
				// support "1548221490638"
				time = parseInt(time)
			} else {
				// support safari
				// https://stackoverflow.com/questions/4310953/invalid-date-in-safari
				time = time.replace(new RegExp(/-/gm), '/')
			}
		}

		if ((typeof time === 'number') && (time.toString().length === 10)) {
			time = time * 1000
		}
		date = new Date(time)
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}
	const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
		const value = formatObj[key]
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') {
			return ['日', '一', '二', '三', '四', '五', '六'][value]
		}
		return value.toString().padStart(2, '0')
	})
	return time_str
}

module.exports = {

	isServiceTime: function () {

		let date = new Date();
		//判断本地系统时间是否小于接口返回的服务器时间
		let serverDate = wx.getStorageSync('serverDate');
		if (serverDate) {
			if (date.getTime() - serverDate < 0) {
				date = new Date(serverDate);
			}
		}
		//是否属于节假日
		if (_festivals.indexOf(parseTime(date, '{y}-{m}-{d}')) > -1) {
			return '很抱歉，目前是水果客服下班时间，请您留言问题。'
		}
		//当前小时
		let hours = date.getHours();
		//当前时间戳
		let currentTime = date.getTime();
		
		//当前日期
		let week = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]
		//服务时间
		let serviceTime = '8：30-17：30';
		//最大时间戳，最小时间戳
		let maxTime = date.setHours(17,30,0,0);
		let minTime = date.setHours(8,30,0,0);
		//判断是否在周末
		if (week === '日' || week === '六') {
			serviceTime = '10: 00-19: 00';
			// return `很抱歉，目前是水果客服下班时间，请您留言问题。`
			// return `很抱歉，目前是水果客服下班时间，请您留言问题。服务时间：${serviceTime}`
			// console.log(hours);
			if (hours < 10 || hours >= 19) {
				return `很抱歉，目前是水果客服下班时间，请您留言问题。服务时间：${serviceTime}`
			}
			//非周末判断
		} else if (currentTime < minTime || currentTime >= maxTime) {
			return `很抱歉，目前是水果客服下班时间，请您留言问题。服务时间：${serviceTime}`
		}
		//不弹窗
		return ''

	}

}