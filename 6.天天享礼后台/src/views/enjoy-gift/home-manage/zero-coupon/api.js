import { request } from '@/utils'

export default {
    getList: (data) => request.post('/apios/zero_credits/getList', data),
    updateStatus: (data) => request.post('/apios/zero_credits/doStatus', data),
    delete: (data) => request.post('/apios/zero_credits/del', data),
    getGroupDetails: (data) => request.post('/apios/zero_credits/getXq', data),
    operatGroup: (data) => request.post('/apios/zero_credits/create', data),
    goodsQueryList: (data) => request.post('/api/Get/goodsQuery', data),
    goodsSearch: (data) => request.post('/api/Pinduoduo/goodsSearch', data),
}