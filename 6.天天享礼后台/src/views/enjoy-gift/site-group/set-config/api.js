import { request } from '@/utils';

export default {
  xlXq: (data) => request.post('/apios/popover/xlXq', data),
  xlCreate: (data) => request.post('/apios/popover/xlCreate', data),
  shopXq: (data) => request.post('/apios/popover/shopXq', data),
  shopCreate: (data) => request.post('/apios/popover/shopCreate', data),
  lightCreate: (data) => request.post('/apios/popover/lightCreate', data),
  lightXq: (data) => request.post('/apios/popover/lightXq', data),
  watchCreate: (data) => request.post('/apios/popover/watchCreate', data),
  watchXq: (data) => request.post('/apios/popover/watchXq', data),
  advertisementCreate: (data) => request.post('/apios/popover/advertisementCreate', data),
  advertisementXq: (data) => request.post('/apios/popover/advertisementXq', data),
  guessCreate: (data) => request.post('/apios/popover/guessCreate', data),
  guessXq: (data) => request.post('/apios/popover/guessXq', data),
  openCreate: (data) => request.post('/apios/popover/openCreate', data),
  openXq: (data) => request.post('/apios/popover/openXq', data),
}
