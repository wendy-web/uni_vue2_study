import { request } from '@/utils';

export default {
  groupList: (data) => request.post('/apios/Group/groupList', data),
  groupXq: (data) => request.post('/apios/group/groupXq', data),
  groupCreate: (data) => request.post('/apios/Group/groupCreate', data),
  queueList: (data) => request.post('/apios/Group/queueList', data),
  queueEdit: (data) => request.post('/apios/Group/queueEdit', data),
  queueDel: (data) => request.post('/apios/Group/queueDel', data),
  importGoods: (data) => request.post('/apios/Group/importGoods', data),
}
