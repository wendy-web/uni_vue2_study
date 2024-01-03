import { request } from '@/utils'

export default {
    getList: (data) => request.post('/apios/Jd/jdGoods', data),
    syncGoods: (data) => request.post('api/Get/jdGoods', data),
    getCategory: (data) => request.post('/apios/Jd/getCategory', data),
}