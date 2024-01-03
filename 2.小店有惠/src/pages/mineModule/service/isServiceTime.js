import {
    parseTime
} from '@/utils/index.js';
import { holiday } from "@/api/modules/mine.js";
/*2022 节假日期*/
let _festivals = [
    "2022-12-31", "2023-01-01", "2023-01-02",
    "2023-01-21", "2023-01-22", "2023-01-23", "2023-01-24", "2023-01-25", "2023-01-26", "2023-01-27",
    "2023-04-05",
    "2023-04-29", "2023-04-30", "2023-05-01", "2023-05-02", "2023-05-03",
    "2023-06-22", "2023-06-23", "2023-06-24",
    "2023-09-29", "2023-09-30", "2023-10-01", "2023-10-02", "2023-10-03", "2023-10-04", "2023-10-05", "2023-10-06"
];
holiday().then((result) => {
    if (!result.code) return;
    _festivals = result.data;
});

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
        if (hours < 10 || hours >= 19) {
            return `很抱歉，目前是水果客服下班时间，请您留言问题。服务时间：${serviceTime}`;
        }
        //非周末判断
    } else if (currTime < minDate || currTime >= maxDate) {
        return `很抱歉，目前是水果客服下班时间，请您留言问题。服务时间：${serviceTime}`;
    }
    //不弹窗
    return '';
}