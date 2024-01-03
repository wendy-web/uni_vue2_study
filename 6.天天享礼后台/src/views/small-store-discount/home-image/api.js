import { request } from '@/utils'

export default {
  singletonCreate: (data) => request.post('/xdyhos/Team/singletonCreate', data),
  singletonXq: (data) => request.post('/xdyhos/Team/singletonXq', data),
}
