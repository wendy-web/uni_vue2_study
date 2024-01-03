import { request } from '@/utils'

export default {
  getList: (data) => request.post('/ttddlos/task/index', data),
  edit: (data) => request.post('/ttddlos/task/edit', data),
  use: (data) => request.post('/ttddlos/task/use', data),
  xq: (data) => request.post('/ttddlos/task/xq', data),
}
