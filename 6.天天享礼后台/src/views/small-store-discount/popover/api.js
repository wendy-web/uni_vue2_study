import { request } from '@/utils'

export default {
    getList: (data) => request.post('/xdyhos/popover/getList', data),
    operatSingleImage: (data) => request.post('/xdyhos/popover/create', data),
    getSingleImage: (data) => request.post('/xdyhos/popover/getXq', data),
    deleteSingleImage: (data) => request.post('/xdyhos/popover/delete', data),
    updateSingleImageStatus: (data) => request.post('/xdyhos/popover/updateStatus', data),
    getCouponList: (data) => request.post('/xdyhos/Goods/list', data),
    popoverSite: (data) => request.post('/xdyhos/popover/doSite', data),
    siteList: (data) => request.post('/xdyhos/popover/siteList', data),
}