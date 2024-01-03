import { request } from '@/utils'

export default {
  getList: (data) => request.post('/xdyhos/task/index', data),
  edit: (data) => request.post('/xdyhos/task/edit', data),
  use: (data) => request.post('/xdyhos/task/use', data),
  xq: (data) => request.post('/xdyhos/task/xq', data),
}
