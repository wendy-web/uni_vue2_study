import { request } from '@/utils'

export default {
  getInfo: (data) => request.post('/apios/templete/getInfo', data),
  create: (data) => request.post('/apios/templete/create', data),
  sendMes: (data) => request.post('/apios/Templete/sendMes', data),
}
