import { request } from '@/utils'

export default {
  getList: (data) => request.post('/ttddlos/Goods/index', data),
  getDetails: (data) => request.post('/ttddlos/Goods/xq', data),
  dos: (data) => request.post('/ttddlos/Goods/dos', data),
  updateStatus: (data) => request.post('/ttddlos/Goods/use', data),
  syncGoods: (data) => request.post('/ttddlos/goods/syncGoods', data),
}
