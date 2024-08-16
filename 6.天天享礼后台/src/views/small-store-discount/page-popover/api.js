import { request } from '@/utils'

export default {
    getList: (data) => request.post('/xdyhos/popover/pageList', data),
    operatSingleImage: (data) => request.post('/xdyhos/popover/pageCreate', data),
    getSingleImage: (data) => request.post('/xdyhos/popover/pageXq', data),
    deleteSingleImage: (data) => request.post('/xdyhos/popover/pageDelete', data),
    updateSingleImageStatus: (data) => request.post('/xdyhos/popover/pageStatus', data),
    goodsQueryList: (data) => request.post('/api/Get/goodsQuery', data),
    goodsSearch: (data) => request.post('/api/Pinduoduo/goodsSearch', data),
}