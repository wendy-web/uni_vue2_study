import {
	parseTime
} from '@/utils/index.js';
/*2022 节假日期*/
const _festivals = [
  '2022-01-01',
  '2022-01-02',
  '2022-01-03',
  '2022-01-31',
  '2022-02-01',
  '2022-02-02',
  '2022-02-03',
  '2022-02-04',
  '2022-02-05',
  '2022-02-06',
  '2022-04-03',
  '2022-04-04',
  '2022-04-05',
  '2022-04-30',
  '2022-05-01',
  '2022-05-02',
  '2022-05-03',
  '2022-05-04',
  '2022-06-03',
  '2022-06-04',
  '2022-06-05',
  '2022-09-19',
  '2022-09-10',
  '2022-09-11',
  '2022-09-12',
  '2022-10-01',
  '2022-10-02',
  '2022-10-03',
  '2022-10-04',
  '2022-10-05',
  '2022-10-06',
  '2022-10-07'
];

export function isServiceTime() {

	let date = new Date();
	//是否属于节假日
	if (_festivals.indexOf(parseTime(date, '{y}-{m}-{d}')) > -1) {
		return '很抱歉，目前是水果客服下班时间，请您留言问题。';
	}
	//当前小时
	let currTime = date.getTime();
	//当前日期
	let week = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
	//服务时间
	let serviceTime = '8:30-17:30';
	let minDate = date.setHours(8, 30, 0, 0);
	let maxDate = date.setHours(17, 30, 0, 0);
	let hours = new Date().getHours();
	//判断是否在周末
	if (week === '日' || week === '六') { //和法定节假日保持一致
		serviceTime = '10: 00-19: 00';
		// return '很抱歉，目前是水果客服下班时间，请您留言问题。';
		if(hours<10||hours>=19){
			return `很抱歉，目前是水果客服下班时间，请您留言问题。服务时间：${serviceTime}`;
		}
		//非周末判断
	} else if (currTime < minDate || currTime >= maxDate) {
		return `很抱歉，目前是水果客服下班时间，请您留言问题。服务时间：${serviceTime}`;
	}
	//不弹窗
	return '';
}
