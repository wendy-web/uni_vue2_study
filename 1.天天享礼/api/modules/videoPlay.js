import API from '../xhHttp.js';
import { getENV } from '@/utils/auth.js';

const env = getENV();
// 验证观看次数
export function lookCk() {
    return API.request({
        url: '/api/Aion_line/lookCk',
        method: 'post',
    });
}
// http://192.168.1.68:82/api/Aion_line/addNum
// export function addNum(data) {
// 	return API.request({
// 		url: '/api/Aion_line/addNum',
// 		method: 'post',
// 		data
// 	});
// }
// 本地的域名更改 - 根据环境的特殊
export function addNum() {
    let url = '';
    let currentUrl = false;
    if (env == 'test') {
        url = 'http://192.168.1.68:82/api/Aion_line/addNum';
        currentUrl = true
    } else {
        url = '/api/Aion_line/addNum';
        currentUrl = false;
    }
    return API.request({
        url,
        method: 'post',
        currentUrl
    });
}