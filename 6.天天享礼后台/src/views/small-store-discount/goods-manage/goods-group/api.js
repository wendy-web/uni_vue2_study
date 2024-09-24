import { request } from '@/utils'

export default {
  getList: (data) => request.post('/xdyhos/goods_group/index', data),
  getDetails: (data) => request.post('/xdyhos/goods_group/xq', data),
  dos: (data) => request.post('/xdyhos/goods_group/dos', data),
  del: (data) => request.post('/xdyhos/goods_group/del', data),
  getGoods: (data) => request.post('/xdyhos/goods/index', data),
  category: (data) => request.post('/xdyhos/Get/category', data),
  goodsQueryList: (data) => request.post('/api/Get/goodsQuery', data),
  goodsCats: (data) => request.post('/api/Pinduoduo/goodsCats', data),
  goodsOpt: (data) => request.post('/api/Pinduoduo/goodsOpt', data),
  goodsSearch: (data) => request.post('/api/Pinduoduo/goodsSearch', data),
  shopGroup: (data) => request.post('/xdyhos/goods_group/shopGroup', data),
}
