import { request } from '@/utils';

export default {
  scoreXq: (data) => request.post('/apios/Popover/scoreXq', data),
  scoreImg: (data) => request.post('/apios/Popover/scoreImg', data),
  getList: (data) => request.post('/apios/Layout/creditsList', data),
  createList: (data) => request.post('/apios/Layout/creditsWord', data),
  btnCreate: (data) => request.post('/apios/Popover/btnCreate', data),
  btnXq: (data) => request.post('/apios/Popover/btnXq', data),
  homeImg: (data) => request.post('/apios/Popover/homeImg', data),
  homeXq: (data) => request.post('/apios/Popover/homeXq', data),
  zmImg: (data) => request.post('/apios/Popover/zmImg', data),
  zmXq: (data) => request.post('/apios/Popover/zmXq', data),
  newXq: (data) => request.post('/apios/Popover/newXq', data),
  newLosing: (data) => request.post('/apios/Popover/newLosing', data),
  creditsCreate: (data) => request.post('/apios/popover/creditsCreate', data),
  creditsXq: (data) => request.post('/apios/popover/creditsXq', data),
  pathXq: (data) => request.post('/apios/popover/newpathXq', data),
  pathCreate: (data) => request.post('/apios/Popover/newpathCreate', data),
}
