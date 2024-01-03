import { request } from '@/utils'

export default {
  getList: (data) => request.post('/apios/task/getList', data),
  updateStatus: (data) => request.post('/apios/task/updateStatus', data),
  getInfo: (data) => request.post('/apios/task/getInfo', data),
  updateInfo: (data) => request.post('/apios/task/updateInfo', data),
  createAward: (data) => request.post('/apios/task/createAward', data),
  getCouponList: (data) => request.post('/apios/coupon/getAll', data),
}
