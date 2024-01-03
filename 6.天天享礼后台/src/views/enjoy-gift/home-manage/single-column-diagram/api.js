import { request } from '@/utils'

export default {
    getList: (data) => request.post('/apios/layout/getSingleImageList', data),
    operatSingleImage: (data) => request.post('/apios/layout/createSingleImage', data),
    getSingleImage: (data) => request.post('/apios/layout/getSingleImage', data),
    deleteSingleImage: (data) => request.post('/apios/layout/deleteSingleImage', data),
    getCouponList: (data) => request.post('/apios/coupon/getAll', data),
    getSingleImageTags: (data) => request.post('/apios/layout/getSingleImageTags', data),
    updateSingleImageStatus: (data) => request.post('/apios/layout/updateSingleImageStatus', data),
    goodsQueryList: (data) => request.post('/api/Get/goodsQuery', data),
}