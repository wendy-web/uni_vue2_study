import { request } from '@/utils';

export default {
  goodsList: (data) => request.post('/ttddlos/Third_goods/goodsList', data),
  create: (data) => request.post('/ttddlos/Third_goods/create', data),
  goodsStatus: (data) => request.post('/ttddlos/Third_goods/goodsStatus', data),
  goodsXq: (data) => request.post('/ttddlos/Third_goods/goodsXq', data),
}
