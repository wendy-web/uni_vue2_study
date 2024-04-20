import { request } from '@/utils';

export default {
  getList: (data) => request.post('/apios/coupon/getGroupList', data),
  delistLog: (data) => request.post('/apios/goods/delistLog', data),
  delistCount: (data) => request.post('/apios/goods/delistCount', data),
}
