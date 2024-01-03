import { request } from '@/utils'

export default {
  login: (data) => request.post('/apios/index/login', data, { noNeedToken: true }),
}
