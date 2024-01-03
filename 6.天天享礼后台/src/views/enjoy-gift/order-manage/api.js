import { request } from '@/utils'

export default {
  getList: (data) => request.post('/apios/order/getList', data),
  getStat: () => request.post('/apios/order/getStat'),
  getMt: (data) => request.post('/api/Get/meituanOrder', data),
  getJd: (data) => request.post('/api/Get/jdOrder', data),
  getBalance: (data) => request.post('/api/Hai_wei/balanceQuery', data),
  getExtension: (data) => request.post('/apios/Extend/getExtension', data),
  getChannel: (data) => request.post('/apios/Extend/getChannel', data),
  orderGmv: (data) => request.post('/apios/order/orderGmv', data),
}
