import { request } from '@/utils';

export default {
  xlXq: (data) => request.post('/apios/popover/xlXq', data),
  xlCreate: (data) => request.post('/apios/popover/xlCreate', data),
  shopXq: (data) => request.post('/apios/popover/shopXq', data),
  shopCreate: (data) => request.post('/apios/popover/shopCreate', data),
}
