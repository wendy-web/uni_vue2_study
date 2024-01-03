import { request } from '@/utils'

export default {
    getCouponList: (data) => request.post('/apios/coupon/getAll', data),
    goodsQueryList: (data) => request.post('/api/Get/goodsQuery', data),
    takeXq: (data) => request.post('/apios/Take/takeXq', data),
    createTake: (data) => request.post('/apios/Take/createTake', data),
}