import { request } from '@/utils'

export default {
  getList: (data) => request.post('/apios/Goods/getList', data),
  getDetails: (data) => request.post('/apios/Goods/getDetails', data),
  edit: (data) => request.post('/apios/Goods/edit', data),
  updateStatus: (data) => request.post('/apios/Goods/setStatus', data),
  syncGoods: (data) => request.post('/apios/Goods/syncGoods', data),
}
