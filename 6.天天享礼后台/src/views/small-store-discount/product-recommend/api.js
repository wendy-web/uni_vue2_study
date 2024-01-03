import { request } from '@/utils'

export default {
  getList: (data) => request.post('/xdyhos/Goods_recommend/index', data),
  del: (data) => request.post('/xdyhos/Goods_recommend/del', data),
  use: (data) => request.post('/xdyhos/Goods_recommend/use', data),
  dos: (data) => request.post('/xdyhos/Goods_recommend/dos', data),
  xq: (data) => request.post('/xdyhos/Goods_recommend/xq', data),
  getGoods: (data) => request.post('/xdyhos/Goods/index', data),
}
