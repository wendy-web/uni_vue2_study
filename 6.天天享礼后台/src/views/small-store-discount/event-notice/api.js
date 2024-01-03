import { request } from '@/utils'

export default {
  getInfo: (data) => request.post('/xdyhos/templete/getInfo', data),
  create: (data) => request.post('/xdyhos/templete/create', data),
  sendMes: (data) => request.post('/xdyhos/Templete/sendMes', data),
}
