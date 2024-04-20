import { request } from '@/utils'

export default {
    getList: (data) => request.post('/apios/popover/getList', data),
    operatSingleImage: (data) => request.post('/apios/popover/create', data),
    getSingleImage: (data) => request.post('/apios/popover/getXq', data),
    deleteSingleImage: (data) => request.post('/apios/popover/delete', data),
    updateSingleImageStatus: (data) => request.post('/apios/popover/updateStatus', data),
    goodsQueryList: (data) => request.post('/api/Get/goodsQuery', data),
    getLists: (data) => request.post('/apios/Jd/getLists', data),
    getGroup: (data) => request.post('/apios/Popover/getLists', data),
    goodsSearch: (data) => request.post('/api/Pinduoduo/goodsSearch', data),
    getPosition: (data) => request.post('/apios/Extend/bfxlPosition', data),
}