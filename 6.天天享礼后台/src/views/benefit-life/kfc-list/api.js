import { request } from '@/utils'

export default {
  getList: (data) => request.post('/apios/order/getList', data),
  getStat: () => request.post('/apios/order/getStat'),
  getMt: (data) => request.post('/api/Get/meituanOrder', data)
}
