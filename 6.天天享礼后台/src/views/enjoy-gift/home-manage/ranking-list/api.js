import { request } from '@/utils'

export default {
    getList: (data) => request.post('/apios/Layout/getTopList', data),
    operatBanner: (data) => request.post('/apios/layout/createTop', data),
    deleteTop: (data) => request.post('/apios/layout/deleteTop', data),
    getCouponList: (data) => request.post('/apios/coupon/getAll', data),
    updateTopStatus: (data) => request.post('/apios/layout/updateTopStatus', data),
    goodsQueryList: (data) => request.post('/api/Get/goodsQuery', data),
    showTop: (data) => request.post('/apios/Layout/showTop', data),
}