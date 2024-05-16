import API from '../xhHttp.js';

// 弹窗事件
export function popover(data) {
    return API.request({
        url: '/api/Index/popover',
        method: 'post',
        data
    });
}

export function popoverRember(data) {
    return API.request({
        url: '/api/Index/popoverRember',
        method: 'post',
        data
    });
}