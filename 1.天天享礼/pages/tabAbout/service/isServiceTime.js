import { holiday } from '@/api/modules/user.js';
import { parseTime } from '@/utils/index.js';

let _festivals = [
    "2024-01-01",
    "2024-02-10",
    "2024-02-11",
    "2024-02-12",
    "2024-02-13",
    "2024-02-14",
    "2024-02-15",
    "2024-02-16",
    "2024-02-17",
    "2024-04-04",
    "2024-04-05",
    "2024-04-06",
    "2024-05-01",
    "2024-05-02",
    "2024-05-03",
    "2024-05-04",
    "2024-05-05",
    "2024-06-08",
    "2024-06-09",
    "2024-06-10",
    "2024-09-15",
    "2024-09-16",
    "2024-09-17",
    "2024-10-01",
    "2024-10-02",
    "2024-10-03",
    "2024-10-04",
    "2024-10-05",
    "2024-10-06",
    "2024-10-07"
];
holiday().then((result) => {
    if (!result.code) return;
    _festivals = result.data;
});
export function isServiceTime() {
    let date = new Date();
    // 是否属于节假日
    if (_festivals.indexOf(parseTime(date, '{y}-{m}-{d}')) > -1) {
        return '很抱歉，目前是水果客服下班时间，请您留言问题。';
    }
    // 当前小时
    let currTime = date.getTime();
    // 当前日期
    let week = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
    // 服务时间
    let serviceTime = '8:30-17:30';
    let minDate = date.setHours(8, 30, 0, 0);
    let maxDate = date.setHours(17, 30, 0, 0);
    let hours = new Date().getHours();
    // 判断是否在周末
    if (week === '日' || week === '六') { // 和法定节假日保持一致
        serviceTime = '10: 00-19: 00';
        // return '很抱歉，目前是水果客服下班时间，请您留言问题。';
        if (hours < 10 || hours >= 19) {
            return `很抱歉，目前是水果客服下班时间，请您留言问题。服务时间：${serviceTime}`;
        }
        // 非周末判断
    } else if (currTime < minDate || currTime >= maxDate) {
        return `很抱歉，目前是水果客服下班时间，请您留言问题。服务时间：${serviceTime}`;
    }
    // 不弹窗
    return '';
}
