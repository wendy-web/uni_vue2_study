import { request } from '@/utils'

export default {
  goodsList: (data) => request.post('/apios/Hw/goodsList', data),
}
