import { request } from '@/utils';

export default {
  create: (data) => request.post('/apios/Profit/create', data),
  getXq: (data) => request.post('/apios/Profit/getXq', data),
}
