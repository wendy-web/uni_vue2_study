import { request } from '@/utils'

export default {
  getList: (data) => request.post('/apios/popover/getList', { ...data, people_type: 2 }),
  operatSingleImage: (data) => request.post('/apios/popover/create', { ...data, people_type: 2 }),
  getSingleImage: (data) => request.post('/apios/popover/getXq', data),
  deleteSingleImage: (data) => request.post('/apios/popover/delete', data),
  updateSingleImageStatus: (data) => request.post('/apios/popover/updateStatus', data),
  getLists: (data) => request.post('/apios/Jd/getLists', data),
  getPosition: (data) => request.post('/apios/Extend/bfxlPosition', data),
}
