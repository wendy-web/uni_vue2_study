import { request } from '@/utils'

export default {
  getList: (data) => request.post('/ttddlos/goods_group/index', data),
  getDetails: (data) => request.post('/ttddlos/goods_group/xq', data),
  dos: (data) => request.post('/ttddlos/goods_group/dos', data),
  del: (data) => request.post('/ttddlos/goods_group/del', data),
  getGoods: (data) => request.post('/ttddlos/goods/index', data),
}
