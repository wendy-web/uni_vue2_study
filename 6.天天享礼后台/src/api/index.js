import { request } from '@/utils'

export default {
  getUser: () => request.post('/apios/index/getUser'),
  refreshToken: () => request.post('/auth/refreshToken', null, { noNeedTip: true }),
  getPower: (data) => request.post('/apios/Get/getPower', data),
}
