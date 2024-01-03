import { request } from '@/utils'

export default {
  getList: (data) => request.post('/apios/Jd/getList', data),
  getGroupDetails: (data) => request.post('/apios/Jd/getXq', data),
  operatGroup: (data) => request.post('/apios/Jd/createGroup', data),
  deleteGroup: (data) => request.post('/apios/Jd/del', data),
  getCategory: (data) => request.post('/apios/Jd/getCategory', data),
  category: (data) => request.post('/api/Get/category', data),
  updateStatus: (data) => request.post('/apios/Jd/updateStatus', data),
  goodsCats: (data) => request.post('/api/Pinduoduo/goodsCats', data),
  goodsOpt: (data) => request.post('/api/Pinduoduo/goodsOpt', data),
}
