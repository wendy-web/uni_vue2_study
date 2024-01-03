import { request } from '@/utils'

export default {
    goodsQueryList: (data) => request.post('/api/Get/goodsQuery', data),
    getXq: (data) => request.post('/apios/Bfjd/getXq', data),
    create: (data) => request.post('/apios/Bfjd/create', data),
}