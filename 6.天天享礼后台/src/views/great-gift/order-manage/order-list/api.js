import { request } from '@/utils'

export default {
  getList: (data) => request.post('/ttddlos/Order/index', data),
}
