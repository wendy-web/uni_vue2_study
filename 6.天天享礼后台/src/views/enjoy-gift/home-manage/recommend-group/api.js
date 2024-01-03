import { request } from '@/utils'

export default {
    scoreList: (data) => request.post('/apios/Popover/scoreList', data),
    scoreCoupon: (data) => request.post('/apios/Popover/scoreCoupon', data),
    couponList: (data) => request.post('/apios/coupon/getAll', data),
    goodsQueryList: (data) => request.post('/api/Get/goodsQuery', data),
    scoreDel: (data) => request.post('/apios/Popover/scoreDel', data),
    goodsSearch: (data) => request.post('/api/Pinduoduo/goodsSearch', data),
}