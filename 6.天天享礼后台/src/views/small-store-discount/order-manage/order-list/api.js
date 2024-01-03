import { request } from '@/utils'

export default {
    getList: (data) => request.post('/xdyhos/Order/index', data),
    orderGmv: (data) => request.post('/xdyhos/Order/orderGmv', data),
}