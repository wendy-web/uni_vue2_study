import { request } from '@/utils'

export default {
  getList: (data) => request.post('/xdyhos/goods_group/shopList', data),
  getDetails: (data) => request.post('/xdyhos/goods_group/shopXq', data),
  dos: (data) => request.post('/xdyhos/goods_group/shopCreate', data),
  del: (data) => request.post('/xdyhos/goods_group/shopDel', data),
  category: (data) => request.post('/xdyhos/Get/category', data),
  goodsQueryList: (data) => request.post('/api/Get/goodsQuery', data),
  goodsCats: (data) => request.post('/api/Pinduoduo/goodsCats', data),
  goodsOpt: (data) => request.post('/api/Pinduoduo/goodsOpt', data),
}
