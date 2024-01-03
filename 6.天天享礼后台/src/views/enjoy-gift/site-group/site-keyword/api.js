import { request } from '@/utils'

export default {
  getList: (data) => request.post('/apios/jd/getkeywordList', data),
  operatSingleImage: (data) => request.post('/apios/jd/keywordCreate', data),
  getSingleImage: (data) => request.post('/apios/jd/keywordXq', data),
  deleteSingleImage: (data) => request.post('/apios/jd/keywordDelete', data),
}
