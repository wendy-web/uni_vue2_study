import { request } from '@/utils'

export default {
    getList: (data) => request.post('/apios/Goodstheme/getList', data),
    updateStatus: (data) => request.post('/apios/Goodstheme/status', data),
    delete: (data) => request.post('/apios/Goodstheme/delete', data),
    getGroupDetails: (data) => request.post('/apios/Goodstheme/getXq', data),
    operatGroup: (data) => request.post('/apios/Goodstheme/create', data),
    couponList: (data) => request.post('/apios/coupon/getAll', data),
    goodsQueryList: (data) => request.post('/api/Get/goodsQuery', data),
    goodsSearch: (data) => request.post('/api/Pinduoduo/goodsSearch', data),
    goodsCats: (data) => request.post('/api/Pinduoduo/goodsCats', data),
    goodsOpt: (data) => request.post('/api/Pinduoduo/goodsOpt', data),
    category: (data) => request.post('/api/Get/category', data),
}