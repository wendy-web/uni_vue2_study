import { request } from '@/utils'

export default {
  getList: (data) => request.post('/apios/Hw/getList', data),
  operatSingleImage: (data) => request.post('/apios/Hw/create', data),
  getSingleImage: (data) => request.post('/apios/Hw/getXq', data),
}
