import { request } from '@/utils'

export default {
  getList: (data) => request.post('/ttddlos/Goods_recommend/index', data),
  del: (data) => request.post('/ttddlos/Goods_recommend/del', data),
  use: (data) => request.post('/ttddlos/Goods_recommend/use', data),
  dos: (data) => request.post('/ttddlos/Goods_recommend/dos', data),
  xq: (data) => request.post('/ttddlos/Goods_recommend/xq', data),
  getGoods: (data) => request.post('/ttddlos/Goods/index', data),
}
