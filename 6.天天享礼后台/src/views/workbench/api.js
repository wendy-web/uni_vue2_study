import { request } from '@/utils'

export default {
  getList: (data) => request.post('/apios/user/getList', data),
  operatUser: (data) => request.post('/apios/user/create', data),
  deleteUser: (data) => request.post('/apios/user/delete', data),
}
