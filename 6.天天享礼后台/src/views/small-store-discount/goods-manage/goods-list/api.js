import { request } from '@/utils'

export default {
  getList: (data) => request.post('/xdyhos/Goods/index', data),
  getDetails: (data) => request.post('/xdyhos/Goods/xq', data),
  dos: (data) => request.post('/xdyhos/Goods/dos', data),
  updateStatus: (data) => request.post('/xdyhos/Goods/use', data),
  syncGoods: (data) => request.post('/xdyhos/goods/syncGoods', data),
}
