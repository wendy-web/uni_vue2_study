import { request } from '@/utils'

export default {
    getList: (data) => request.post('/xdyhos/Team/orderList', data),
    orderGmv: (data) => request.post('/xdyhos/Team/orderGmv', data),
}