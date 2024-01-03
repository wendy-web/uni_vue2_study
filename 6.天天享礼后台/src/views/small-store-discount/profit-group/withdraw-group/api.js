import { request } from '@/utils'

export default {
    getList: (data) => request.post('/xdyhos/Team/withdrawList', data),
    orderGmv: (data) => request.post('/xdyhos/Team/withdrawProfit', data),
}