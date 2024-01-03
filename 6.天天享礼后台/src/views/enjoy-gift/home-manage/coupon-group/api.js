import { request } from '@/utils'

export default {
  getList: (data) => request.post('/apios/coupon/getGroupList', data),
  getGroupDetails: (data) => request.post('/apios/coupon/getGroup', data),
  operatGroup: (data) => request.post('/apios/coupon/createGroup', data),
  deleteGroup: (data) => request.post('/apios/coupon/deleteGroup', data),
  couponList: (data) => request.post('/apios/coupon/getAll', data),
  goodsQueryList: (data) => request.post('/api/Get/goodsQuery', data),
  goodsSearch: (data) => request.post('/api/Pinduoduo/goodsSearch', data),
  coupnGroup: (data) => request.post('/apios/coupon/coupnGroup', data),
  updateTopStatus: (data) => request.post('/apios/coupon/groupStatus', data),
}
