import { request } from '@/utils'

export default {
  getList: (data) => request.post('/apios/activity/getSecKillList', data),
  getCoupon: (data) => request.post('/apios/activity/getSecKill', data),
  createCoupon: (data) => request.post('/apios/activity/createSecKill', data),
  updateStatus: (data) => request.post('/apios/activity/updateStatus', data),
  getCouponList: (data) => request.post('/apios/coupon/getAll', data),
}
