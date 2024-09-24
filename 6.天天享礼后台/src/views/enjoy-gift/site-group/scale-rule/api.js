import { request } from '@/utils'

export default {
  getList: (data) => request.post('/apios/Scale/getList', data),
  operatSingleImage: (data) => request.post('/apios/Scale/create', data),
  getSingleImage: (data) => request.post('/apios/Scale/getXq', data),
  delete: (data) => request.post('/apios/Scale/delete', data),
}
