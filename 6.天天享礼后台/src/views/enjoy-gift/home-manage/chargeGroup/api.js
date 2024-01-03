import { request } from '@/utils'

export default {
    getGroupDetails: (data) => request.post('/apios/coupon/getGroup', data),
    couponList: (data) => request.post('/apios/coupon/getAll', data),
    goodsQueryList: (data) => request.post('/api/Get/goodsQuery', data),
    createCategory: (data) => request.post('/apios/Take/createCategory', data),
    parentCategory: (data) => request.post('/apios/Take/parentCategory', data),
    categoryList: (data) => request.post('/apios/Take/categoryList', data),
    categoryXq: (data) => request.post('/apios/Take/categoryXq', data),
    categoryDel: (data) => request.post('/apios/Take/categoryDel', data),
}