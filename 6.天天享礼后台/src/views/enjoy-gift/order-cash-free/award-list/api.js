import { request } from '@/utils';

export default {
  giftCreate: (data) => request.post('/apios/free/giftCreate', data),
  giftList: (data) => request.post('/apios/free/giftList', data),
  giftXq: (data) => request.post('/apios/free/giftXq', data),
}
