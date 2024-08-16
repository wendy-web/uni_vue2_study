import { request } from '@/utils';

export default {
  getList: (data) => request.post('/ttddlos/goods_group/index', data),
  getDetails: (data) => request.post('/ttddlos/goods_group/xq', data),
  dos: (data) => request.post('/ttddlos/goods_group/dos', data),
  del: (data) => request.post('/ttddlos/goods_group/del', data),
  getGoods: (data) => request.post('/ttddlos/goods/index', data),
  orderList: (data) => request.post('/ttddlos/Third_goods/orderList', data),
  orderRefund: (data) => request.post('/ttddlos/Third_goods/orderRefund', data),
  orderXq: (data) => request.post('/ttddlos/Third_goods/orderXq', data),
  company: (data) => request.post('/ttddlos/Third_goods/company', data),
  orderSend: (data) => request.post('/ttddlos/Third_goods/orderSend', data),
}
