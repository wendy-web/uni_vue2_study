import { request } from '@/utils';

export default {
  getList: (data) => request.post('/apios/coupon/getList', data),
  getCoupon: (data) => request.post('/apios/coupon/getInfo', data),
  createCoupon: (data) => request.post('/apios/coupon/create', data),
  updateStatus: (data) => request.post('/apios/coupon/updateStatus', data),
  deleteGroupCoupon: (data) => request.post('/apios/coupon/deleteGroupCoupon', data),
  getGoodsOption: (data) => request.post('/apios/Goods/getAll', data),
  getLists: (data) => request.post('/apios/Jd/getLists', data),
  getAll: (data) => request.post('/apios/Zero_credits/getLists'),
  getGroup: (data) => request.post('/apios/Popover/getLists', data),
  goodsList: (data) => request.post('/apios/Hw/goodsList', data),
}
