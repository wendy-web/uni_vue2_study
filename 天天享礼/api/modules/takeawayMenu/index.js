import API from '../../xhHttp.js';

export function brandQuery(data) {
    return API.request({
        url: '/api/Hai_wei/brandQuery',
        method: 'post',
        data
    });
}
export function cityQuery(data) {
    return API.request({
        url: '/api/Hai_wei/cityQuery',
        method: 'post',
        data
    });
}
export function cities(data) {
    return API.request({
        url: '/api/Qian_zhu/cities',
        method: 'post',
        data
    });
}