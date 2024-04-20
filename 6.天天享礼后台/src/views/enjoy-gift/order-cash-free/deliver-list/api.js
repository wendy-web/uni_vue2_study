import { request } from '@/utils';

export default {
  giftCreate: (data) => request.post('/apios/free/activeDeliver', data),
  giftList: (data) => request.post('/apios/free/giftActive', data),
  giftXq: (data) => request.post('/apios/free/activeXq', data),
}
