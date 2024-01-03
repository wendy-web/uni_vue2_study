import { request } from '@/utils'

export default {
  getList: (data) => request.post('/apios/Layout/getBannerList', data),
  operatBanner: (data) => request.post('/apios/layout/createBanner', data),
  deleteBanner: (data) => request.post('/apios/layout/deleteBanner', data),
  getCouponList: (data) => request.post('/apios/coupon/getAll', data),
  updateBannerStatus: (data) => request.post('/apios/layout/updateBannerStatus', data),
}
