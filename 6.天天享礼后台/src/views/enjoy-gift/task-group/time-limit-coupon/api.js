import { request } from '@/utils'

export default {
  getList: (data) => request.post('/apios/activity/getCouponList', data),
  getCoupon: (data) => request.post('/apios/activity/getCoupon', data),
  createCoupon: (data) => request.post('/apios/activity/createCoupon', data),
  updateStatus: (data) => request.post('/apios/activity/updateStatus', data),
}
