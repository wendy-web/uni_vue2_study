import API from '../xhHttp.js';

// 弹窗事件
export function popover(data) {
    return API.request({
        url: '/api/goods/popover',
        method: 'post',
        data
    });
}

export function popoverRember(data) {
    return API.request({
        url: '/api/goods/popoverRember',
        method: 'post',
        data
    });
}
