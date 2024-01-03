import { request } from '@/utils'

export default {
  getList: (data) => request.post('/xdyhos/Draw_group/index', data),
  dos: (data) => request.post('/xdyhos/Draw_group/dos', data),
  use: (data) => request.post('/xdyhos/Draw_group/use', data),
  xq: (data) => request.post('/xdyhos/Draw_group/xq', data),
  del: (data) => request.post('/xdyhos/Draw_group/del', data),
  create: (data) => request.post('/xdyhos/Draw_group/create', data),
}
