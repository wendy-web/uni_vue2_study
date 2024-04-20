import { request } from '@/utils';

export default {
  create: (data) => request.post('/apios/free/create', data),
  getXq: (data) => request.post('/apios/free/getXq', data),
}
